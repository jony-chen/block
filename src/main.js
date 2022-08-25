// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// import cloudbase from '@cloudbase/js-sdk';
//element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js';
//axios
import axios from 'axios';
//md5
import md5 from 'js-md5';
//CryptoJS
import CryptoJS from 'crypto-js';
//vuex
import store from './store';
//excal
import JsonExcel from 'vue-json-excel';
//地区选择器
import Region from 'v-region';

Vue.use(Region);
Vue.use(ElementUI);
Vue.use(CryptoJS);
Vue.component('downloadExcel', JsonExcel)
Vue.prototype.$md5 = md5;
Vue.prototype.axios = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
