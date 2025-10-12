
const crypto = require('crypto')

module.exports = function(e) {
	// 公用模块用法请参考 https://uniapp.dcloud.io/uniCloud/cf-common
	const timer = new Date().getTime();
	const nonce = Math.random().toFixed(6).slice(-6);
	const signStr = `appKey=${e.app_key}&timer=${timer}&nonce=${nonce}&key=${e.app_secret}`
	const signRan = crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
	const param = {
		signRan,
		appKey:e.app_key,
		timer,
		nonce
	}
	return param
}
