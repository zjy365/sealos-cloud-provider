import type { NextApiRequest, NextApiResponse } from 'next';
import * as k8s from '@kubernetes/client-node';
import { K8sApi } from '@/services/kubernetes';
import { JsonResp } from '@/services/response';
import { pickBy } from 'lodash';
import { authSession } from '@/services/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.body;
  const kubeconfig = await authSession(req.headers);
  const kc = K8sApi(kubeconfig);

  const kube_user = kc.getCurrentUser();
  if (kube_user === null) {
    return res.status(400);
  }

  const outputArray = (val: object): { label: string; value: string }[] => {
    return Object.entries(val).map(([label, value]) => ({ label, value }));
  };

  try {
    const result = await kc
      .makeApiClient(k8s.CoreV1Api)
      .readNamespacedConfigMap(name, 'infra-system');
    if (result?.body?.data) {
      const aliyunObj = pickBy(result.body.data, (value, key) => {
        return key.startsWith('aliyun');
      });
      const awsObj = pickBy(result.body.data, (value, key) => {
        return key.startsWith('aws');
      });
      JsonResp({ aliyun: outputArray(aliyunObj), aws: outputArray(awsObj) }, res);
    }
  } catch (err) {
    if (err instanceof k8s.HttpError) {
      console.log(err.body.message);
    }
    JsonResp(err, res);
  }
}
