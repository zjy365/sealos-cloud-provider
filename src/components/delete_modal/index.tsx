import request from '@/services/request';
import useSessionStore from '@/stores/session';
import { Button, Input, Modal } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

type TDeleteModal = {
  infraName: string;
  isOpen: boolean;
  onOpen: (open: boolean) => void;
};

function DeleteModal(props: TDeleteModal) {
  const { infraName, isOpen, onOpen } = props;
  const { kubeconfig } = useSessionStore((state) => state.getSession());
  const [isDisabled, setIsDisabled] = useState(true);

  const deleteScp = async () => {
    try {
      const result = await request.post('/api/infra/aws_delete', {
        scp_name: infraName,
        kubeconfig
      });
      console.log(result);
    } catch (error) {}
  };

  const handleOk = () => {};

  useEffect(() => {
    setIsDisabled(true);
  }, [infraName]);

  return (
    <Modal
      className={styles.custom_modal}
      title="Operating Warning"
      open={isOpen}
      footer={[
        <Button key="back" type="primary" onClick={() => onOpen(false)}>
          Cancel
        </Button>,
        <Button key="submit" onClick={handleOk} disabled={isDisabled}>
          Confrim
        </Button>
      ]}
    >
      <div className={clsx('text-xl font-semibold text-gray-600')}>
        This operation will delete the cluster.
      </div>
      <p className={clsx('text-xs mt-2')}>
        Are you sure you want to delete this cluster? If you want to delete, please enter &nbsp;
        <span className="text-base font-semibold text-gray-600">{infraName}</span>&nbsp;below and
        click the delete cluster button.
      </p>
      <Input
        style={{ height: '28px', backgroundColor: '#FAFAFC', marginTop: '12px' }}
        placeholder="please enter the cluster name"
        onChange={(e) => {
          if (e.target.value === infraName) {
            setIsDisabled(false);
          }
        }}
      />
    </Modal>
  );
}

export default DeleteModal;
