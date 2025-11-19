export default {
	state: {
		userId: "",
		nickName: "",
		avatarUrl: "",
		phoneNumber: "",
		wxToken: "",
		serverToken: "",
		refreshToken: "",
		openid: "",
		unionid: ""
	},
	getters: {
		hasLogin(state) {
			const serverToken = state.serverToken || uni.getStorageSync('serverToken');
			return !(serverToken == undefined || serverToken == null || serverToken == "");
		},
		getUserId(state) {
			return state.userId || uni.getStorageSync('userId');
		},
		getNickName(state) {
			return state.nickName || uni.getStorageSync('nickName');
		},
		getAvatarUrl(state) {
			return state.avatarUrl || uni.getStorageSync('avatarUrl');
		},
		getPhoneNumber(state) {
			return state.phoneNumber || uni.getStorageSync('phoneNumber');
		},
		getWxToken(state) {
			return state.wxToken || uni.getStorageSync('wxToken');
		},
		getServerToken(state) {
			return state.serverToken || uni.getStorageSync('serverToken');
		},
		getOpenid(state) {
			return state.openId || uni.getStorageSync('openId');
		}
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userId = userInfo.userId;
			state.phoneNumber = userInfo.phoneNumber;
			state.wxToken = userInfo.wxToken;
			state.serverToken = userInfo.serverToken;
			state.openId = userInfo.openId;
		},
		updateToken(state, tokenInfo) {
			state.wxToken = tokenInfo.wxToken;
			state.serverToken = tokenInfo.serverToken;
		},
		setAvatarUrl(state, avatarUrl) {
			state.avatarUrl = avatarUrl;
		},
		setNickName(state, nickName) {
			state.nickName = nickName;
		}
	},
	actions: {
		setUserInfo({
			commit
		}, userInfo) {
			commit('setUserInfo', userInfo);
			uni.setStorage({
				key: 'userId',
				data: userInfo.userId
			});
			// 个人主体无法获取手机号，暂时下线
			// uni.setStorage({
			// 	key: 'phoneNumber',
			// 	data: userInfo.phoneNumber
			// });
			uni.setStorage({
				key: 'wxToken',
				data: userInfo.wxToken
			});
			uni.setStorage({
				key: 'serverToken',
				data: userInfo.serverToken
			});
			uni.setStorage({
				key: 'openId',
				data: userInfo.openId
			});
		},
		updateToken({
			commit
		}, tokenInfo) {
			commit('updateToken', tokenInfo);
			uni.setStorage({
				key: 'wxToken',
				data: userInfo.wxToken
			});
			uni.setStorage({
				key: 'serverToken',
				data: userInfo.serverToken
			});
		},
		setAvatarUrl({
			commit
		}, avatarUrl) {
			commit('setAvatarUrl', avatarUrl);
			uni.setStorage({
				key: 'avatarUrl',
				data: avatarUrl
			});
		},
		setNickName({
			commit
		}, nickName) {
			commit('setNickName', nickName);
			uni.setStorage({
				key: 'nickName',
				data: nickName
			});
		}
	}
}