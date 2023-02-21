import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonResp } from '@/services/response';
import { TScpForm } from '@/interfaces/infra_common';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    masterType,
    masterCount,
    masterRootDiskSize,
    masterRootDiskType,
    nodeType,
    nodeCount,
    nodeRootDiskSize,
    nodeRootDiskType
  } = req.body as TScpForm;
  const infra_price = {
    't2.micro': 10,
    't2.small': 22,
    't2.medium': 43,
    't2.large': 86,
    't2.xlarge': 170,
    't2.2xlarge': 340,
    't3.medium': 27,
    't3.large': 53,
    't3.xlarge': 106,
    't3.2xlarge': 211,
    't4g.medium': 21,
    'c5.large': 74,
    'c5.xlarge': 148,
    'c5.2xlarge': 296,
    'c6g.large': 59,
    'c6g.xlarge': 118,
    gp2: 75 / 30 / 24,
    gp3: 60 / 30 / 24
  };

  const map = new Map(Object.entries(infra_price));
  let s1 = (map.get(masterType) ?? 0) * masterCount;
  let s2 = (map.get(nodeType) ?? 0) * nodeCount;
  let s3 = (map.get(masterRootDiskType) ?? 0) * masterRootDiskSize;
  let s4 = (map.get(nodeRootDiskType) ?? 0) * nodeRootDiskSize;
  const sumPrice = (s1 + s2 + s3 + s4) / 100;

  JsonResp({ sumPrice }, res);
}
