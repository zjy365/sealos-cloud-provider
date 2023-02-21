import IconFont from '@/components/iconfont';
import { NodeStatusComponent } from '@/components/scp_status';
import TitleInfo from '@/components/title_info';
import { convertKeyToLabel, TNodeListItem, TNodeMetaData } from '@/interfaces/infra_common';
import request from '@/services/request';
import useSessionStore from '@/stores/session';
import { hideMiddleChars, splitChars } from '@/utils/strings';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, message, Modal, Radio } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './detail.module.scss';
import DeleteModal from '@/components/delete_modal';

const ScpNodeItem = (props: TNodeListItem) => {
  const { type, item } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const successCopy = (value: string, isShowContent = true) => {
    navigator.clipboard.writeText(value);
    messageApi.open({
      type: 'success',
      content: isShowContent ? `${value} copied` : 'copied'
    });
  };
  return (
    <div className={clsx(styles.table_row)} key={item?.id}>
      {contextHolder}
      <div className={clsx(styles.row_item, styles.special_item, 'flex')}>
        {type === 'master' && (
          <Image alt="master" src="/images/scp_master.svg" width={24} height={24} />
        )}
        {type === 'node' && <Image alt="node" src="/images/scp_node.svg" width={24} height={24} />}
        <div className="flex flex-col pl-4">
          <span className={'text-xs font-semibold  text-black-600'}>
            {type === 'master' ? 'Master' : 'Node'}
          </span>
          <span className={styles.meta_id}>{item?.id}</span>
        </div>
      </div>
      <div className={clsx(styles.row_item)}>
        <NodeStatusComponent status={item?.status} />
      </div>
      <div className={clsx(styles.row_item)}>
        <div className={styles.meta_ip}>
          <span>{item?.ipaddress[0]?.ipValue}</span>
          <span
            className={styles.meta_ip_copy}
            onClick={() => successCopy(item?.ipaddress[0]?.ipValue)}
          >
            <IconFont iconName="icon-copy" color="#0D55DA" width={12} height={12} />
          </span>
        </div>
      </div>
      <div className={clsx(styles.row_item)}>
        <div className={styles.meta_ip}>
          <span>{item?.ipaddress[1]?.ipValue}</span>
          <span
            className={styles.meta_ip_copy}
            onClick={() => successCopy(item?.ipaddress[1]?.ipValue)}
          >
            <IconFont iconName="icon-copy" color="#0D55DA" width={12} height={12} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default function DetailPage() {
  const router = useRouter();
  const { name } = router.query;
  const infraName = name || '';
  const { kubeconfig } = useSessionStore((state) => state.getSession());
  const [messageApi, contextHolder] = message.useMessage();
  const [scpListType, setScpListType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalOpen = (value: boolean) => {
    setIsModalOpen(value);
  };

  const { data: scpInfo } = useQuery(['awsGet', infraName], () =>
    request.post('/api/infra/awsGet', { kubeconfig, infraName })
  );
  const scpMasterLists = scpInfo?.data?.spec?.hosts[0] || [];
  const scpNodeLists = scpInfo?.data?.spec?.hosts[1] || [];

  const { data: clusterInfo } = useQuery(['awsGetCluster', infraName], () =>
    request.post('/api/infra/getCluster', { kubeconfig, clusterName: infraName })
  );

  const backIndexPage = () => {
    router.push('/');
  };

  const successCopy = (value: string, isShowContent = true) => {
    navigator.clipboard.writeText(value);
    messageApi.open({
      type: 'success',
      content: isShowContent ? `${value} copied` : 'copied'
    });
  };

  const handleClickRadio = (e: any) => {
    const { value } = e.target;
    setScpListType(value);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {contextHolder}
      <div className="flex items-center h-12 lg:h-14">
        <div className={clsx(styles.back_btn)}>
          <Button onClick={backIndexPage}>
            <IconFont iconName="icon-back-button" color="#0D55DA" width={20} height={20} />
          </Button>
        </div>
        <div className={clsx('flex flex-col pl-4 text-blue-800')}>
          <span className="text-xl font-semibold lg:text-2xl">{name}</span>
          <span className={clsx('text-xs lg:text-sm')}> https://my-cluster.cloud.sealos.io</span>
        </div>
        <div className={styles.custom_button}>
          <Button type="primary">
            <IconFont iconName="icon-edit-button" className={'inline-block'} />
            Edit
          </Button>
          <Button onClick={showModal}>Delete</Button>
        </div>
      </div>
      <div className="grow flex mt-4">
        {/* @media (min-width: 1024px) card */}
        <div className={clsx(styles.base_card_style, 'basis-3/4 lg:hidden')}>
          <div className="h-7 m-4 mb-2 flex items-center">
            <IconFont
              iconName="icon-cluster-list"
              className="mr-3"
              color="#0D55DA"
              width={24}
              height={24}
            />
            <span className={'text-blue-600'}>List</span>
            <div className={styles.custom_radio_group}>
              <Radio.Group
                defaultValue="All"
                buttonStyle="solid"
                onChange={(e: any) => handleClickRadio(e)}
              >
                <Radio.Button value="All">All</Radio.Button>
                <Radio.Button value="Masters">Masters</Radio.Button>
                <Radio.Button value="Nodes">Nodes</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div className={clsx(styles.list_container)}>
            <div className={clsx(styles.table_header)}>
              <div className={clsx(styles.header_item, styles.special_item)}>Name</div>
              <div className={clsx(styles.header_item)}>Status</div>
              <div className={styles.header_item}>E-IP</div>
              <div className={styles.header_item}>IP</div>
            </div>
            {(scpListType === 'All' || scpListType === 'Masters') &&
              scpMasterLists?.metadata?.map((item: TNodeMetaData) => {
                return <ScpNodeItem type="master" item={item} key={item.id} />;
              })}
            {(scpListType === 'All' || scpListType === 'Nodes') &&
              scpNodeLists?.metadata?.map((item: TNodeMetaData) => {
                return <ScpNodeItem type="node" item={item} key={item.id} />;
              })}
          </div>
        </div>
        {/* @media (min-width: 1024px) master */}
        <div className={clsx(styles.base_card_style, 'hidden lg:block basis-2/5')}>
          <div className="h-7 m-4 mb-2 flex items-center">
            <IconFont
              iconName="icon-cluster-list"
              className="mr-3"
              color="#0D55DA"
              width={24}
              height={24}
            />
            <span style={{ color: '#0D55DA' }}>Master</span>
          </div>
          <div className={clsx(styles.list_container)}>
            <div className={clsx(styles.table_header)}>
              <div className={clsx(styles.header_item, styles.special_item)}>Name</div>
              <div className={clsx(styles.header_item)}>Status</div>
              <div className={styles.header_item}>E-IP</div>
              <div className={styles.header_item}>IP</div>
            </div>
            {scpMasterLists?.metadata?.map((item: TNodeMetaData) => {
              return <ScpNodeItem type="master" item={item} key={item.id} />;
            })}
          </div>
        </div>
        {/* @media (min-width: 1024px) node */}
        <div className={clsx(styles.base_card_style, 'hidden lg:block basis-2/5 ml-3')}>
          <div className="h-7 m-4 mb-2 flex items-center">
            <IconFont
              iconName="icon-cluster-list"
              className="mr-3"
              color="#0D55DA"
              width={24}
              height={24}
            />
            <span style={{ color: '#0D55DA' }}>Node</span>
          </div>
          <div className={clsx(styles.list_container)}>
            <div className={clsx(styles.table_header)}>
              <div className={clsx(styles.header_item, styles.special_item)}>Name</div>
              <div className={clsx(styles.header_item)}>Status</div>
              <div className={styles.header_item}>E-IP</div>
              <div className={styles.header_item}>IP</div>
            </div>
            {scpNodeLists?.metadata?.map((item: TNodeMetaData) => {
              return <ScpNodeItem type="node" item={item} key={item.id} />;
            })}
          </div>
        </div>
        {/* scp info */}
        <div className={clsx('basis-1/4 ml-3 flex flex-col lg:basis-1/5')}>
          <div className={clsx(styles.base_card_style, 'px-3 py-4')}>
            <TitleInfo info="Info" />
            <ul className={clsx(styles.list_card, 'space-y-3 mt-3')}>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>ID</span>
                <span style={{ color: '#0F0F34', marginLeft: 'auto' }}>
                  {hideMiddleChars(scpInfo?.data?.metadata?.uid)}
                </span>
                <span className="ml-1" onClick={() => successCopy(scpInfo?.data?.metadata?.uid)}>
                  <IconFont iconName="icon-copy" color="#0D55DA" width={12} height={12} />
                </span>
              </li>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Ssh key</span>
                <span
                  className="ml-auto"
                  onClick={() => successCopy(scpInfo?.data?.spec?.ssh?.pkData, false)}
                >
                  <IconFont iconName="icon-copy" color="#0D55DA" width={12} height={12} />
                </span>
              </li>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Area</span>
                <span className="ml-auto">{scpInfo?.data?.spec?.availabilityZone} </span>
              </li>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Version</span>
                <span className="ml-auto">{splitChars(clusterInfo?.data?.spec?.image[0])}</span>
              </li>
            </ul>
          </div>
          <div className={clsx(styles.base_card_style, 'mt-3 px-3 py-4')}>
            <TitleInfo info="Master" />
            <ul className={clsx(styles.list_card, 'space-y-3 mt-3')}>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Flavor</span>
                <span className="ml-auto">
                  {convertKeyToLabel(scpInfo?.data?.spec?.hosts[0].flavor)}
                </span>
              </li>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Count</span>
                <span className="ml-auto">{scpInfo?.data?.spec?.hosts[0]?.count}</span>
              </li>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Disk</span>
                <span className="ml-auto">{scpInfo?.data?.spec?.hosts[0]?.disks[0]?.capacity}</span>
              </li>
            </ul>
          </div>
          <div className={clsx(styles.base_card_style, 'mt-3 px-3 py-4')}>
            <TitleInfo info="Master" />
            <ul className={clsx(styles.list_card, 'space-y-3 mt-3')}>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Flavor</span>
                <span className="ml-auto">
                  {convertKeyToLabel(scpInfo?.data?.spec?.hosts[1].flavor)}
                </span>
              </li>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Count</span>
                <span className="ml-auto">{scpInfo?.data?.spec?.hosts[1]?.count}</span>
              </li>
              <li className="flex items-center">
                <span style={{ color: '#3F3F5D' }}>Disk</span>
                <span className="ml-auto">{scpInfo?.data?.spec?.hosts[1]?.disks[0]?.capacity}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <DeleteModal infraName={infraName as string} isOpen={isModalOpen} onOpen={handleModalOpen} />
    </div>
  );
}
