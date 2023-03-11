import IconFont from '@/components/iconfont';
import { NodeStatusComponent } from '@/components/scp_status';
import { TNodeMetaData } from '@/interfaces/infra_common';
import { Box, Table, TableContainer, Tbody, Td, Thead, Tr, useToast } from '@chakra-ui/react';
import clsx from 'clsx';
import Image from 'next/image';
import styles from './index.module.scss';

type TChakra_Table = {
  tableHeader: string[];
  tableData: any;
  type: 'master' | 'node';
  showHeader?: boolean;
};

export default function Chakra_Table(props: TChakra_Table) {
  const { tableHeader, tableData, type, showHeader = 'true' } = props;
  const toast = useToast();

  const successCopy = (value: string, isShowContent = true) => {
    navigator.clipboard.writeText(value);
    toast({
      title: isShowContent ? `${value} copied` : 'copied',
      status: 'success',
      position: 'top',
      duration: 2000,
      isClosable: true
    });
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead className={clsx(showHeader ? '' : 'hidden')}>
          <Tr className={styles.table_header}>
            {tableHeader.map((item: string) => (
              <Td key={item}>{item}</Td>
            ))}
          </Tr>
        </Thead>
        {tableData && (
          <Tbody>
            {tableData?.map((item: TNodeMetaData) => {
              return (
                <Tr key={item?.id} className={styles.table_row}>
                  <Td className="flex items-center">
                    <div className="w-6 h-6">
                      {type === 'master' && (
                        <Image alt="master" src="/images/scp_master.svg" width={24} height={24} />
                      )}
                      {type === 'node' && (
                        <Image alt="node" src="/images/scp_node.svg" width={24} height={24} />
                      )}
                    </div>

                    <div className="flex flex-col pl-3">
                      <span className={'text-xs font-semibold  text-black-600'}>
                        {type === 'master' ? 'Master' : 'Node'}
                      </span>
                      <span className={styles.meta_id}>{item?.id}</span>
                    </div>
                  </Td>
                  <Td>
                    <NodeStatusComponent status={item?.status} />
                  </Td>
                  <Td>
                    {/* E-IP */}
                    <Box className={styles.meta_ip}>
                      {item?.ipaddress[1]?.ipValue}
                      <div
                        className={styles.meta_ip_copy}
                        onClick={() => successCopy(item?.ipaddress[1]?.ipValue)}
                      >
                        <IconFont iconName="icon-copy" color="#0D55DA" width={12} height={12} />
                      </div>
                    </Box>
                  </Td>
                  <Td>
                    <Box className={styles.meta_ip}>
                      {item?.ipaddress[0]?.ipValue}
                      <div
                        className={styles.meta_ip_copy}
                        onClick={() => successCopy(item?.ipaddress[0]?.ipValue)}
                      >
                        <IconFont iconName="icon-copy" color="#0D55DA" width={12} height={12} />
                      </div>
                    </Box>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
}
