import Vue from 'vue';
import App from './App';
// 弹出框
import DialogBox from './components/DialogBox/DialogBox';

import AuthModel from './components/AuthModel/AuthModel.vue';


Vue.config.productionTip = false

// 全局组件
Vue.component('DialogBox', DialogBox);
Vue.component('AuthModel', AuthModel);
//mescroll
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)
// store

import store from './store';

App.mpType = 'app'

Vue.prototype.$store = store;

const app = new Vue({
	store,
	...App
})
app.$mount();