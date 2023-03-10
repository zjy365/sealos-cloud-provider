import IconFont from '@/components/iconfont';
import HeaderInfoComponent from '@/components/title_info';
import {
  SELECT_ALIYUN_DISK_TYPE,
  SELECT_ALIYUN_FLAVOR_TYPE,
  SELECT_DISK_TYPE,
  SELECT_FLAVOR_TYPE,
  TScpForm,
  TSelectOption
} from '@/interfaces/infra_common';
import request from '@/services/request';
import useSessionStore from '@/stores/session';
import {
  Flex,
  FormControl,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';

type TScpFormComponent = {
  type: 'master' | 'node';
  formHook: UseFormReturn<TScpForm, any>;
};

const ScpFormComponent = (props: TScpFormComponent) => {
  const { type, formHook: scpFormHook } = props;
  const router = useRouter();
  const { name } = router.query;
  const editName = name || '';

  const { kubeconfig } = useSessionStore((state) => state.getSession());
  const { data } = useQuery(['getConfigMap'], async () => {
    try {
      return await request.post('/api/infra/getConfigMap', {
        kubeconfig,
        name: 'infra-ami-config'
      });
    } catch (error) {}
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    name: `${type}DataDisks`,
    control: scpFormHook.control
  });

  const sealosPlatform = scpFormHook.getValues('sealosPlatform') as 'aws' | 'aliyun';
  const [scpPlatformType, setScpPlatformType] = useState(SELECT_FLAVOR_TYPE);
  const [scpDisksType, setScpDisksType] = useState(SELECT_DISK_TYPE);
  const scpImageOptions = useMemo(() => {
    return sealosPlatform === 'aws' ? data?.data?.aws : data?.data?.aliyun;
  }, [data, sealosPlatform]);

  useEffect(() => {
    sealosPlatform === 'aws'
      ? setScpPlatformType(SELECT_FLAVOR_TYPE)
      : setScpPlatformType(SELECT_ALIYUN_FLAVOR_TYPE);
    sealosPlatform === 'aws'
      ? setScpDisksType(SELECT_DISK_TYPE)
      : setScpDisksType(SELECT_ALIYUN_DISK_TYPE);

    scpFormHook.reset({
      ...scpFormHook.getValues(),
      masterType: sealosPlatform === 'aws' ? 't2.medium' : 'ecs.c7.large',
      nodeType: sealosPlatform === 'aws' ? 't2.medium' : 'ecs.c7.large',
      masterRootDiskType: sealosPlatform === 'aws' ? 'gp3' : 'cloud_essd',
      nodeRootDiskType: sealosPlatform === 'aws' ? 'gp3' : 'cloud_essd',
      scpImage:
        sealosPlatform === 'aws'
          ? 'ami-048280a00d5085dd1'
          : 'ubuntu_22_04_x64_20G_alibase_20230208.vhd',
      masterRootDiskSize: sealosPlatform === 'aws' ? 8 : 20,
      nodeRootDiskSize: sealosPlatform === 'aws' ? 8 : 20
    });
  }, [scpDisksType, scpFormHook, sealosPlatform]);

  return (
    <>
      <div className="mb-3" key={type}>
        <HeaderInfoComponent content={type === 'node' ? 'Node' : 'Master'} />
      </div>
      {type === 'master' && (
        <FormControl className={clsx('mb-3 ml-4')}>
          <Flex alignItems={'center'}>
            <Text mr={'16px'} fontSize={{ md: 14, lg: 16 }} fontWeight={400} color={'gray.600'}>
              image
            </Text>
            {scpImageOptions && (
              <Select
                isDisabled={!!editName}
                width={{ md: '116px', lg: '160px' }}
                {...scpFormHook.register('scpImage')}
              >
                {scpImageOptions.map((item: TSelectOption) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            )}
          </Flex>
        </FormControl>
      )}

      <FormControl className="mb-3 ml-4">
        <Flex alignItems={'center'}>
          <Text mr={'20px'} fontSize={{ md: 14, lg: 16 }} fontWeight={400} color={'gray.600'}>
            count
          </Text>

          <Controller
            control={scpFormHook.control}
            name={`${type}Count`}
            render={({ field: { onChange, onBlur, value } }) => (
              <NumberInput
                min={1}
                width={{ md: '116px', lg: '160px' }}
                value={value}
                onChange={(valueString, valueNumber) => onChange(valueNumber)}
                onBlur={onBlur}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper>
                    <IconFont iconName="icon-tune-up" height={14} />
                  </NumberIncrementStepper>
                  <NumberDecrementStepper>
                    <IconFont iconName="icon-tune-down" height={14} />
                  </NumberDecrementStepper>
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <Text
            ml={'32px'}
            mr={'20px'}
            fontSize={{ md: 14, lg: 16 }}
            fontWeight={400}
            color={'gray.600'}
          >
            flavor
          </Text>
          <Select width={{ md: '116px', lg: '160px' }} {...scpFormHook.register(`${type}Type`)}>
            {scpPlatformType &&
              scpPlatformType.map((item: TSelectOption) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
          </Select>
        </Flex>
      </FormControl>

      <FormControl className="mb-2 ml-4">
        <Flex alignItems={'center'}>
          <Text mr={'16px'} fontSize={{ md: 14, lg: 16 }} fontWeight={400} color={'gray.600'}>
            root volume
          </Text>
          <Controller
            control={scpFormHook.control}
            name={`${type}RootDiskSize`}
            render={({ field: { onChange, onBlur, value } }) => (
              <NumberInput
                min={sealosPlatform === 'aws' ? 8 : 20}
                max={256}
                width={{ md: '80px', lg: '116px' }}
                value={value}
                onChange={(valueString, valueNumber) => onChange(valueNumber)}
                onBlur={onBlur}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper>
                    <IconFont iconName="icon-tune-up" height={14} />
                  </NumberIncrementStepper>
                  <NumberDecrementStepper>
                    <IconFont iconName="icon-tune-down" height={14} />
                  </NumberDecrementStepper>
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <Text ml={'4px'} fontSize={12} fontWeight={400} color={'gray.600'}>
            GB
          </Text>
          <Select
            ml={'24px'}
            width={{ md: '80px', lg: '120px' }}
            {...scpFormHook.register(`${type}RootDiskType`)}
          >
            {scpDisksType &&
              scpDisksType.map((item: TSelectOption) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
          </Select>
        </Flex>
      </FormControl>

      {fields.map((field, index) => (
        <FormControl className="mb-2 ml-4" key={field.id}>
          <Flex alignItems={'center'}>
            <Text mr={'12px'} fontSize={{ md: 14, lg: 16 }} fontWeight={400} color={'gray.600'}>
              data volume
            </Text>
            <Controller
              control={scpFormHook.control}
              name={`${type}DataDisks.${index}.capacity`}
              render={({ field: { onChange, onBlur, value } }) => (
                <NumberInput
                  min={sealosPlatform === 'aws' ? 8 : 20}
                  max={256}
                  width={{ md: '80px', lg: '116px' }}
                  value={value}
                  onChange={(valueString, valueNumber) => onChange(valueNumber)}
                  onBlur={onBlur}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper>
                      <IconFont iconName="icon-tune-up" height={14} color="#0F0F34" />
                    </NumberIncrementStepper>
                    <NumberDecrementStepper>
                      <IconFont iconName="icon-tune-down" height={14} color="#0F0F34" />
                    </NumberDecrementStepper>
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <Text ml={'4px'} fontSize={12} fontWeight={400} color={'gray.600'}>
              GB
            </Text>
            <Select
              ml={'24px'}
              width={{ md: '80px', lg: '120px' }}
              {...scpFormHook.register(`${type}DataDisks.${index}.volumeType`)}
            >
              {scpDisksType &&
                scpDisksType.map((item: TSelectOption) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
            </Select>
            <div className="ml-5 hover:bg-grey-300 p-1" onClick={() => remove(index)}>
              <IconFont iconName="icon-delete-button" width={20} height={20} color="#0D55DA" />
            </div>
          </Flex>
        </FormControl>
      ))}

      <Flex
        w={150}
        h={'28px'}
        alignItems={'center'}
        className="cursor-pointer mb-10 ml-4"
        onClick={() => {
          if (fields.length + 1 > 16) return;
          append({
            volumeType: sealosPlatform === 'aws' ? 'gp3' : 'cloud_essd',
            //@ts-ignore
            capacity: sealosPlatform === 'aws' ? 8 : 20,
            type: 'data'
          });
        }}
      >
        <IconFont
          iconName="icon-more-clusterform"
          className="rounded hover:bg-grey-300"
          color="#0D55DA"
          width={16}
          height={16}
        />
        <Text ml={'4px'} fontSize={12} fontWeight={400} color={'gray.600'} lineHeight={'20px'}>
          add data disk
        </Text>
      </Flex>
    </>
  );
};

export default ScpFormComponent;
