import request, { extend } from 'umi-request';
import { message } from 'antd';

const requestX = extend({
  //统一异常处理
  errorHandler: error => {
    //要把error内的response取出来，不然得不到json
    const { response = {} }: any = error;
    if (response.status > 400) {
      message.error(error.data.message ?? error.data);
    } else {
      message.error('Network Error');
    }
    throw error; //继续抛出错误，下面的catch还是会接到错误
  },
  timeout: 5000, //请求最长延迟
  prefix: 'api/', //加上api前缀 /api/users
});

//获取数据
export const getRemoteList = async (params?: {
  page: number;
  per_page: number;
}) => {
  return requestX('users', {
    method: 'GET',
    params: params,
  })
    .then(res => {
      message.success('获取数据成功');
      console.log('获取数据成功');
      return res;
    })
    .catch(e => {
      message.error('获取数据失败');
      console.log('获取数据失败');
      return false;
    });
};

//更新数据
export const editRecord = async ({ id, values }: any) => {
  return requestX(`users/${id}`, {
    method: 'PUT',
    data: values,
  })
    .then(res => {
      message.success('更新成功');
      console.log('更新成功');
      return true;
    })
    .catch(e => {
      message.error('更新失败');
      console.log('更新失败', e);
      return false;
    });
};

//新增数据
export const addRecord = async ({ values }: any) => {
  return requestX(`users`, {
    method: 'POST',
    data: values,
  })
    .then(res => {
      message.success('新增成功');
      console.log('新增成功');
      return true;
    })
    .catch(e => {
      message.error('新增失败');
      console.log('新增失败', e);
      return false;
    });
};

//删除数据
export const deleteRecord = async (id: number) => {
  return requestX(`users/${id}`, {
    method: 'DELETE',
  })
    .then(res => {
      message.success('删除成功');
      console.log('删除成功', res);
      return true;
    })
    .catch(e => {
      message.error('删除失败');
      console.log('删除失败', e);
      return false;
    });
};
