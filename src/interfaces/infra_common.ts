import JSYAML from 'js-yaml';
export const SELECT_ALIYUN_FLAVOR_TYPE = [
  {
    label: '2C4G',
    value: 'ecs.c7.large'
  },
  {
    label: '2C8G',
    value: 'ecs.g7.large'
  },
  {
    label: '4C16G',
    value: 'ecs.g7.xlarge'
  }
];

export const SELECT_FLAVOR_TYPE = [
  {
    label: '2C4G',
    value: 't2.medium'
  },
  {
    label: '2C8G',
    value: 't2.large'
  },
  {
    label: '4C16G',
    value: 't2.xlarge'
  }
];

export const SELECT_ALIYUN_DISK_TYPE = [
  // {
  //   label: 'cloud',
  //   value: 'cloud',
  //   min: 5,
  //   max: 2000
  // },
  // {
  //   label: 'cloud_efciency',
  //   value: 'cloud_efciency',
  //   min: 20,
  //   max: 32768
  // },
  // {
  //   label: 'cloud_ssd',
  //   value: 'cloud_ssd',
  //   min: 20,
  //   max: 32768
  // }
  {
    label: 'cloud_essd',
    value: 'cloud_essd'
  }
  // {
  //   label: 'cloud_auto',
  //   value: 'cloud_auto',
  //   min: 40,
  //   max: 32768
  // }
];

export const SELECT_DISK_TYPE = [
  {
    label: 'gp3',
    value: 'gp3'
  },
  {
    label: 'gp2',
    value: 'gp2'
  }
];

export const generateYamlTemplate = (scpForm: TScpForm) => {
  const infraYamlObj = {
    apiVersion: 'infra.sealos.io/v1',
    kind: 'Infra',
    metadata: {
      name: scpForm.infraName
    },
    spec: {
      platform: scpForm.sealosPlatform,
      hosts: [
        {
          roles: ['master'],
          count: scpForm.masterCount,
          flavor: scpForm.masterType,
          image: scpForm.scpImage,
          disks: [
            {
              capacity: scpForm.masterRootDiskSize,
              volumeType: scpForm.masterRootDiskType,
              type: 'root'
            },
            ...scpForm.masterDataDisks
          ]
        },
        {
          roles: ['node'],
          count: scpForm.nodeCount,
          flavor: scpForm.nodeType,
          image: scpForm.scpImage,
          disks: [
            {
              capacity: scpForm.nodeRootDiskSize,
              volumeType: scpForm.nodeRootDiskType,
              type: 'root'
            },
            ...scpForm.nodeDataDisks
          ]
        }
      ]
    }
  };

  const clusterYamlObj = {
    apiVersion: 'cluster.sealos.io/v1',
    kind: 'Cluster',
    metadata: {
      name: scpForm.infraName,
      annotations: { 'sealos.io/version': scpForm.sealosVersion }
    },
    spec: {
      infra: scpForm.infraName,
      image: [...scpForm.clusterImages]
    }
  };
  try {
    const infraResult = JSYAML.dump(infraYamlObj);
    const clusterResult = JSYAML.dump(clusterYamlObj);

    return `${infraResult}\n---\n${clusterResult}`;
  } catch (error) {
    return 'error';
  }
};

export const convertKeyToLabel = (key: string, platform: 'aws' | 'aliyun' = 'aws') => {
  let selectArray = platform === 'aws' ? SELECT_FLAVOR_TYPE : SELECT_ALIYUN_FLAVOR_TYPE;
  try {
    const item = selectArray.find((item) => item.value === key);
    return item?.label;
  } catch (error) {}
};

export function conversionPrice(price: number, reserve: number = 2) {
  return price?.toFixed(reserve);
}

export const validResourcesName = (str: string): boolean => {
  let pattern = /^[a-z0-9]+([-.][a-z0-9]+)*$/;
  return pattern.test(str);
};

let timeout: any = null;
/**
 *
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 * @return null
 */
export const debounce = (func: Function, wait = 1000, immediate = false) => {
  if (timeout !== null) clearTimeout(timeout);
  if (immediate) {
    const callNow = !timeout;

    timeout = setTimeout(function () {
      timeout = null;
    }, wait);
    if (callNow) typeof func === 'function' && func();
  } else {
    timeout = setTimeout(function () {
      typeof func === 'function' && func();
    }, wait);
  }
};

export type TNodeMetaData = {
  id: string;
  ipaddress: {
    ipType: string;
    ipValue: string;
  }[];
  status: string;
};

export type TNodeListItem = {
  type: 'master' | 'node';
  item: TNodeMetaData;
};

export enum EScpListType {
  All = 'All',
  Masters = 'Masters',
  Nodes = 'Nodes'
}

export type TSelectOption = { label: string; value: string };

export type TDiskOption = {
  capacity: string;
  volumeType: string;
  type?: 'root' | 'data';
  id?: string;
};

export type TScpForm = {
  infraName: string;
  scpImage: string;
  sealosVersion: string;
  sealosPlatform: string;
  clusterImages: string[];
  // master
  masterCount: number;
  masterType: string;
  masterRootDiskSize: number;
  masterRootDiskType: string;
  masterDataDisks: TDiskOption[];
  // node
  nodeCount: number;
  nodeType: string;
  nodeRootDiskSize: number;
  nodeRootDiskType: string;
  nodeDataDisks: TDiskOption[];
};

export type TScpDetailSpecHosts = {
  arch: string;
  count: number;
  disks: {
    capacity: number;
    id: string;
    type: string;
    volumeType: string;
  }[];
  flavor: string;
  image: string;
};
