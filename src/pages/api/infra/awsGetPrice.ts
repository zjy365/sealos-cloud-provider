import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonResp } from '@/services/response';
import { TDiskOption, TScpForm } from '@/interfaces/infra_common';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    masterType,
    masterCount,
    masterRootDiskSize,
    masterRootDiskType,
    nodeType,
    nodeCount,
    nodeRootDiskSize,
    nodeRootDiskType,
    masterDataDisks,
    nodeDataDisks,
    sealosPlatform
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

  const aliyun_price = {
    'ecs.c7.large': 41,
    'ecs.g7.large': 53,
    'ecs.g7.xlarge': 105,
    cloud_essd: 4.2
  };

  try {
    // const map = new Map(Object.entries(sealosPlatform === 'aws' ? infra_price : aliyun_price));

    if (sealosPlatform === 'aws') {
      const map = new Map(Object.entries(infra_price));
      let master_type = (map.get(masterType) ?? 0) * Number(masterCount);
      let node_type = (map.get(nodeType) ?? 0) * Number(nodeCount);
      let master_root_disk_price = (map.get(masterRootDiskType) ?? 0) * Number(masterRootDiskSize);
      let node_root_disks_price = (map.get(nodeRootDiskType) ?? 0) * Number(nodeRootDiskSize);
      const master_data_disks_price = masterDataDisks.reduce((pre, cur) => {
        let temp = (map.get(cur.volumeType) ?? 0) * Number(cur.capacity);
        return pre + temp;
      }, 0);
      const node_data_disks_price = nodeDataDisks.reduce((pre, cur) => {
        let temp = (map.get(cur.volumeType) ?? 0) * Number(cur.capacity);
        return pre + temp;
      }, 0);
      const sumPrice =
        (master_type +
          node_type +
          master_root_disk_price +
          node_root_disks_price +
          master_data_disks_price +
          node_data_disks_price) /
        100;
      JsonResp({ sumPrice }, res);
    } else if (sealosPlatform === 'aliyun') {
      const map = new Map(Object.entries(aliyun_price));
      let master_type = (map.get(masterType) ?? 0) * Number(masterCount);
      let node_type = (map.get(nodeType) ?? 0) * Number(nodeCount);

      let master_root_disk_price =
        (map.get(masterRootDiskType) ?? 0) + 0.2 * Number(masterRootDiskSize - 20);
      let node_root_disks_price =
        (map.get(nodeRootDiskType) ?? 0) + 0.2 * Number(masterRootDiskSize - 20);
      const master_data_disks_price = masterDataDisks.reduce((pre, cur) => {
        let temp = (map.get(cur.volumeType) ?? 0) + 0.2 * (Number(cur.capacity) - 20);
        return pre + temp;
      }, 0);
      const node_data_disks_price = nodeDataDisks.reduce((pre, cur) => {
        let temp = (map.get(cur.volumeType) ?? 0) + 0.2 * (Number(cur.capacity) - 20);
        return pre + temp;
      }, 0);

      const sumPrice =
        (master_type +
          node_type +
          master_root_disk_price +
          node_root_disks_price +
          master_data_disks_price +
          node_data_disks_price) /
        100;
      JsonResp({ sumPrice }, res);
    }
  } catch (error) {
    JsonResp(error, res);
  }
}
