import IconFont from '@/components/iconfont';
import MarkDown from '@/components/markdown';
import {
  conversionPrice,
  debounce,
  generateYamlTemplate,
  SELECT_DISK_TYPE,
  SELECT_SCP_TYPE,
  sliceMarkDown,
  TScpForm,
  TScpFormComponent,
  TSelectOption,
  validResourcesName
} from '@/interfaces/infra_common';
import request from '@/services/request';
import useSessionStore from '@/stores/session';
import { useQuery } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import clsx from 'clsx';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './add_page.module.scss';

const HeaderInfoComponent = ({ content }: { content: string }) => {
  return (
    <div className={clsx('flex items-center mb-3')}>
      <div className={styles.info_left}></div>
      <div className={styles.info_right}>{content}</div>
    </div>
  );
};

const ScpFormComponent = (props: TScpFormComponent) => {
  const { type, scpImageOptions } = props;
  return (
    <>
      <HeaderInfoComponent content={type === 'node' ? 'Node' : 'Master'} />
      <div
        className={clsx(styles.custom_antd_form_select, {
          [styles.hidden_form_item]: type === 'node'
        })}
      >
        <Form.Item name="scpImage" label="image">
          <Select options={scpImageOptions ? scpImageOptions : []} />
        </Form.Item>
      </div>
      <div className={clsx(styles.custom_antd_form_select)}>
        <Form.Item name={`${type}Count`} label="count">
          <InputNumber min={1} max={10} />
        </Form.Item>

        <Form.Item name={`${type}Type`} label="flavor">
          <Select options={SELECT_SCP_TYPE} />
        </Form.Item>
      </div>
      <div className={clsx(styles.custom_antd_form_min_select)}>
        <Form.Item label="root volume">
          <Space>
            <Form.Item name={`${type}RootDiskSize`}>
              <InputNumber min={8} max={128} />
            </Form.Item>
            GB
          </Space>
        </Form.Item>
        <Form.Item name={`${type}RootDiskType`}>
          <Select options={SELECT_DISK_TYPE} />
        </Form.Item>
      </div>
      <Form.List name={`${type}DataDisks`}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className={clsx(styles.custom_antd_form_min_select)}>
                <Form.Item {...restField} label="data volume" name={[name, 'capacity']}>
                  <Space>
                    <InputNumber min={8} max={128} defaultValue={8} />
                    <div className={'inline-block align-middle'}>GB</div>
                  </Space>
                </Form.Item>
                <Form.Item {...restField} name={[name, 'volumeType']}>
                  <Select defaultValue={'gp3'} options={SELECT_DISK_TYPE} />
                </Form.Item>
                <div className="mt-1 ml-3" onClick={() => remove(name)}>
                  <IconFont iconName="icon-delete-button" color="#0D55DA" width={24} height={24} />
                </div>
              </div>
            ))}

            <div
              className="flex items-center cursor-pointer ml-3 mb-3"
              onClick={() => {
                if (fields.length + 1 > 16) return;
                add({ capacity: 8, volumeType: 'gp3', type: 'data' });
              }}
            >
              <IconFont
                iconName="icon-more-clusterform"
                className="rounded hover:bg-gery-300"
                color="#0D55DA"
                width={20}
                height={20}
              />
              <span className="pl-1">add data disk</span>
            </div>
          </>
        )}
      </Form.List>
    </>
  );
};

export default function AddPage() {
  const router = useRouter();
  const { kubeconfig } = useSessionStore((state) => state.getSession());
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const scpForm: TScpForm = {
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
  };
  const { data } = useQuery(
    ['getConfigMap'],
    async () =>
      await request.post('/api/infra/getConfigMap', {
        kubeconfig,
        name: 'infra-ami-config'
      })
  );
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
    const newValue = sliceMarkDown(value);
    navigator.clipboard.writeText(newValue);
    messageApi.open({
      type: 'success',
      content: isShowContent ? `${value} copied` : 'copied'
    });
  };

  const onFinish = async (values: any) => {
    console.log(values, '-');

    applyScpMutation();
  };

  const applyScpMutation = async () => {
    const scpYaml = sliceMarkDown(yamlTemplate);
    const res = await request.post('/api/infra/aws_apply', {
      kubeconfig,
      scp_yaml: scpYaml
    });
    console.log(res);
  };

  const isScpExist = (name: string) => {
    return new Promise((resolve, reject) => {
      if (name === '') {
        reject('name is required');
      }
      if (!validResourcesName(name)) {
        reject("Contains only lowercase letters, digits, and hyphens (-) and '.'");
      }
      debounce(async () => {
        const res = await request.post('/api/infra/awsGet', {
          kubeconfig,
          infraName: name
        });
        if (!!res.data.status) {
          reject(`infras.infra.sealos.io ${name} already exists`);
        }
      });
      resolve();
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  async function getPrice(form: TScpForm) {
    const res = await request.post('/api/infra/awsGetPrice', form);
    if (res?.data?.code === 200) {
      let price = conversionPrice(res?.data?.sumPrice, 2);
      setScpPrice(price);
    }
  }
  const onValuesChange = (changedValues: any, allValues: any) => {
    setYamlTemplate(generateYamlTemplate({ ...scpForm, ...allValues }));
    debounce(() => getPrice({ ...scpForm, ...allValues }));
  };

  useEffect(() => {
    getPrice(scpForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {contextHolder}
      <div className="flex items-center">
        <div className={clsx(styles.back_btn)}>
          <Button onClick={backIndexPage}>
            <IconFont iconName="icon-back-button" color="#0D55DA" width={20} height={20} />
          </Button>
        </div>
        <div className={clsx('text-blue-800 pl-4 font-semibold text-xl lg:text-2xl')}>
          Create My Cluster
        </div>
        <div className={clsx('text-blue-800 ml-auto text-lg lg:text-2xl font-medium')}>
          ¥ <span style={{ color: '#ef7733' }}>{scpPrice}</span> / Hour
        </div>
        <div className={styles.create_btn}>
          <Button type="primary" onClick={() => form.submit()} htmlType="submit">
            Create Now
          </Button>
        </div>
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
            <Form
              form={form}
              name="yamlform"
              colon={false}
              initialValues={scpForm}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onValuesChange={onValuesChange}
              autoComplete="off"
            >
              <HeaderInfoComponent content="Info" />
              <Form.Item
                label="cluster name"
                name="infraName"
                style={{ marginLeft: '6px', marginBottom: '30px' }}
                wrapperCol={{ span: 12 }}
                rules={[
                  {
                    validator: (_, value) => isScpExist(value)
                  }
                ]}
              >
                <Input style={{ width: '322px', height: '28px', backgroundColor: '#FAFAFC' }} />
              </Form.Item>
              {/* <div className={clsx(styles.custom_antd_form_select)}>
                <Form.Item name="sealosVersion" label="sealos version">
                  <Select options={[{ value: 'Aws', label: 'Aws' }]} />
                </Form.Item>
                <Form.Item name="sealosPlatform" label="platform">
                  <Select
                    options={[
                      { value: 'jack', label: 'Jack' },
                      { value: 'lucy', label: 'Lucy' },
                      { value: 'Yiminghe', label: 'yiminghe' }
                    ]}
                  />
                </Form.Item>
              </div> */}
              <ScpFormComponent type="master" scpImageOptions={imageOptions} />
              <ScpFormComponent type="node" />
            </Form>
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
            <HeaderInfoComponent content="YAML Definition" />
            <div
              className="ml-auto p-1 rounded hover:bg-gery-300"
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
