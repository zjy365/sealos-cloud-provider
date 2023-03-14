import { authSession } from '@/services/auth';
import { CRDMeta, GetCRD, GetUserDefaultNameSpace, K8sApi, UpdateCRD } from '@/services/kubernetes';
import { ForbiddenResp, JsonResp } from '@/services/response';
import { compare } from 'fast-json-patch';
import JSYAML from 'js-yaml';
import type { NextApiRequest, NextApiResponse } from 'next';
import { merge, cloneDeep } from 'lodash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { scp_yaml, scp_name } = req.body;

  try {
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

    const old_scp = await GetCRD(kc, meta, scp_name);
    const new_yaml = JSYAML.loadAll(scp_yaml)[0];
    const fresh_yaml = merge(cloneDeep(old_scp?.body), new_yaml);
    const patch = compare(old_scp?.body as object, fresh_yaml as object);

    const result = await UpdateCRD(kc, meta, scp_name, patch);
    JsonResp(result.body, res);
  } catch (error: any) {
    if (error?.body?.code === 403) {
      ForbiddenResp(error?.body, res);
    } else {
      JsonResp(error, res);
    }
  }
}
