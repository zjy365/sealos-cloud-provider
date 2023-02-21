import clsx from 'clsx';
import styles from './index.module.scss';
import { upperFirst } from 'lodash';

type StatusComponent = {
  infraStatus: string;
  clusterStatus: string;
  desc?: boolean;
};

export const StatusComponent = ({ infraStatus, clusterStatus, desc = true }: StatusComponent) => {
  let status = 'Pending';
  const colorStatus: any = {
    Pending: { value: 'Creating', title: '创建中' },
    Running: { value: 'Running', title: '运行中' },
    Starting: { value: 'Starting', title: '启动中' },
    Deleting: { value: 'Deleting', title: '删除中' }
  };

  if (infraStatus === 'Deleting') {
    status = 'Deleting';
  }

  if (infraStatus === 'Running') {
    status = 'Starting';
  }

  if (infraStatus === 'Running' && clusterStatus === 'Running') {
    status = 'Running';
  }

  if (infraStatus === 'Failed' || clusterStatus === 'Failed') {
    status = 'Failed';
  }

  return (
    <div className={clsx(styles.status, styles[`${colorStatus[status].value}`])}>
      <div>{colorStatus[status].value}</div>
    </div>
  );
};

export const NodeStatusComponent = ({ status }: { status: string }) => {
  const colorMap = {
    running: '#029e9e',
    pending: '#662fdc',
    terminated: '#ba2451',
    stopped: '#0d55da'
  };
  return (
    <>
      <div
        className={clsx(styles.node_status, 'flex items-center')}
        // @ts-ignore next
        style={{ '--node-color': colorMap[status] }}
      >
        <div className={styles.circle}></div>
        <span className={'text-xs font-semibold'}>{upperFirst(status)}</span>
      </div>
    </>
  );
};
