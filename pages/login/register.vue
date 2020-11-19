<template>
	<view>
		<!-- <view class="login">
			<view class='header'>
				<image src="../../static/logo.png" mode="widthFix"></image>
			</view>

			<view class='content'>
				<input type="text" v-model="obj.username" placeholder="请输入您的用户名" />
				<input type="password" v-model="obj.password" placeholder="输入密码" />
				<view class="email">
					<input type="text" v-model="obj.email" placeholder="输入邮箱" />
					<view class="" @click="getCode"><text>{{text}}</text></view>
				</view>
				<input type="text" v-model="obj.mobile" placeholder="输入手机号" />
				<input type="text" v-model="obj.code" placeholder="输入验证码" />
			</view>

			<button class='bottom' @click="register" type="primary">注册</button>
		</view> -->
<view class="login">
			<view class='header'>
				<!-- <image src="../../static/logo.png" mode="widthFix"></image> -->
			</view>

			<view class="box">
				<view class='content'>
					<view class="label">
						<text class="label_login">注册</text>
						<text class="label_no">已有账号？</text>
						<text class="label_resiger" @click="login">去登录</text>
					</view>
					<view class="inp">
						<image src="../../static/login/account.png" mode="widthFix"></image>
						<input type="text" v-model="obj.username" placeholder="请输入您的用户名" />
					</view>
					<view class="inp">
						<image src="../../static/login/password.png" mode="widthFix"></image>
						<input type="password" v-model="obj.password" placeholder="输入您得密码" />
					</view>
				<!-- 	<view class="inp">
						<image src="../../static/login/password.png" mode="widthFix"></image>
						<input type="text" v-model="obj.email" placeholder="输入您得邮箱" />
					</view> -->
					<view class="inp">
						<image src="../../static/login/phone.png" mode="widthFix"></image>
						<input type="text" v-model="obj.mobile" placeholder="输入您得手机号" />
					</view>
					<view class="code">
						<view class="icon">
							<image src="../../static/login/code.png" mode="widthFix"></image>
							<input type="text" value=""  v-model="obj.code"/>
						</view>
						<view class="get" @click="getCode">
							<text>{{text}}</text>
						</view>
					</view>
					<!-- <view class="yz"><text>验证码登录</text></view> -->
				</view>
			</view>

			<button class='bottom' @click="register" type="primary">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				obj: {
					username: '',
					password: '',
					email: '',
					mobile: '',
					code: ''
				},
				timer: null,
				text: '获取验证码',
				status: false,
				num: 60
			};
		},
		onUnload: function() {
			this.timer && this.clearTimer();
		},
		methods: {
			async register() {
				if(!this.obj.username){
					this.$Toast('请输入用户名');
					return
				}
				
				if(this.obj.username.length>=20){
					this.$Toast('请输入20以内的名字');
					return
				}
				if(!this.obj.password){
					this.$Toast('请输入密码');
					return
				}
				let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
				if(!reg.test(this.obj.mobile)){
					this.$Toast('请输入正确手机格式');
					return
				}
				
				
				
				let res = await this.$login('/api/user/register', this.obj);
				this.$Toast(res.data.msg);
				if (res.data.code === 1) {
					uni.setStorageSync('userinfo', res.data.data.userinfo);
					uni.hideTabBarRedDot({
						 index: 2
					})
					setTimeout(() => {
						uni.switchTab({
							url: '../index/index'
						})
					}, 500)
				}
				console.log(res)
			},
			async getCode() {
				if (this.status) {
					return
				}
				let obj = {mobile:this.obj.mobile,event:'register'};
				let res = await this.$login('/api/sms/send',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===0){
					return;
				}
				this.status = true;
				this.loading();
				
				this.timer = setInterval(() => {
					if (this.num === 0) {
						this.timer && this.clearTimer();
						this.reset();
					} else {
						this.loading();
						
					}
				}, 1000);
			},
			reset() {
				this.num = 60;
				this.loadingStatus = false;
				this.status = false;
				this.text = '获取验证码';
			},
			loading() {
				this.num -= 1;
				this.status = true;
				this.text = '获取中(' + this.num + ')';
			},
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			},
			login(){
				uni.navigateBack({
					delta:1
				})
			},
			// async sendCode(){
			// 	let obj = {mobile:this.obj.mobile,event:'register'};
			// 	let res = await this.$login('/api/sms/send',obj);
			// 	this.$Toast(res.data.msg);
			// 	console.log(res)
			// },
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
			padding: 60rpx 0;
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
					width: 80%;
					font-size: 26rpx;
					color: #9A9A9A;
				}
			}
			.code{
				width: 90%;
				margin: 30rpx auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #D3DFEF;
				padding: 20rpx 0;
				.icon{
					width: 60%;
					display: flex;
					flex-direction: row;
					align-items: center;
					image{
						width: 45rpx;
						margin-right: 25rpx;
					}
				}
				.get{
					width: 40%;
					text-align: center;
					background: #898989;
					// opacity: 0.35;
					border-radius: 10px;
					padding: 15rpx 0;
					text{
						margin: 0;
						color: white;
						font-size: 30rpx;
					}
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
