<template>
	<view>

		<view class="login">
			<view class='header'>
				<!-- <image src="../../static/logo.png" mode="widthFix"></image> -->
			</view>

			<view class="box">
				<view class='content'>
					<view class="label">
						<text class="label_login">找回密码</text>
						<text class="label_resiger" @click="goLogin">去登录</text>
					</view>
					<view class="inp">
						<!-- <image src="../../static/login/account.png" mode="widthFix"></image> -->
						<input type="number" v-model="mobile" placeholder="请输入您的手机号" />
					</view>
					<view class="inp">
						<!-- <image src="../../static/login/account.png" mode="widthFix"></image> -->
						<input type="password" v-model="newPwd" placeholder="请输入您的新密码" />
					</view>
					<view class="inp get">
						<view class="">
							<!-- <image src="../../static/login/password.png" mode="widthFix"></image> -->
							<input type="number" v-model="code" placeholder="输入您得验证码" />
						</view>
						<view class="yanzhengma" @click="getCode">
							<text>{{codeText}}</text>
						</view>
					</view>
					<!-- <view class="yz" @click="find"><text>找回密码</text></view> -->
				</view>
			</view>

			<button class='bottom' @click="btn" type="primary">确认</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
					mobile: '',
					code: '',
					newPwd:'',
					timeNum:60,
					codeText:'获取验证码'
			};
		},
		onUnload() {
			clearInterval(this.timeOver);
		},
		methods: {
			async btn(){
				let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
				if(!reg.test(this.mobile)){
					this.$Toast('请输入正确手机格式');
					return
				}
				if(!this.newPwd){
					this.$Toast('请输入新密码');
					return
				}
				let obj = {type:'mobile',mobile:this.mobile,newpassword:this.newPwd,captcha:this.code};
				let res = await this.$Post('/api/user/resetpwd',obj);
				this.$Toast(res.data.msg);
			},
			goLogin(){
				uni.navigateBack({
					delta:1
				})
			},//注册页面
			find(){
				
			},//找回密码页面
			async getCode(){
				if(this.codeText!=='获取验证码'){
					return
				}
				let obj = {mobile:this.mobile,event:'resetpwd'};
				let res = await this.$Post('/api/sms/send',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===0){
					return false;
				}
				this.codeText = this.timeNum;
				this.timeOver = setInterval(()=>{
					// console.log(this.timeNum)
					if(this.codeText<=1){
						clearInterval(this.timeOver);
						this.timeNum = 60;
						this.codeText = '获取验证码';
					}else{
						this.codeText--;
					}
				},1000)
			}
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
					font-size: 26rpx;
					color: #9A9A9A;
				}
			}
			.get{
				display: flex;
				justify-content: space-between;
				align-items: center;
				view{
					display: flex;
					flex-direction: row;
					align-items: center;
				}
				.yanzhengma{
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 26rpx;
					width: 150rpx;
					background: #51D1F5;
					border-radius: 10rpx;
					padding: 10rpx 15rpx;
					text{
						margin: 0;
						color: white !important;
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
