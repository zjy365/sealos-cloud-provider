import DeleteModal from '@/components/delete_modal';
import Iconfont from '@/components/iconfont';
import IconFont from '@/components/iconfont';
import { StatusComponent } from '@/components/scp_status';
import request from '@/services/request';
import useSessionStore from '@/stores/session';
import { formatTime } from '@/utils/format';
import { Button, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './index.module.scss';

type InfraInfo = {
  apiVersion: string;
  kind: string;
  metadata: { creationTimestamp: string; uid: string; name: string; deletionTimestamp: string };
  spec: any;
  status: { connections: string; ssh: any; status: string };
};

function FrontPage() {
  const router = useRouter();
  const { kubeconfig } = useSessionStore((state) => state.getSession());
  const [scpStatus, setScpStatus] = useState('Pending');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openName, setOpenName] = useState('');

  // Obtaining the cluster list
  const { data: scpLists, isSuccess } = useQuery(
    ['getAwsAll'],
    async () => {
      try {
        const res = await request.post('/api/infra/awsGetAll', { kubeconfig });
        let allReady = res.data.items?.every((item: InfraInfo) => {
          return item?.status?.status === 'Running';
        });
        if (allReady) {
          setScpStatus('Running');
        }
        return res;
      } catch (error) {}
    },
    {
      refetchInterval: scpStatus === 'Pending' ? 10 * 1000 : false, //轮询时间
      enabled: scpStatus === 'Pending' // 只有 url 为 '' 的时候需要请求
    }
  );

  const { data: clusterLists } = useQuery(['getClusters'], async () => {
    try {
      const res = await request.post('/api/infra/getAllCluster', { kubeconfig });
      return res;
    } catch (err) {}
  });

  const getClusterStatus = (infraName: string) => {
    const cluster = clusterLists?.data?.items.find(
      (item: InfraInfo) => item.metadata.name === infraName
    );
    return cluster ? cluster?.status?.status : 'Pending';
  };

  const goDetailPage = (name: string) => {
    router.push({
      pathname: '/detail',
      query: {
        name: name
      }
    });
  };

  const goCreatePage = () => {
    router.push({ pathname: '/add_page' });
  };

  return (
    <>
      <div className={clsx(styles.header, 'h-16 lg:h-20')}>
        <div className={clsx(styles.logo, 'w-16 lg:w-20 h-16 lg:h-20')}>
          <Image alt="logo" src="/images/scp_logo.svg" width={80} height={80} />
        </div>
        <div className="flex flex-col ml-8">
          <span className={clsx(styles.title, 'text-xl lg:text-3xl font-semibold')}>
            Sealos Cloud Provider
          </span>
          <span className={clsx(styles.title_desc, 'text-sm lg:text-xl')}>manage my clusters</span>
        </div>

        <Button
          className="ml-auto w-40 lg:w-48 h-10 lg:h-11"
          leftIcon={
            <IconFont
              iconName="icon-create-button"
              className={'inline-block'}
              width={20}
              height={20}
            />
          }
          onClick={goCreatePage}
        >
          Create Cluster
        </Button>
      </div>
      {isSuccess && (
        <div className={clsx(styles.list_container, 'space-y-2')}>
          <div className={clsx(styles.table_header, 'text-xs lg:text-sm h-10 lg:h-11')}>
            <div className={clsx(styles.header_item, styles.special_item)}>Name</div>
            <div className={clsx(styles.header_item)}>State</div>
            <div className={styles.header_item}>Time</div>
            <div className={styles.header_item}>Area</div>
            <div className={styles.header_item}>Operation</div>
          </div>
          {scpLists?.data?.items?.map((item: InfraInfo, index: number) => {
            return (
              <div
                className={clsx(styles.table_row)}
                key={item?.metadata?.uid}
                onClick={() => goDetailPage(item?.metadata?.name)}
              >
                <div className={clsx(styles.row_item, styles.special_item, 'flex flex-col')}>
                  <span className={clsx(styles.scp_name, 'lg:text-lg font-semibold')}>
                    {item?.metadata?.name}
                  </span>
                  <span className={clsx(styles.scp_id, 'text-xs lg:text-sm')}>
                    ID: {item?.metadata?.uid}
                  </span>
                </div>
                <div className={clsx(styles.row_item)}>
                  <StatusComponent
                    infraStatus={
                      item?.metadata?.deletionTimestamp ? 'Deleting' : item?.status?.status
                    }
                    clusterStatus={getClusterStatus(item.metadata.name)}
                  />
                </div>
                <div className={clsx(styles.row_item, 'text-xs lg:text-sm font-medium')}>
                  {formatTime(item?.metadata?.creationTimestamp, 'YYYY/MM/DD HH:mm:ss')}
                </div>
                <div className={clsx(styles.row_item, 'text-xs lg:text-sm font-medium')}>
                  {item?.spec?.availabilityZone}
                </div>
                <div className={clsx(styles.row_item, 'flex')}>
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push({ pathname: '/add_page', query: { name: item?.metadata?.name } });
                    }}
                  >
                    <Iconfont iconName="icon-edit-button" width={28} height={28} color="#0D55DA" />
                  </div>
                  <div
                    className="ml-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenName(item?.metadata?.name);
                      onOpen();
                    }}
                  >
                    <Iconfont
                      iconName="icon-delete-button"
                      width={28}
                      height={28}
                      color="#0D55DA"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <DeleteModal isOpen={isOpen} onClose={onClose} infraName={openName} />
    </>
  );
}

export default FrontPage;
