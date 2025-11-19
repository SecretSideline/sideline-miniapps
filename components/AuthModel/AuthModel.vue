<template>
	<view>
		<uni-popup class="auth-popup" :mask-click="false" :is-mask-click="false" background-color="#fff" ref="authPopup"
			type="bottom" border-radius="20px 20px 0 0">
			<view class="containar">
				<view class="avatarUrl">
					<button type="balanced" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
						<image v-if="avatarUrl" :src="avatarUrl" alt="点击选择头像" class="refreshIcon"></image>
						<text v-else>点击选择头像</text>
					</button>
				</view>
				<view class="userName">
					<input :clearable="false" type="nickname" class="weui-input" :value="nickName" @blur="bindblur"
						placeholder="请点击获取昵称" @input="bindinput" />
				</view>
				<view class="btn-container">
					<u-button class="btn btn-cancel" @tap="cancel" type="primary">取 消</u-button>
					<u-button class="btn btn-login" @tap="doLogin" type="primary">登 录</u-button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		login
	} from '@/service/auth/index.js'
	import {
		mapGetters
	} from 'vuex';
	import store from '@/store/index.js';
	export default {
		name: "AuthModel",
		data() {
			return {
				localNickName: this.nickName,
				localAvatarUrl: this.avatarUrl
			};
		},
		computed: {
			...mapGetters({
				isLogin: 'hasLogin',
				nickName: 'getNickName',
				avatarUrl: 'getAvatarUrl'
			})
		},
		mounted() {
			console.log(this.isLogin)
			if (!this.isLogin) {
				this.$refs.authPopup.open('bottom');
			}
		},
		methods: {
			open() {
				this.$refs.authPopup.open('bottom');
			},
			bindblur(e) {
				this.localNickName = e.detail.value;
				store.dispatch('setNickName', e.detail.value);
			},
			bindinput(e) {
				this.localNickName = e.detail.value;
				store.dispatch('setNickName', e.detail.value);
			},
			async doLogin() {
				console.log('doLogin');
				const self = this;
				uni.showLoading({
					title: "登录中。。。"
				});
				await login({
					"avatarUrl": self.avatarUrl,
					"nickName": this.userName
				});
				uni.hideLoading();
				uni.showToast({
					title: "登录成功",
					duration: 1500,
				});
				this.$refs.authPopup.close()
			},
			cancel() {
				console.log('cancel');
				this.$refs.authPopup.close();
			},
			onChooseavatar(e) {
				let self = this;
				let {
					avatarUrl
				} = e.detail;
				this.getBase64Image(avatarUrl).then(res => {
					store.dispatch('setAvatarUrl', res);
					self.localAvatarUrl = res;
					console.log(res);
				})
			},
			getBase64Image(src) {
				return new Promise((resolve, reject) => {
					uni.getFileSystemManager().readFile({
						filePath: src,
						encoding: 'base64',
						success: (res) => {
							uni.getImageInfo({
								src: src,
								success: (image) => {
									// 拼接成完整的base64
									resolve(
										`data:image/${image.type};base64,${res.data}`)
								},
								fail: (err) => {
									reject(err)
								}
							});
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.containar {
		width: 100vw;
		background: #fff;
		padding: 0 30rpx;

		.avatarUrl {
			padding: 80rpx 0 40rpx;
			background: #fff;

			button {
				background: #fff;
				line-height: 80rpx;
				height: auto;
				border: none !important;
				width: auto;
				// padding: 20rpx 30rpx;
				margin: 0;
				display: flex;
				border: none;
				justify-content: center;
				align-items: center;

				&::after {
					border: none;
				}

				.refreshIcon {
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
					background-color: #ccc;
				}

				.jt {
					width: 14rpx;
					height: 28rpx;
				}
			}
		}

		.userName {
			background: #fff;
			padding: 20rpx 30rpx 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.weui-input {
				text-align: center;
			}
		}

		.btn-container {
			width: 100vw;
			display: flex;
			justify-content: space-around;
			margin-bottom: 100rpx;

			.btn {
				width: 30vw;
				border: none;
				border-radius: 10px;
				font-weight: bold;
				padding: 0.5rem 1rem;
				text-align: center;
			}

			.btn-cancel {
				background-color: #e4e5e7;
			}

			.btn-login {
				color: #fff;
				background-color: #7cd61e;
			}
		}
	}
</style>