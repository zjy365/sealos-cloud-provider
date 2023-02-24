import { ApplyYaml, GetUserDefaultNameSpace, K8sApi } from '@/services/kubernetes';
import { JsonResp } from '@/services/response';
import * as k8s from '@kubernetes/client-node';
import JSYAML from 'js-yaml';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { scp_yaml, kubeconfig } = req.body;
  const kc = K8sApi(kubeconfig);
  const kube_user = kc.getCurrentUser();

  if (kube_user === null) {
    res.status(400);
    return;
  }

  try {
    // Append namespace
    const namespace = GetUserDefaultNameSpace(kube_user.name);
    const specs = JSYAML.loadAll(scp_yaml) as k8s.KubernetesObject[];
    const validSpecs = specs.filter((s) => s && s.kind && s.metadata);

    let temp_crd = [];
    for (const spec of validSpecs) {
      spec.metadata = {
        ...spec.metadata,
        namespace
      };
      temp_crd.push(JSYAML.dump(spec));
    }
    let scp_crd = temp_crd.join('---\n');

    // Apply crd
    const result = await ApplyYaml(kc, scp_crd);
    JsonResp(result, res);
  } catch (err) {
    if (err instanceof k8s.HttpError) {
      console.log(err.body.message, '---');
    }
    JsonResp(err, res);
  }
}
