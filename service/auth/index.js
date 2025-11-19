import {
	loginApi
} from '@/api/auth/index.js'
import store from '@/store/index.js';


export const login = async (option) => {
	const {
		code
	} = await wx.login();
	option["code"] = code;
	return new Promise((resolve, reject) => {
		loginApi(option).then(res => {
			store.dispatch('setUserInfo', res.data);
			resolve();
		}).catch(err => {
			reject(err);
		})
	});
}

export const getToken = async () => {
	const res = await wx.login();
}