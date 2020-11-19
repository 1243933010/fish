<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="设置" :leftIcon="true" />
		</view>

		<view class="inp" @click="editUserInfo">
			<text>修改个人信息</text>
			<image src="../../static/me/next.png" mode="widthFix"></image>
		</view>
		<!-- <view class="inp">
			<text>修改邮箱</text>
			<image src="../../static/me/next.png" mode="widthFix"></image>
		</view> -->
		<view class="inp" @click="editMobile">
			<text>修改手机号</text>
			<image src="../../static/me/next.png" mode="widthFix"></image>
		</view>
		<view class="inp" @click="editPwd">
			<text>重置密码</text>
			<image src="../../static/me/next.png" mode="widthFix"></image>
		</view>
		<view class="inp" @click="editFishPwd">
			<text>修改鱼票交易密码</text>
			<image src="../../static/me/next.png" mode="widthFix"></image>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="inp">
			<text>当前版本</text>
			<text>{{version}}</text>
		</view>
		<!-- #endif -->
		<view class="inp" @click="layout">
		<text>退出</text>
		<image src="../../static/me/next.png" mode="widthFix"></image>
		</view>
		<!-- 修改鱼票交易密码内容 -->
		<uni-popup type="center" ref="popup">
			<view class="edit_fish_pwd">
				<view class="close">
					<image @click="popupClose" src="../../static/me/guanbi.png" mode="widthFix"></image>
				</view>
				<view class="title">
					<text>修改鱼票交易密码</text>
				</view>
				<view class="inp">
					<input class="inp_inp" type="number" placeholder="请输入手机号" v-model="fishMobile" />
				</view>
				<view class="inp">
					<view class="code">
						<input type="number" value="" v-model="fishCode" />
						<text @click="setFishCode">{{fishText}}</text>
					</view>
				</view>
				<view class="inp">
					<input type="password" class="inp_inp" placeholder="请输入新的交易密码" v-model="fishPwd" />
				</view>
				<view class="btn" @click="edit_fish_pwd">
					<text>确定</text>
				</view>
			</view>
		</uni-popup>
		
		<!-- 修改手机号 -->
		<uni-popup type="center" ref="mobile">
			<view class="edit_fish_pwd">
				<view class="close" @click="mobileClose">
					<image src="../../static/me/guanbi.png" mode="widthFix"></image>
				</view>
				<view class="title">
					<text>修改手机号</text>
				</view>
				<view class="inp">
					<input type="number" class="inp_inp"  v-model="mobileMobile" placeholder="请输入新得手机号"/>
				</view>
				<view class="inp">
					<view class="code">
						<input  type="number" value="" v-model="mobileCode" />
						<text @click="setMobileCode">{{mobileText}}</text>
					</view>
				</view>
				<view class="btn" @click="edit_mobile_pwd">
					<text>确定</text>
				</view>
			</view>
		</uni-popup>
		
		<!-- 修改密码 -->
		<uni-popup type="center" ref="pwd">
			<view class="edit_fish_pwd">
				<view class="close">
					<image @click="pwdClose" src="../../static/me/guanbi.png" mode="widthFix"></image>
				</view>
				<view class="title">
					<text>修改密码</text>
				</view>
				<view class="inp">
					<input class="inp_inp" type="number"  v-model="pwdMobile" placeholder="请输入手机号" />
				</view>
				<view class="inp">
					<input class="inp_inp" type="password" placeholder="请输入新密码" v-model="newPwd" />
				</view>
				<view class="inp">
					<view class="code">
						<input type="number" value="" v-model="pwdCode" />
						<text @click="setPwdCode">{{pwdText}}</text>
					</view>
				</view>
				<view class="btn" @click="edit_pwd_pwd">
					<text>确定</text>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import popup from '@/components/uni-popup/uni-popup.vue';
	import headers from '@/components/header.vue';
	export default {
		components:{popup,headers},
		data() {
			return {
				token:'',
				fishMobile:'',
				fishCode:'',
				fishPwd:'',
				version:'',
				fishText:'发送验证码',
				fishTime:60,
				mobileMobile:'',
				mobileCode:'',
				mobileText:'发送验证码',
				mobileTime:60,
				pwdText:'发送验证码',
				pwdTime:60,
				pwdMobile:'',
				pwdCode:'',
				pwdText:'发送验证码',
				newPwd:''
			};
		},
		mounted() {
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				this.version = widgetInfo.version;
				console.log(widgetInfo.version)
			})
			// #endif
		},
		onLoad() {
			this.fishOver = null;
			this.mobileOver = null;
			this.pwdOver = null;
		},
		onUnload() {
			this.fishOver = null;
			this.mobileOver = null;
			this.pwdOver = null;
		},
		methods:{
			mobileClose(){
				this.$refs.mobile.close();
			},//关闭弹窗
			pwdClose(){
				this.$refs.pwd.close();
			},//关闭弹窗
			popupClose(){
				this.$refs.popup.close();	
			},//关闭弹窗
			async edit_pwd_pwd(){
				if(this.pwdMobile.length!==11){
					this.$Toast('请输入正确的手机格式');
					return
				}
				if(!this.newPwd){
					this.$Toast('请输入新密码');
					return
				}
				if(!this.pwdCode){
					this.$Toast('请输入验证码');
					return
				}
				let obj = {
					type:'mobile',
					mobile:this.pwdMobile,
					newpassword:this.newPwd,
					captcha:this.pwdCode
				}
				let res = await this.$Post('/api/user/resetpwd',obj);
				if(res.data.code===1){
					this.$refs.pwd.close();
					this.$Toast(res.data.msg);
				}
			},//确定修改密码
			editPwd(){
				clearInterval(this.pwdOver)
				this.pwdOver=null;
				this.pwdText = '发送验证码';
				this.pwdTime = 60;
				this.pwdMobile = '';
				this.newPwd = '';
				this.pwdCode = '';
				this.$refs.pwd.open();
			},//弹出修改密码
			async setPwdCode(){
				if(this.pwdMobile.length!==11){
					this.$Toast('请输入正确的手机格式');
					return
				}
				if(!this.newPwd){
					this.$Toast('请输入新密码');
					return
				}
				if(this.pwdText!=='发送验证码'){
					return
				}
				let obj = {mobile:this.pwdMobile,event:'resetpwd'};
				let res = await this.$Post('/api/sms/send',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===0){
					return false;
				}
				this.pwdText = this.pwdTime;
				this.pwdOver = setInterval(()=>{
					if(this.pwdText<=1){
						clearInterval(this.pwdOver)
						this.pwdText = '发送验证码';
						this.pwdTime = 60;
					}else{
					    this.pwdText--;	
					}
				},1000)
			},//发送修改密码验证码
			 editMobile(){
				 this.mobileMobile = '';
				 clearInterval(this.mobileOver);
				 this.mobileText = '发送验证码';
				 this.mobileTime = 60;
				 this.mobileCode = '';
				this.$refs.mobile.open();
			},//弹出修改手机
			async setMobileCode(){
				if(this.mobileMobile.length!==11){
					this.$Toast('请输入正确的手机格式');
					return
				}
				if(this.mobileText!=='发送验证码'){
					return
				}
				let obj = {mobile:this.mobileMobile,event:'changemobile'};
				let res = await this.$Post('/api/sms/send',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===0){
					return false;
				}
				this.mobileText = this.mobileTime;
				
				this.mobileOver = setInterval(()=>{
					if(this.mobileText<=1){
						clearInterval(this.mobileOver);
						this.mobileText = '发送验证码';
						this.mobileTime = 60;
					}else{
					    this.mobileText--;	
					}
				},1000)
			},//发送修改手机号验证码
			async edit_mobile_pwd(){
				if(this.mobileMobile.length!==11){
					this.$Toast('请输入正确的手机格式');
					return
				}
				if(!this.mobileCode){
					this.$Toast('请输入验证码');
					return
				}
				let obj = {
					token:this.token,
					mobile:this.mobileMobile,
					captcha:this.mobileCode
				}
				let res = await this.$Post('/api/user/changemobile',obj);
				if(res.data.code===1){
					this.$Toast('修改手机号成功');
					this.$refs.mobile.close();
				}
			},//确定修改手机号验证码
			async setFishCode(){
				if(this.fishMobile.length!==11){
					this.$Toast('请输入正确的手机格式');
					return
				}
				if(this.fishText!=='发送验证码'){
					return
				}
				let obj = {mobile:this.fishMobile,event:'changeticketpwd'};
				let res = await this.$Post('/api/sms/send',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===0){
					return false;
				}
				this.fishText = this.fishTime;
				this.fishOver = setInterval(()=>{
					if(this.fishText<=1){
						clearInterval(this.fishOver);
						this.fishText = '发送验证码';
						this.fishTime = 60;
					}else{
					    this.fishText--;	
					}
				},1000)
			},//发送鱼票验证码
			async layout(){
				let res = await this.$Post('/api/user/logout',{token:this.token});
				// this.$Toast(res.data.msg);
				if(res.data.code===1){
					if(getApp().globalData.socketTask){
						getApp().globalData.socketTask.close({code:1000})
					}
					uni.clearStorageSync();
					// getApp().globalData.socketTask.close();
					// getApp().globalData.socketTask=null;
					uni.reLaunch({
						url:'../login/login'
					})
				}else{
					this.$Toast(res.data.msg);
				}
				
			},//退出
			editUserInfo(){
				uni.navigateTo({
					url:'./editUserInfo'
				})
			},//修改个人信息
			editFishPwd(){
				
				this.$refs.popup.open();
			},//打开修改鱼票密码弹窗
			async edit_fish_pwd(){
				if(this.fishMobile.length!==11){
					this.$Toast('请输入正确的手机格式');
					return
				}
				if(!this.fishCode){
					this.$Toast('请输入验证码');
					return
				}
				if(!this.fishPwd){
					this.$Toast('请输入新的交易密码');
					return
				}
				let {token} = uni.getStorageSync('userinfo');
				let obj = {
					token,
					mobile:this.fishMobile,
					captcha:this.fishCode,
					ticket_pwd:this.fishPwd
				}
				let res = await this.$Post('/api/user/changeticketpwd',obj);
				this.$Toast(res.data.msg);
				console.log(res);
				if(res.data.code===1){
					this.fishMobile = '';
					this.fishCode = '';
					this.fishPwd='';
					this.$refs.popup.close();
				}
			},//调取修改鱼票密码接口
		}
	}
</script>

<style lang="scss" scoped>
	.edit_fish_pwd{
		width: 700rpx;
		background: white;
		box-sizing: border-box;
		padding: 40rpx 15rpx;
		border-radius: 15rpx;
		.close{
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			// margin-bottom: 15rpx;
			image{
				width: 30rpx;
				margin-right: 15rpx;
			}
		}
		.title{
			font-size: 30rpx;
			color: #333333;
			display: flex;
			justify-content: center;
			align-items: center;
			// border-bottom: 1px solid #CBCBCB;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
		}
		.inp{
			input{
				// border-bottom: 1px solid #7FD6FF;
			}
			.inp_inp{
				width: 100%;
				border: 1px solid #B9B9B9;
				padding: 15rpx 0;
				text-indent: 15rpx;
				border-radius: 10rpx;
				font-size: 26rpx;
			}
			.code{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				input{
					width: 45%;
					border: 1px solid #B9B9B9;
					padding: 15rpx 0;
					text-indent: 15rpx; 
					border-radius: 10rpx;
				}
				text{
					width: 45%;
					background: #51D1F5;
					border-radius: 10rpx;
					color: white;
					font-size: 26rpx;
					text-align: center;
					height: 70rpx;
					line-height: 70rpx;
				}
			}
		}
		.btn{
			width: 80%;
			margin: 20rpx auto;
			background: #51D1F5;
			text-align: center;
			color: white;
			font-size: 26rpx;
			padding: 20rpx 0;
			border-radius: 10rpx;
		}
	}
	.inp{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 95%;
		margin: 20rpx auto;
		// border-bottom: 1px solid #F0F0F0;
		padding: 15rpx 0;
		font-size: 26rpx;
		image{
			width: 18rpx;
		}
	}
</style>
