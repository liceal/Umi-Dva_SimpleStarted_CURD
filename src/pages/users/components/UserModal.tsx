import React, { useEffect, FC } from 'react';
import { Modal, Form, Input, DatePicker, Switch } from 'antd';
import moment from 'moment';

interface UserModalProps {
  record: SingleUserType | undefined;
  visible: boolean;
  closeHandler: () => void;
  onFinish: (values: FormValues) => void;
  confirmLoading: boolean;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const UserModal: FC<UserModalProps> = props => {
  // console.log(props.record);
  const [form] = Form.useForm();
  const { record, visible, closeHandler, onFinish, confirmLoading } = props;

  // 异步事件，参数二发生了变化 执行参数一方法
  useEffect(() => {
    if (record === undefined) {
      //如果record直接等于 undefined 表单数据并不会为空
      form.resetFields(); //重置值
    } else {
      //结构赋值，create_time需要moment类型
      form.setFieldsValue({
        ...record,
        create_time: moment(record.create_time),
        checked: record.status === 1,
      }); //初始化表单
    }
  }, [visible]);

  return (
    <div>
      <Modal
        title={
          //渲染ReactNode或者string类型
          record ? (
            <span>
              Edit Id:&nbsp;<a>{record.id}</a>
            </span>
          ) : (
            `Add`
          )
        }
        visible={visible}
        onOk={() => {
          form.submit();
        }}
        onCancel={closeHandler}
        forceRender // 预加载
        confirmLoading={confirmLoading}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
          onFinish={onFinish}
          initialValues={{
            //表单默认值
            status: true,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Create Time" name="create_time">
            <DatePicker showTime />
          </Form.Item>

          {/* valuePropName 指定内容替换的value值为checked 默认为value */}
          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserModal;
