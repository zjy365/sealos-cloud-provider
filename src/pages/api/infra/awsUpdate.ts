import { authSession } from '@/services/auth';
import { CRDMeta, GetUserDefaultNameSpace, K8sApi, UpdateCRD } from '@/services/kubernetes';
import { JsonResp } from '@/services/response';
import { compare } from 'fast-json-patch';
import JSYAML from 'js-yaml';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { scp_yaml, old_scp_yaml, scp_name } = req.body;
  const kubeconfig = await authSession(req.headers);
  const kc = K8sApi(kubeconfig);
  const kube_user = kc.getCurrentUser();
  if (kube_user === null) {
    res.status(400);
    return;
  }

  const meta: CRDMeta = {
    group: 'infra.sealos.io',
    version: 'v1',
    namespace: GetUserDefaultNameSpace(kube_user.name),
    plural: 'infras'
  };

  try {
    const fresh_yaml = JSYAML.loadAll(scp_yaml)[0];
    const original_yaml = JSYAML.loadAll(old_scp_yaml)[0];
    const patch = compare(original_yaml as object, fresh_yaml as object);
    const result = await UpdateCRD(kc, meta, scp_name, patch);
    JsonResp(result.body, res);
  } catch (error) {
    JsonResp(error, res);
  }
}
