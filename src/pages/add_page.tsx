import IconFont from '@/components/iconfont';
import MarkDown from '@/components/markdown';
import ScpFormComponent from '@/components/scp_form';
import HeaderInfoComponent from '@/components/title_info';
import {
  conversionPrice,
  debounce,
  generateYamlTemplate,
  TScpForm,
  TSelectOption,
  TScpDetailSpecHosts
} from '@/interfaces/infra_common';
import request from '@/services/request';
import useSessionStore from '@/stores/session';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Text,
  useToast
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import styles from './add_page.module.scss';

export default function AddPage() {
  const router = useRouter();
  const { name } = router.query;
  const editName = name || '';
  const { kubeconfig } = useSessionStore((state) => state.getSession());
  const toast = useToast();
  const oldScpFormYaml = useRef(null);
  const [scpForm, setScpForm] = useState<TScpForm>({
    infraName: '',
    scpImage: 'ami-048280a00d5085dd1',
    sealosVersion: '',
    sealosPlatform: 'Aws',
    clusterImages: ['labring/kubernetes:v1.25.5', 'labring/calico:v3.24.1'],
    // master
    masterCount: 1,
    masterType: 't2.medium',
    masterRootDiskSize: 8,
    masterRootDiskType: 'gp3',
    masterDataDisks: [],
    // node
    nodeCount: 1,
    nodeType: 't2.medium',
    nodeRootDiskSize: 8,
    nodeRootDiskType: 'gp3',
    nodeDataDisks: []
  });

  const scpFormHook: UseFormReturn<TScpForm, any> = useForm<TScpForm>({
    defaultValues: scpForm,
    mode: 'onChange'
  });

  const { data } = useQuery(['getConfigMap'], async () => {
    try {
      return await request.post('/api/infra/getConfigMap', {
        kubeconfig,
        name: 'infra-ami-config'
      });
    } catch (error) {}
  });
  let imageOptions = [] as TSelectOption[];
  if (data?.data?.code === 200) {
    let imageKeyList = omit(data?.data?.data, ['lower-limit-GPU', 'lower-limit']);
    Object.entries(imageKeyList).map((item) => {
      let temp = {
        label: item[0],
        value: item[1] as string
      };
      imageOptions.push(temp);
    });
  }
  const [yamlTemplate, setYamlTemplate] = useState(generateYamlTemplate(scpForm));
  const [scpPrice, setScpPrice] = useState('');

  const backIndexPage = () => {
    router.push('/');
  };

  // Copy method with value and procedure isShowContent should be false
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

  const onFinish = async () => {
    try {
      scpFormHook.handleSubmit(
        async (data) => {
          if (data.infraName === editName) {
            updateScpMutation.mutate();
          } else if ((await isScpExist(data.infraName)) && data.infraName !== editName) {
            scpFormHook.setError('infraName', {
              message: `${data.infraName} cluster already exists`
            });
          } else {
            applyScpMutation.mutate();
          }
        },
        (err) => {}
      )();
    } catch (error) {}
  };

  const applyScpMutation = useMutation({
    mutationFn: () => {
      return request.post('/api/infra/aws_apply', { scp_yaml: yamlTemplate, kubeconfig });
    },
    onSuccess: (data) => {
      if (data.data.code === 200) {
        toast({
          title: 'success',
          status: 'success',
          position: 'top',
          isClosable: true
        });
      }
    },
    onSettled: () => {
      router.push('/');
    }
  });

  const updateScpMutation = useMutation({
    mutationFn: () => {
      return request.post('/api/infra/awsUpdate', {
        scp_yaml: yamlTemplate,
        old_scp_yaml: oldScpFormYaml.current,
        kubeconfig,
        scp_name: editName
      });
    },
    onSuccess: (data) => {
      if (data.data.code === 200) {
        toast({
          title: 'success',
          status: 'success',
          position: 'top',
          isClosable: true
        });
      }
    },
    onSettled: () => {
      router.push('/');
    }
  });

  const isScpExist = async (name: string) => {
    try {
      const res = await request.post('/api/infra/awsGet', {
        kubeconfig,
        infraName: name
      });
      return !!res.data.status;
    } catch (error) {}
  };

  async function getPrice(form: TScpForm) {
    try {
      const res = await request.post('/api/infra/awsGetPrice', form);
      if (res?.data?.code === 200) {
        let price = conversionPrice(res?.data?.sumPrice, 2);
        setScpPrice(price);
      }
    } catch (error) {}
  }

  scpFormHook.watch((data: TScpForm | any) => {
    setYamlTemplate(generateYamlTemplate(data));
    debounce(() => getPrice({ ...scpForm, ...data }));
  });

  useEffect(() => {
    getPrice(scpForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getScpDetailByName = async (name: string) => {
    try {
      const res = await request.post('/api/infra/awsGet', {
        kubeconfig,
        infraName: name
      });
      if (res?.data?.metadata) {
        let { name } = res?.data?.metadata;
        let masterInfo = res?.data?.spec?.hosts[0] as TScpDetailSpecHosts;
        let nodeInfo = res?.data?.spec?.hosts[1] as TScpDetailSpecHosts;
        const payload = {
          infraName: name,
          scpImage: masterInfo.image,
          sealosVersion: '',
          sealosPlatform: res?.data?.spec?.platform,
          clusterImages: ['labring/kubernetes:v1.25.5', 'labring/calico:v3.24.1'],
          // master
          masterCount: masterInfo?.count,
          masterType: masterInfo?.flavor,
          masterRootDiskSize: masterInfo?.disks[0].capacity,
          masterRootDiskType: masterInfo?.disks[0].volumeType,
          masterDataDisks: masterInfo?.disks.slice(1) || [],
          // node
          nodeCount: nodeInfo?.count,
          nodeType: nodeInfo?.flavor,
          nodeRootDiskSize: nodeInfo?.disks[0].capacity,
          nodeRootDiskType: nodeInfo?.disks[0].volumeType,
          nodeDataDisks: nodeInfo?.disks.slice(1) || []
        };
        //@ts-ignore
        oldScpFormYaml.current = generateYamlTemplate(payload);
        //@ts-ignore
        scpFormHook.reset(payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!!editName) {
      getScpDetailByName(editName as string);
    }
  }, [editName]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center">
        <IconButton
          variant="outline"
          aria-label="backIndexPage"
          icon={<IconFont iconName="icon-back-button" color="#0D55DA" width={20} height={20} />}
          onClick={backIndexPage}
        />
        <div className={clsx('text-blue-800 pl-4 font-semibold text-xl lg:text-2xl')}>
          Create My Cluster
        </div>
        <div className={clsx('text-blue-800 ml-auto text-lg lg:text-2xl font-medium')}>
          ¥ <span style={{ color: '#ef7733' }}>{scpPrice}</span> / Hour
        </div>

        <Button
          className={styles.create_btn}
          onClick={onFinish}
          isLoading={applyScpMutation.isLoading}
          loadingText="Submitting"
        >
          Create Now
        </Button>
      </div>
      {/* infra form */}
      <div className={clsx(styles.form_container)}>
        <div
          className={clsx(
            styles.base_card_style,
            'basis-3/5 pt-4 hiddenScrollWrapper relative grow'
          )}
        >
          <div className={clsx(styles.custom_antd_form, 'absolute w-full pl-3 pb-5 lg:pl-8')}>
            <HeaderInfoComponent content="Info" size="lg" />
            <Controller
              name={'infraName'}
              control={scpFormHook.control}
              rules={{
                required: 'name is required',
                pattern: {
                  value: /^[a-z0-9]+([-.][a-z0-9]+)*$/,
                  message:
                    "Name must start and end with alphanumeric characters and only contain lowercase letters, numbers, '-', and '.'"
                }
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <Flex mt={'12px'} mb={'30px'}>
                    <Text color={'#C85074'} className="px-1 pt-1">
                      *
                    </Text>
                    <Text
                      mr={'21px'}
                      fontSize={{ md: 14, lg: 16 }}
                      fontWeight={400}
                      color={'gray.600'}
                    >
                      cluster name
                    </Text>
                    <Flex flexDirection={'column'}>
                      <Input
                        isDisabled={!!editName}
                        type={'text'}
                        placeholder="name"
                        width={{ md: '322px', lg: '360px' }}
                        value={value}
                        onChange={onChange}
                      />
                      {error && (
                        <FormErrorMessage mt={0} maxW="sm" whiteSpace="normal">
                          {error.message}
                        </FormErrorMessage>
                      )}
                    </Flex>
                  </Flex>
                </FormControl>
              )}
            ></Controller>

            {/* <FormControl mb={'24px'} ml={'16px'}>
              <Flex alignItems={'center'}>
                <Text mr={'12px'} fontSize={{ md: 14, lg: 16 }} fontWeight={400} color={'gray.600'}>
                  sealos version
                </Text>
                <Select
                  width={{ md: '116px', lg: '160px' }}
                  {...scpFormHook.register('sealosVersion')}
                >
                  <option value="Aws">Aws</option>
                </Select>
                <Text
                  ml={'30px'}
                  mr={'12px'}
                  fontSize={{ md: 14, lg: 16 }}
                  fontWeight={400}
                  color={'gray.600'}
                >
                  platform
                </Text>
                <Select
                  width={{ md: '116px', lg: '160px' }}
                  {...scpFormHook.register('sealosPlatform')}
                >
                  {[
                    { value: 'aws', label: 'aws' },
                    { value: 'test', label: 'tes' }
                  ].map((item: TSelectOption) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Flex>
            </FormControl> */}
            <ScpFormComponent
              key={'master'}
              type="master"
              scpImageOptions={imageOptions}
              formHook={scpFormHook}
            />
            <ScpFormComponent key={'node'} type="node" formHook={scpFormHook} />
          </div>
        </div>
        <div
          className={clsx(
            styles.base_card_style,
            styles.form_container_right,
            'basis-2/5 ml-3 flex flex-col'
          )}
        >
          <div className="mt-4 mx-3 lg:mx-9  flex items-center">
            <HeaderInfoComponent content="YAML Definition" size="lg" />
            <div
              className="ml-auto p-1 rounded hover:bg-grey-300"
              onClick={() => successCopy(yamlTemplate, false)}
            >
              <IconFont iconName="icon-copy" color="#0D55DA" width={18} height={18} />
            </div>
          </div>
          <div className="hiddenScrollWrapper grow flex lg:mx-4">
            <div className={clsx(styles.markdown, 'absolute w-full pb-8')}>
              <MarkDown content={yamlTemplate}></MarkDown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
