import * as k8s from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CRDMeta, K8sApi, ListCRD, GetUserDefaultNameSpace } from '@/services/kubernetes';
import { JsonResp } from '@/services/response';
import { authSession } from '@/services/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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

    const listCrd = await ListCRD(kc, infra_meta);
    JsonResp(listCrd.body, res);
  } catch (err) {
    if (err instanceof k8s.HttpError) {
      console.log(err.body.message);
    }
    JsonResp(err, res);
  }
}
