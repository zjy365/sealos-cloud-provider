import type { NextApiRequest, NextApiResponse } from 'next';
import { CRDMeta, GetCRD, K8sApi, GetUserDefaultNameSpace } from '@/services/kubernetes';
import { JsonResp } from '@/services/response';
import { authSession } from '@/services/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { infraName } = req.body;
    const kubeconfig = await authSession(req.headers);
    const kc = K8sApi(kubeconfig);
    const kube_user = kc.getCurrentUser();
    if (kube_user === null) {
      return res.status(400);
    }
    const infra_meta: CRDMeta = {
      group: 'infra.sealos.io',
      version: 'v1',
      namespace: GetUserDefaultNameSpace(kube_user.name),
      plural: 'infras'
    };
    const infraDesc = await GetCRD(kc, infra_meta, infraName);
    JsonResp(infraDesc.body, res);
  } catch (err) {
    JsonResp(err, res);
  }
}
