import HeaderInfoComponent from '@/components/title_info';
import {
  SELECT_DISK_TYPE,
  SELECT_SCP_TYPE,
  TScpForm,
  TSelectOption
} from '@/interfaces/infra_common';
import {
  Flex,
  FormControl,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  useNumberInput
} from '@chakra-ui/react';
import clsx from 'clsx';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import styles from './index.module.scss';
import IconFont from '@/components/iconfont';

function MyNumberInputStepper(props: any) {
  const { getIncrementButtonProps, getDecrementButtonProps } = useNumberInput();

  const incrementButtonProps = getIncrementButtonProps();
  const decrementButtonProps = getDecrementButtonProps();

  return (
    <div {...props}>
      <button {...incrementButtonProps}>+1</button>
      <button {...decrementButtonProps}>-1</button>
    </div>
  );
}

type TScpFormComponent = {
  type: 'master' | 'node';
  scpImageOptions?: TSelectOption[];
  formHook: UseFormReturn<TScpForm, any>;
};

const ScpFormComponent = (props: TScpFormComponent) => {
  const { type, scpImageOptions, formHook: scpFormHook } = props;
  console.log('render form');

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    name: `${type}DataDisks`,
    control: scpFormHook.control
  });

  return (
    <>
      <HeaderInfoComponent content={type === 'node' ? 'Node' : 'Master'} />

      <FormControl
        className={clsx({
          [styles.hidden_form_item]: type === 'node'
        })}
      >
        <Flex alignItems={'center'}>
          <Text w={100} fontSize={14} fontWeight={400}>
            image
          </Text>
          {scpImageOptions && (
            <Select width={{ md: '116px', lg: '160px' }} {...scpFormHook.register('scpImage')}>
              {scpImageOptions &&
                scpImageOptions.map((item: TSelectOption) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
            </Select>
          )}
        </Flex>
      </FormControl>

      <FormControl>
        <Flex alignItems={'center'}>
          <Text w={100} fontSize={14}>
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
                onChange={onChange}
                onBlur={onBlur}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <Text w={100} fontSize={14}>
            flavor
          </Text>
          <Select width={{ md: '116px', lg: '160px' }} {...scpFormHook.register(`${type}Type`)}>
            {SELECT_SCP_TYPE.map((item: TSelectOption) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Flex>
      </FormControl>

      <FormControl>
        <Flex alignItems={'center'}>
          <Text w={100} fontSize={14}>
            root volume
          </Text>
          <Controller
            control={scpFormHook.control}
            name={`${type}RootDiskSize`}
            render={({ field: { onChange, onBlur, value } }) => (
              <NumberInput
                min={8}
                max={256}
                width={{ md: '80px', lg: '116px' }}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <Text>GB</Text>
          <Text w={100} fontSize={14}>
            flavor
          </Text>
          <Select
            width={{ md: '80px', lg: '116px' }}
            {...scpFormHook.register(`${type}RootDiskType`)}
          >
            {SELECT_DISK_TYPE.map((item: TSelectOption) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Flex>
      </FormControl>
      {fields.map((field, index) => (
        <>
          <FormControl key={field.id}>
            <Flex alignItems={'center'}>
              <Text w={100} fontSize={14}>
                data volume
              </Text>
              <Controller
                control={scpFormHook.control}
                name={`${type}DataDisks.${index}.capacity`}
                render={({ field: { onChange, onBlur, value } }) => (
                  <NumberInput
                    min={8}
                    max={256}
                    width={{ md: '80px', lg: '116px' }}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
              <Text>GB</Text>
              <Select
                width={{ md: '80px', lg: '116px' }}
                {...scpFormHook.register(`${type}DataDisks.${index}.volumeType`)}
              >
                {SELECT_DISK_TYPE.map((item: TSelectOption) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </Flex>
          </FormControl>
        </>
      ))}
      <Flex
        w={150}
        alignItems={'center'}
        className="cursor-pointer ml-3 mb-3 "
        onClick={() => {
          if (fields.length + 1 > 16) return;
          append({ capacity: '8', volumeType: 'gp3', type: 'data' });
        }}
      >
        <IconFont
          iconName="icon-more-clusterform"
          className="rounded hover:bg-grey-300"
          color="#0D55DA"
          width={20}
          height={20}
        />
        <span className="pl-1">add data disk</span>
      </Flex>
    </>
  );
};

export default ScpFormComponent;
