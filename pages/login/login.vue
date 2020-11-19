<template>
	<view>

		<view class="login">
			<view class='header'>
				<!-- <image src="../../static/logo.png" mode="widthFix"></image> -->
			</view>

			<view class="box">
				<view class='content'>
					<view class="label">
						<text class="label_login">登录</text>
						<text class="label_no">还没有账号？</text>
						<text class="label_resiger" @click="register">去注册</text>
					</view>
					<view class="inp">
						<image src="../../static/login/account.png" mode="widthFix"></image>
						<input type="text" v-model="obj.account" placeholder="请输入您的用户名或者手机号" />
					</view>
					<view class="inp">
						<image src="../../static/login/password.png" mode="widthFix"></image>
						<input type="password" v-model="obj.password" placeholder="输入您的密码" />
					</view>
					<view class="yz" @click="find"><text>找回密码</text></view>
				</view>
			</view>

			<button class='bottom' @click="login" type="primary">登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				obj: {
					account: '',
					password: ''
				}
			};
		},
		methods: {
			async login() {
				
				if(!this.obj.account){
					this.$Toast('请输入手机号或用户名');
					return
				}
				if(!this.obj.password){
					this.$Toast('请输入密码');
					return
				}
				// #ifdef APP-PLUS
				this.obj.gtpushid = getApp().globalData.clientid;
				console.log(getApp().globalData.clientid)
				// #endif
				let res = await this.$login('/api/user/login', this.obj);
				console.log(this.obj)
				console.log(res)
				this.$Toast(res.data.msg);
				if (res.data.code === 1) {
					uni.setStorageSync('userinfo', res.data.data.userinfo);
					// console.log(res.data.data.userinfo)
					setTimeout(() => {
						uni.switchTab({
							url: '../index/index'
						})
					}, 500)
				}
			},
			register(){
				uni.navigateTo({
					url:'./register'
				})
			},//注册页面
			find(){
				uni.navigateTo({
					url:'./findPwd'
				})
			},//找回密码页面
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F4F5FA;
	}
	.set{
		width: 80%;
		margin:  0rpx auto;
		font-size: 30rpx;
	}
	.login {
		width: 100%;
		height: 100%;
		background: #fff;

		.header {
			text-align: center;
			width: 750rpx;
			height: 450rpx;
			background: url(../../static/login/login_banner.png) no-repeat;
			background-size: 100% 100%;
		}
		.content {
			width: 90%;
			margin: 0 auto;
			background: white;
			border-radius: 15rpx;	
            box-shadow: 0px 0px 23px 3px rgba(0, 0, 0, 0.03);
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			padding: 40rpx 0;
			.label{
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 90%;
				margin-bottom: 40rpx;
				.label_login{
					font-size: 48rpx;
					color: #3E4A59;
					margin-right: 25rpx;
				}
				.label_no{
					font-size: 26rpx;
					color: #343434;
					margin-right: 25rpx;
				}
				.label_resiger{
					font-size: 26rpx;
					color: #6AD0FF;
				}
			}
			.inp{
				width: 90%;
				margin: 30rpx auto;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1px solid #D3DFEF;
				padding: 20rpx 0;
				image{
					width: 35rpx;
					margin-right: 25rpx;
				}
				input{
					width: 60%;
					font-size: 26rpx;
					color: #9A9A9A;
				}
			}
			.yz{
				font-size: 26rpx;
				padding-top: 150rpx;
				padding-bottom: 40rpx;
				text{
					color: #6AD0FF;
				}
			}
		}

		.content text {
			display: block;
			color: #9d9d9d;
			margin-top: 40rpx;
		}

		.bottom {
			border-radius: 80rpx;
			margin: -40rpx 150rpx 0 150rpx;
			font-size: 30rpx;
			background: #6AD0FF;
			
		}
	}
	.box{
		margin-top: -50rpx;
	}
</style>
