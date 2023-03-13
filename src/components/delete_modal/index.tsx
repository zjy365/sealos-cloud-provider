import request from '@/services/request';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

type TDeleteModal = {
  infraName: string;
  isOpen: boolean;
  onClose: () => void;
};

function DeleteModal(props: TDeleteModal) {
  const { infraName, isOpen, onClose } = props;
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();
  const onConfrim = async () => {
    try {
      const result = await request.post('/api/infra/aws_delete', {
        scp_name: infraName
      });
    } catch (error) {}
    onClose();
    router.push('/');
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={'blue.600'}>Operating Warning</ModalHeader>
        <ModalCloseButton color={'blue.600'} />
        <ModalBody>
          <Text fontSize={'20px'} fontWeight={'600'} color={'gray.600'}>
            This operation will delete the cluster
          </Text>
          <Box fontSize={'12px'} fontWeight={'400'} color={'gray.500'}>
            Are you sure you want to delete this cluster? If you want to delete, please enter &ensp;
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F0F34' }}>
              {infraName}
            </span>
            &ensp;below and click the delete cluster button.
          </Box>
          <Input
            className="mt-3"
            placeholder="please enter the cluster name"
            onChange={(e) => {
              if (e.target.value === infraName) {
                setIsDisabled(false);
              } else {
                setIsDisabled(true);
              }
            }}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button h={'36px'} onClick={onClose}>
            Cancel
          </Button>
          <Button
            h={'36px'}
            ml={'8px'}
            variant={'outline'}
            onClick={onConfrim}
            isDisabled={isDisabled}
          >
            Confrim
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteModal;
