import IconFont from '@/components/iconfont';
import { NodeStatusComponent } from '@/components/scp_status';
import { TNodeMetaData } from '@/interfaces/infra_common';
import { Box, Table, TableContainer, Tbody, Td, Thead, Tr, useToast } from '@chakra-ui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useMemo } from 'react';
import styles from './index.module.scss';

type TChakra_Table = {
  tableHeader: string[];
  tableData: any;
  type: 'Masters' | 'Nodes' | 'All';
  showHeader?: boolean;
};

export default function Chakra_Table(props: TChakra_Table) {
  const { tableHeader, tableData, type, showHeader = 'true' } = props;
  const toast = useToast();
  if (!tableData || tableData.length === 0) {
    return null;
  }
  let renderData = [];
  try {
    const scpMasterLists = tableData?.hosts[0]?.metadata?.map((item: any) => {
      if (item?.labels?.master0) {
        return { type: 'Master', master0: true, ...item };
      }
      return { type: 'Master', ...item };
    });
    const scpNodeLists = tableData?.hosts[1]?.metadata?.map((item: any) => {
      return { type: 'Node', ...item };
    });
    if (type === 'All') {
      renderData = scpMasterLists.concat(scpNodeLists);
    } else if (type === 'Masters') {
      renderData = scpMasterLists;
    } else if (type === 'Nodes') {
      renderData = scpNodeLists;
    } else {
      renderData = [];
    }
  } catch (error) {}

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
            {renderData?.map((item: TNodeMetaData) => {
              return (
                <Tr key={item?.id} className={styles.table_row}>
                  <Td className="flex items-center">
                    <div className="w-6 h-6">
                      <Image
                        alt={item?.type || ''}
                        src={`/images/scp_${item?.type}.svg`}
                        width={24}
                        height={24}
                      />
                    </div>

                    <div className="flex flex-col pl-3">
                      <span className={'text-xs font-semibold  text-black-600'}>
                        {item?.master0 ? 'Master0' : item.type}
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
