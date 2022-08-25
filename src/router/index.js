import Vue from 'vue';
import Router from 'vue-router';
//index
const index = () => import('../components/Home');
//login
const login = () => import('../components/Login');
//shopcart
const shopcart = () => import('../components/shopcart');
//order
const order = () => import('../components/order');
//myorder
const myorder = () => import('../components/myorder');
//change
const change = () => import('../components/change');
//admin
const admin = () => import('../components/admin');
//admin
const adminlogin = () => import('../components/adminLogin');

Vue.use(Router);

let router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/home',
      name: 'home',
      component: index,
    },
    //登录
    {
      path: '/login',
      name: 'login',
      component: login
    },
    //购物车
    {
      path: '/shopcart',
      name: 'shopcart',
      meta: {
        require: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      component: shopcart
    },
    //订单
    {
      path: '/order',
      name: 'order',
      meta: {
        require: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      component: order
    },
    //我的订单
    {
      path: '/myorder',
      name: 'myorder',
      meta: {
        require: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      component: myorder
    },
    //修改文件
    {
      path: '/change',
      name: 'change',
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      component: change
    },
    //后台登录
    {
      path: '/adminlogin',
      name: 'adminlogin',
      component: adminlogin
    },
    //后台
    {
      path: '/admin',
      name: 'admin',
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      component: admin
    },
  ]
});
export default router;

router.beforeEach((to, from, next) => {
  /* 路由发生变化 */
  if (to.meta.requireAuth) {
    let nowloginstatus = localStorage.getItem('isAdminLogin');
    nowloginstatus = JSON.parse(nowloginstatus);
    if (nowloginstatus) {
      next()
    } else {
      next({ path: '/adminlogin' })
    }
  } else {
    next()
  };
  let nowloginstatus = localStorage.getItem("isLogin");
  nowloginstatus = JSON.parse(nowloginstatus);
  let tokenarr = localStorage.getItem("token");
  if (to.name == 'login') {
    if (nowloginstatus) {
      next({ path: '/home' });
    }
  }
  if (to.meta.require) {
    if (nowloginstatus) {
      tokenarr = JSON.parse(tokenarr);
      let nowtime = Date.parse(new Date()) / 1000;
      let nowtokne = parseInt(tokenarr.tokenExpired) - parseInt(nowtime); //判断是否过期
      if (tokenarr && nowtokne < 0) {
        this.$message.error("您的登录已经过期，请重新登录！");
        next({ path: '/login' })
      }
    } else {
      next({ path: '/login' })
    }
  } else {
    next()
  };
  next();
});
