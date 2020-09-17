import { Reducer, Effect, Subscription } from 'umi';
import { getRemoteList, editRecord, deleteRecord, addRecord } from './service';

export interface UserStateType {
  data: SingleUserType[]; //这个接口是由 data.d.ts 提供
  meta: {
    total: number;
    per_page: number;
    page: number;
  };
}

//接口ts类型定义
interface UserModelType {
  namespace: 'users';
  state: UserStateType;
  reducers: {
    getList: Reducer<UserStateType>;
  };
  effects: {
    getRemote: Effect;
    edit: Effect;
    delete: Effect;
    add: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const UserModel: UserModelType = {
  //标识
  namespace: 'users',
  //全局变量
  state: {
    data: [],
    meta: {
      total: 0,
      per_page: 5,
      page: 1,
    },
  },
  //同步事件 返回页面数据的最后一步
  reducers: {
    getList(state, { payload }) {
      //action 被执行时传递参数
      return payload.data;
    },
  },
  //异步事件 使用put()调用reducers内的方法 可以使用yield await进行等待
  effects: {
    //获取数据
    *getRemote({ payload: { page, per_page } }, { put, call }) {
      const data = yield call(getRemoteList, { page, per_page });
      // console.log(data);
      if (!data) {
        return false;
      }
      //会等待
      yield put({
        type: 'getList',
        payload: { data },
      });
    },
    //修改数据
    *edit({ payload: { id, values } }, { put, call, select }) {
      const data = yield call(editRecord, { id, values });
      const { page, per_page } = yield select(
        (state: { users: UserStateType }) => state.users.meta,
      );
      yield put({
        type: 'getRemote',
        payload: {
          page,
          per_page,
        },
      });
      console.log(data);
    },
    //增加数据
    *add({ payload: { values } }, { put, call, select }) {
      const data = yield call(addRecord, { values });
      const { page, per_page } = yield select(
        (state: { users: UserStateType }) => state.users.meta,
      );
      yield put({
        type: 'getRemote',
        payload: {
          page,
          per_page,
        },
      });
      console.log(data);
    },
    //删除数据
    *delete({ payload: { id } }, { put, call, select }) {
      const data = yield call(deleteRecord, id);
      const { page, per_page } = yield select(
        (state: { users: UserStateType }) => state.users.meta,
      );
      yield put({
        type: 'getRemote',
        payload: {
          page,
          per_page,
        },
      });
    },
  },
  //订阅
  subscriptions: {
    setup({ dispatch, history }, done) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          //在这里调用 可以直接使用事件名字，如果在外面 需要使用加上命名空间
          dispatch({
            type: 'getRemote',
            payload: {
              page: 1,
              per_page: 5,
            },
          });
        }
      });
    },
  },
};

export default UserModel;
