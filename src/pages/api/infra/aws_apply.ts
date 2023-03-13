import { authSession } from '@/services/auth';
import { ApplyYaml, GetUserDefaultNameSpace, K8sApi } from '@/services/kubernetes';
import { ForbiddenResp, JsonResp } from '@/services/response';
import * as k8s from '@kubernetes/client-node';
import JSYAML from 'js-yaml';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { scp_yaml } = req.body;
    const kubeconfig = await authSession(req.headers);
    const kc = K8sApi(kubeconfig);

    const kube_user = kc.getCurrentUser();
    if (kube_user === null) {
      res.status(400);
      return;
    }

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
    let scp_crd = temp_crd.join('\n---\n');
    // Apply crd
    const result = await ApplyYaml(kc, scp_crd);
    JsonResp(result, res);
  } catch (err: any) {
    console.log(err, 'apply-err');
    if (err?.body?.code === 403) {
      ForbiddenResp(err?.body, res);
    } else {
      JsonResp(err, res);
    }
  }
}
