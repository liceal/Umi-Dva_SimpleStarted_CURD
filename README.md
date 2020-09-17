# Umi+Dva_SimpleStarted_CURD
> https://www.bilibili.com/video/BV1qz411z7s3
>
> 简单入门，参考以上UP入门教程

项目框架Umijs框架，其中使用dva做数据流

dva内集合redux，类似vuex，进行全局状态管理

## 项目[创建](https://umijs.org/zh-CN/docs/getting-started#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87)

> $ yarn create @umijs/umi-app

## [配置](https://umijs.org/zh-CN/docs/config) .umirc.ts

```ts
//代理，这里使用远程的地址，这个接口将会有30%的概率抛出异常，前端可以进行异常处理
proxy:{
    '/api':{
        target:'http://public-api-v1.aspirantzhang.com',
        changeOrigin:true,
        pathRewrite:{'^/api':''}
    }
},
/*
  component '@/pages/users'指向地址 或者 users 默认指向 @/pages/下
  如果routes不写，默认会拿@/pages下的文件夹名字 作为路由 component指向文件夹
  以下三种写法效果一样

  routes: [{ path: '/users', component: '@/pages/users' }]
  routes: [{ path: '/users', component: 'users' }]
  不写routes
*/
routes: [{ path: '/users', component: '@/pages/users' }],
```

## 一个模块文件夹 page/users

### service.ts

> 服务，定义请求，统一异常处理等。
>
> 使用方式与vue-router一样

```ts
import { extend } from 'umi-request';
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
...
```

### model.ts

> 定义模型，在这里调用service.ts请求数据，处理数据。

```ts
import { Reducer, Effect, Subscription } from 'umi';
...
const UserModel: UserModelType = {
  //标识
  namespace: 'users',
  //全局变量
  state: {...},
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
    *getRemote({ payload }, { put, call }) {
      //call(方法，传递参数)
      const data = yield call(Fn, params);
      ...
      //yield会等待
      yield put({
        type: 'getList', //reducers或者effects内的方法
        payload: { data }, //传递参数
      });
    },
    ...
  },
  //订阅
  subscriptions: {
    setup({ dispatch, history }, done) {
      //监听路由
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          //在这里调用 可以直接使用事件名字，如果在外面 需要使用加上命名空间
          dispatch({
            type: 'getRemote', //在外面调用 users/getRemote
            payload: {...}, //传参
          });
        }
      });
    },
  },
};
...
```

### index.tsx

> 主要渲染，主出口
>
> 最后 return 一个dom

```tsx
import React, { useState, FC, useRef, ReactNode } from 'react';
/*
  UserStateType 这个自定义的接口为什么在umi内，因为model.ts export了这个
  model.ts 导出的接口，umi会统一
*/
import { connect, Dispatch, Loading, UserStateType } from 'umi';
/*
  FC function component 方法组件的意思 
  <泛型> 接口继承
*/
const UserListPage: FC<UserPageProps> = ({
    ...
    /*
	  改变变量，变量定义为两个参数，【取值变量，设置方法】
	  传参 setModalVisible(newVal) 改变 modelVisible
	  这里 useState(false) 默认传参false
	*/
  	const [modelVisible, setModalVisible] = useState(false);
    ...
    /*
      跟vue的ref锚点一样
      添加泛型，对获取的dom进行属性接口定义
      例子：<ProTable actionRef={ref} />
    */
    const ref = useRef<ActionType>();
	...
    const columns: ProColumns<SingleUserType>[] = [
      {
        ...
        /*
          ReactNode 接口，是一个jsx类型数据的接口
          基本render都会继承这个接口，因为要渲染参数可能是个dom
        */
        render: (text: ReactNode) => <a>{text}</a>,
      },
    ]
})
...
/*
  返回model内的订阅setup执行结果 其中有键为namespaces的表示指定model返回值
  或者当 reducers 被执行同步这里刷新数据
*/
const mapStateToProps = (...) => {
  /*
    这里返回值会给到下一个 () 中 如这里的 UserListPage
    下一个 fn 会在传参中接到上一个 fn 的 return
  */ 
  return params;
};
//连接数据，index中会得到mapStateToProps的返回值
export default connect(mapStateToProps)(UserListPage);
```

 ### data.d.ts

> .d.ts 接口定义

```ts
/*
  全局接口
  写在这个文件内的接口，其他文件不需要导入可以直接使用到
*/

interface SingleUserType {...}

interface FormValues {}
```

# 后端

> http://public-api-v1.aspirantzhang.com/



# 开始

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```
