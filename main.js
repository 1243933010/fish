import Vue from 'vue'
import App from './App'

// import TIM from './util/tim-js.js'
// import COS from './util/cos-js-sdk-v5.js'


import api from './util/api.js'
import {$Get,$Post,$Toast,$login} from './util/request.js'


Vue.config.productionTip = false






App.mpType = 'app'
Vue.prototype.baseUrl = 'http://47.95.39.75:9706/';
Vue.prototype.api = api.api;

Vue.prototype.$Get = $Get;
Vue.prototype.$Post = $Post;
Vue.prototype.$Toast = $Toast;
Vue.prototype.$login = $login;


				
				
const app = new Vue({
    ...App
})
app.$mount()
