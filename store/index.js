//  页面路径：store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);//vue的插件机制

import userInfo from './modules/UserInfo'
const store = new Vuex.Store({
	modules: {
		userInfo
	}
});
export default store; 