import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  proxy: {
    '/api': {
      target: 'http://public-api-v1.aspirantzhang.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  /*
    component '@/pages/users'指向地址 或者 users 默认指向 @/pages/下
    如果routes不写，默认会拿@/pages下的文件夹名字 作为路由 component指向文件夹
    以下三种写法效果一样

    routes: [{ path: '/users', component: '@/pages/users' }]
    routes: [{ path: '/users', component: 'users' }]
    不写routes
  */
  routes: [{ path: '/', component: '@/pages/users' }],
});
