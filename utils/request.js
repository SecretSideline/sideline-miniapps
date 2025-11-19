import store from '@/store/index.js';

import {
	login
} from '@/service/auth/index.js'

const noNeedAuthUrls = ['/wei-xin-auth/login'];


// 请求超时时间，单位毫秒
const REQUEST_TIMEOUT = 60000;

// 用于存储待处理的请求（处理重复请求和取消请求）
let pendingRequests = {};

/**
 * 获取token的方法
 * 例如，从本地存储或vuex中获取
 */
function getToken() {
	return store.getters.getServerToken;
}

/**
 * 移除待处理的请求
 * 主要用于处理重复的请求和取消请求
 * @param {Object} config - 请求配置
 */
// 如发起了一个GET请求
// request.get("/api/data");
// 随后决定取消这个请求
// removePendingRequest({ method: "GET", url: "/api/data" });

function removePendingRequest(config) {
	const requestIdentifier = `${config.method}${config.url}`;
	if (pendingRequests[requestIdentifier]) {
		const {
			task
		} = pendingRequests[requestIdentifier];
		task.abort();
		delete pendingRequests[requestIdentifier];
	}
}


/**
 * 全局请求拦截器
 * 可以用于修改请求配置，如添加请求头等
 * @param {Object} config - 请求配置
 * @return {Object} - 返回修改后的请求配置
 */
function requestInterceptor(config) {
	if (!noNeedAuthUrls.includes(config.url) && store.getters.hasLogin) {
		config.header["CAT4J-AUTH-TOKEN"] = getToken();
	}
	return config;
}

let addRequestInterceptor = false;

function request(options) {
	return new Promise(async (resolve, reject) => {
		if (!noNeedAuthUrls.includes(options.url) && !store.getters.hasLogin) {
			await login();
		}
		options.url = process.env.API_BASE_URL + options.url;
		const finalOptions = {
			...options,
			url: options.url,
			timeout: REQUEST_TIMEOUT,
			header: {
				"Content-Type": "application/json",
				...options.header
			}
		};

		// 使用请求拦截器
		const interceptedOptions = requestInterceptor(finalOptions);

		// 取消重复的请求
		removePendingRequest(interceptedOptions);
		const requestTask = uni.request({
			...interceptedOptions,
			success: (response) => {
				resolve(response.data);
			},
			fail: (error) => {
				reject(error);
			},
			complete: () => {
				removePendingRequest(interceptedOptions);
			}
		});

		// 存储此次请求任务，以供后续处理
		const requestIdentifier = `${interceptedOptions.method}${interceptedOptions.url}`;
		pendingRequests[requestIdentifier] = {
			cancel: reject,
			task: requestTask
		};
	});
}

export default {
	/**
	 * 封装的GET请求方法
	 * @param {string} url - 请求的URL
	 * @param {Object} params - 请求参数
	 * @param {Object} options - 其他选项
	 * @return {Promise} - 返回一个Promise对象
	 */
	get(url, params = {}, options = {}) {
		return request({
			method: "GET",
			url,
			data: params,
			...options
		});
	},
	/**
	 * 封装的POST请求方法
	 * @param {string} url - 请求的URL
	 * @param {Object} data - 请求数据
	 * @param {Object} options - 其他选项
	 * @return {Promise} - 返回一个Promise对象
	 */
	post(url, data, options = {}) {
		return request({
			method: "POST",
			url,
			data,
			...options
		});
	},
	/**
	 * 封装的PUT请求方法
	 * @param {string} url - 请求的URL
	 * @param {Object} data - 请求数据
	 * @param {Object} options - 其他选项
	 * @return {Promise} - 返回一个Promise对象
	 */
	put(url, data, options = {}) {
		return request({
			method: "PUT",
			url,
			data,
			...options
		});
	},
	/**
	 * 封装的DELETE请求方法
	 * @param {string} url - 请求的URL
	 * @param {Object} data - 请求数据
	 * @param {Object} options - 其他选项
	 * @return {Promise} - 返回一个Promise对象
	 */
	delete(url, data, options = {}) {
		return request({
			method: "DELETE",
			url,
			data,
			...options
		});
	}
}