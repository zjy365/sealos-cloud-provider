import * as k8s from '@kubernetes/client-node';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CRDMeta, DeleteCRD, GetUserDefaultNameSpace, K8sApi } from '@/services/kubernetes';
import { JsonResp } from '@/services/response';
import { authSession } from '@/services/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { scp_name } = req.body;
    const kubeconfig = await authSession(req.headers);
    const kc = K8sApi(kubeconfig);
    const kube_user = kc.getCurrentUser();

    if (kube_user === null) {
      res.status(400);
      return;
    }

    const infraMeta: CRDMeta = {
      group: 'infra.sealos.io',
      version: 'v1',
      namespace: GetUserDefaultNameSpace(kube_user.name),
      plural: 'infras'
    };

    const clusterMeta: CRDMeta = {
      group: 'cluster.sealos.io',
      version: 'v1',
      namespace: GetUserDefaultNameSpace(kube_user.name),
      plural: 'clusters'
    };
    const infra_result = await DeleteCRD(kc, infraMeta, scp_name);
    const cluster_result = await DeleteCRD(kc, clusterMeta, scp_name);

    JsonResp({ infra_result, cluster_result }, res);
  } catch (err) {
    if (err instanceof k8s.HttpError) {
      console.log(err.body.message);
    }
    JsonResp(err, res);
  }
}
