import type { NextApiRequest, NextApiResponse } from 'next';
import * as k8s from '@kubernetes/client-node';
import { CRDMeta, GetCRD, K8sApi, GetUserDefaultNameSpace } from '@/services/kubernetes';
import { JsonResp } from '@/services/response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { kubeconfig, clusterName } = req.body;
  const kc = K8sApi(kubeconfig);
  const kube_user = kc.getCurrentUser();
  if (kube_user === null) {
    return res.status(400);
  }
  const cluster_meta: CRDMeta = {
    group: 'cluster.sealos.io',
    version: 'v1',
    namespace: GetUserDefaultNameSpace(kube_user.name),
    plural: 'clusters'
  };

  try {
    const clusterDesc = await GetCRD(kc, cluster_meta, clusterName);
    JsonResp(clusterDesc.body, res);
  } catch (err) {
    if (err instanceof k8s.HttpError) {
      console.log(err.body.message);
    }
    JsonResp(err, res);
  }
}
