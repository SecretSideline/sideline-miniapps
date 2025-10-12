module.exports =  {
	success: function(data) {
		return {
			success: true,
			code: 200,
			msg: '操作成功',
			data: data
		}
	},
	fail: function(code, msg, data) {
		return {
			success: false,
			code: code,
			msg: msg,
			data: data
		}
	}
}
