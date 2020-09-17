import React, { useState, FC, useRef, ReactNode } from 'react';
import {
  Table,
  Tag,
  Space,
  Popconfirm,
  message,
  Button,
  Pagination,
} from 'antd';
/*
  UserStateType 是 model 内导出的一个interface
*/
import { connect, Dispatch, Loading, UserStateType } from 'umi';
import UserModal from './components/UserModal';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getRemoteList, editRecord, addRecord } from './service';

/*
  FC function component 函数组件的意思
*/

interface UserPageProps {
  users: UserStateType;
  dispatch: Dispatch;
  userListLoading: boolean;
}

interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  reloadAndRest: () => void;
  fetchMore: () => void;
  reset: () => void;
  clearSelected: () => void;
}

/*
  FC function component 方法组件的意思 
  <泛型> 接口继承
*/
const UserListPage: FC<UserPageProps> = ({
  users,
  dispatch,
  userListLoading,
}) => {
  /*
		改变变量，变量定义为两个参数，【取值变量，设置方法】
		这里 useState(false) 默认传参false
		传参 setModalVisible(newVal) 改变modelVisible
	*/
  const [modelVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [record, setRecord] = useState<SingleUserType | undefined>(undefined);
  const ref = useRef<ActionType>();

  //提交数据后执行
  const onFinish = async (values: FormValues) => {
    setConfirmLoading(true); //按钮进入加载状态
    //id=0的时候是新增
    let id = record ? record.id : 0;
    let serviceFun;
    if (id) {
      serviceFun = editRecord;
    } else {
      serviceFun = addRecord;
    }

    const result = await serviceFun({ id, values });
    //执行成功，把窗口关了，否则报错一下
    if (result) {
      setModalVisible(false); //按钮关闭加载状态
      dispatch({
        type: 'users/getRemote',
        payload: {
          page: users.meta.page,
          per_page: users.meta.per_page,
        },
      });
      setConfirmLoading(false);
    } else {
      setConfirmLoading(false);
      console.log(`${id === 0 ? 'Add' : 'Edit'} error`);
      // message.error(`${id === 0 ? 'Add' : 'Edit'} error`);
    }
  };

  //删除数据
  const onDelete = ({ id }: { id: number }) => {
    dispatch({
      type: 'users/delete',
      payload: { id },
    });
  };

  //分页处理
  const paginationHandler = (page: number, pageSize?: number) => {
    // console.log(page, pageSize);
    dispatch({
      type: 'users/getRemote',
      payload: {
        page,
        per_page: pageSize ? pageSize : users.meta.per_page,
      },
    });
  };

  // //使用ProTable自带的事件
  // const requestHandler = async ({ pageSize, current }) => {
  //   console.log(pageSize, current);
  //   const users = await getRemoteList({
  //     page: current,
  //     per_page: pageSize,
  //   });
  //   return {
  //     data: users.data,
  //     success: true,
  //     total: users.meta.total,
  //   };
  // };

  //接口继承源码的Procolums,泛型将为render的第二个参数用到
  const columns: ProColumns<SingleUserType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      valueType: 'digit',
      render: (text: ReactNode) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      valueType: 'text',
      key: 'name',
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      render: (text: ReactNode, record) => (
        <Space>
          <a
            onClick={() => {
              setModalVisible(true);
              setRecord(record);
            }}
          >
            Edit
          </a>
          &nbsp;
          <Popconfirm
            title="Are you sure delete this record?"
            onConfirm={() => {
              onDelete(record);
            }}
            onCancel={() => {
              message.info('取消删除');
            }}
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div className="list-table">
      <ProTable
        headerTitle="umi+dva的简单CURD，接口30%抛出异常"
        loading={userListLoading}
        columns={columns}
        dataSource={users.data}
        rowKey="id"
        // request={requestHandler}
        search={false} //查询条件以及按钮隐藏
        actionRef={ref}
        pagination={false}
        options={{
          reload() {
            //定义右上角按钮的功能
            paginationHandler(users.meta.page, users.meta.per_page);
          },
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setModalVisible(true);
              setRecord(undefined);
            }}
          >
            Add
          </Button>,
          <Button
            onClick={() => {
              ////源码内可以传参，true将重置到第一页
              // ref.current?.reload();
              paginationHandler(users.meta.page, users.meta.per_page);
            }}
          >
            Reload
          </Button>,
        ]}
      />

      <Pagination
        className="list-page"
        total={users.meta.total}
        onChange={paginationHandler}
        current={users.meta.page}
        pageSize={users.meta.per_page}
        showSizeChanger
        showQuickJumper
        showTotal={total => `Total ${total} items`}
        pageSizeOptions={['5', '10', '20', '30']}
      />

      <UserModal
        visible={modelVisible}
        closeHandler={() => {
          setModalVisible(false);
        }}
        record={record}
        onFinish={onFinish}
        confirmLoading={confirmLoading}
      />
    </div>
  );
};

//返回model内的订阅setup执行结果 其中有键为namespaces的表示指定model返回值
//或者当 reducers 被执行同步这里刷新数据
const mapStateToProps = ({
  users,
  loading,
}: {
  users: UserStateType;
  loading: Loading;
}) => {
  // console.log(loading);
  // loading 返回model请求的状态
  return {
    users,
    userListLoading: loading.models.users,
  };
};

//连接数据，index中会得到mapStateToProps的返回值
export default connect(mapStateToProps)(UserListPage);
