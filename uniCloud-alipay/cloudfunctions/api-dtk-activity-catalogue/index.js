'use strict';
// 优惠券查询
const uri = "/api/goods/activity/catalogue";
const version = "v1.0.0";
const signApi = require('api-dtk-sign')
const apiResult = require('api-result')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.databaseForJQL({
		event,
		context
	});
	const result = await db.collection('api-config')
		.where('type==10')
		.get();
	const config = result.data[0];
	const baseParam = signApi({
		app_key: config.app_key,
		app_secret: config.app_secret
	});
	baseParam.content = event.content;
	const reqResult = await uniCloud.httpclient.request(config.base_url + uri, {
		method: 'GET',
		data: baseParam,
		dataType: 'json',
		header: {
			'content-type': 'application/json'
		}
	});
	const reqData = reqResult.data;
	if (reqData.code == 0) {
		return apiResult.success(reqData.data)
	}
	console.error("[dtk][]")
	//返回数据给客户端
	return apiResult.fail(500,"请求失败，请稍后再试")
};