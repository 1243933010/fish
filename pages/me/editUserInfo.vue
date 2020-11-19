<template>
	<view>
		<view class="top_hr" style="padding-bottom: 0;"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="修改个人信息" :leftIcon="true" />
		</view>
		<view class="box">
			<view class="icon">
				<text>头像</text>
				<image @click="chooseImage" :src="userinfo.avatar" mode=""></image>
			</view>
			<view class="name" @click="open">
				<text>用户名：</text>
				<view class="">
					<text>{{username}}</text>
					<image src="../../static/me/next.png" mode="widthFix"></image>
				</view>
				<!-- <input type="text" v-model="username" /> -->
			</view>
			<!-- <input type="text" v-model="nickname" /> -->
			<!-- <view class="" @click="btn">确定</view> -->
		</view>
		
		
		<uni-popup type="center" ref="popup">
			 <view class="pox">
			 	<view class="close">
			 		<image @click="close" src="../../static/me/guanbi.png" mode="widthFix"></image>
			 	</view>
				<view class="title">
					<text>用户名编辑</text>
				</view>
				<view class="inp">
					<input type="text" v-model="username" />
				</view>
				<view class="btn" @click="btn">确定</view>
			 </view>
		</uni-popup>
		
		 <!-- <image class="image" :src="path"></image> -->
		        <kps-image-cutter @ok="onok" @cancel="oncancle" :url="url" :fixed="true" :width="100" :height="100"></kps-image-cutter>
	</view>
</template>

<script>
	import popup from '@/components/uni-popup/uni-popup.vue';
	import headers from '@/components/header.vue';
	import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
	export default {
		components:{popup,headers,kpsImageCutter},
		data() {
			return {
				userinfo:{},
				username:'',
				imgUrl:"",
				 url: "",
				 path: ""
			};
		},
		onShow() {
			this.userinfo = uni.getStorageSync('userinfo');
			this.getUserInfo();
		},
		methods:{
			async rightClick(){
				let obj = {
					avatar:this.imgUrl,
					username:this.username,
					nickname:this.username,
					bio:''
				};
				let res = await this.$Post('/api/user/profile',obj);
				if(res.data.code===1){
					this.$Toast('修改成功');
					this.$refs.popup.close();
				}else{
					this.$Toast(res.data.msg);
				}
			},
			async getUserInfo(){
				let obj = {token:this.userinfo.token};
				let res = await this.$Get('/api/user/Getuserinfo',obj);
				if(res.data.code===1){
					this.userinfo.avatar = res.data.data.avatar;
					this.userinfo.username = res.data.data.username;
					this.username = res.data.data.username;
					let str = this.userinfo.avatar.indexOf('/uploads');
					this.imgUrl = this.userinfo.avatar.substring(str,this.userinfo.avatar.length)
				}
				console.log(this.userinfo);
			},//获取个人信息
			open(){
				this.$refs.popup.open();
			},//打开设置名字弹窗
			close(){
				this.$refs.popup.close();
			},//关闭设置名字弹窗
			chooseImage(){
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: (res)=> {
						console.log(res)
						this.url = res.tempFilePaths[0];
						        let tempFilePaths = res.tempFilePaths[0];
								
								// uni.uploadFile({
								//     url: 'http://47.95.39.75:9706/api/common/upload', //仅为示例，非真实的接口地址
								//     filePath: tempFilePaths,
								//     name: 'file',
								//     formData: {
								//         'token': this.userinfo.token
								//     },
								//     success: (uploadFileRes) => {
								// 		console.log(uploadFileRes)
								// 		let data = JSON.parse(uploadFileRes.data);
								// 		console.log(data)
								// 		this.$Toast(data.msg);
								// 		if(data.code===1){
								// 			this.userinfo.avatar = `http://47.95.39.75:9706${data.data.url}`;
								// 			this.imgUrl = data.data.url;
								// 			this.rightClick();
								// 		}
								//         console.log(data.data);
								//     }
								// });
						        
						
				        // console.log(JSON.stringify(res.tempFilePaths[0]));
				    }
				});
			},
			 onok(ev) {
			                this.path = ev.path;
			                this.url = "";
							console.log(ev.path)
							uni.uploadFile({
							    url: 'http://47.95.39.75:9706/api/common/upload', //仅为示例，非真实的接口地址
							    filePath: ev.path,
							    name: 'file',
							    formData: {
							        'token': this.userinfo.token
							    },
							    success: (uploadFileRes) => {
									console.log(uploadFileRes)
									let data = JSON.parse(uploadFileRes.data);
									console.log(data)
									this.$Toast(data.msg);
									if(data.code===1){
										this.userinfo.avatar = `http://47.95.39.75:9706${data.data.url}`;
										this.imgUrl = data.data.url;
										this.rightClick();
									}
							        console.log(data.data);
							    }
							});
			            },
			            oncancle() {
			                // url设置为空，隐藏控件
			                this.url = "";
			            },
			async btn(){
				if(this.username.length>=20){
					this.$Toast('请输入20以内的名字');
					return
				}
				let obj = {
					avatar:this.imgUrl,
					username:this.username,
					nickname:this.username,
					bio:''
				};
				let res = await this.$Post('/api/user/profile',obj);
				if(res.data.code===1){
				
					let userinfo = uni.getStorageSync('userinfo');
					userinfo.nickname = this.username;
					userinfo.username = this.username;
					uni.setStorageSync('userinfo',userinfo)
					this.$Toast('修改成功');
					this.$refs.popup.close();
				}else{
					this.$Toast(res.data.msg);
				}
				// this.$refs.popup.close();
				// console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image {
	    width: 200px;
	    height: 200px;
	}
	.pox{
		width: 700rpx;
		background: white;
		border-radius: 15rpx;
		padding: 40rpx 0;
		.close{
			width: 100%;
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			image{
				width: 30rpx;
				margin-right: 25rpx;
			}
		}
		.title{
			width: 90%;
			margin: 20rpx auto;
			text-align: center;
			color: #333333;
			font-size: 30rpx;
			border-bottom: 1px solid #f0f0f0;
			margin-bottom: 15rpx;
			padding: 15rpx 0;
		}
		.inp{
			width: 95%;
			border: 1px solid #333333;
			border-radius: 10rpx;
			padding: 20rpx 0;
			margin: 50rpx auto;
			input{
				font-size: 26rpx;
				text-indent: 15rpx;
			}
		}
		.btn{
			width: 60%;
			margin: 0 auto;
			background: #52D2F6;
			border-radius: 8rpx;
			color: white;
			text-align: center;
			font-size: 26rpx;
			padding: 15rpx 0;
		}
	}
	.box{
		box-sizing: border-box;
		padding: 30rpx 20rpx;
		image{
			width: 130rpx;
			border-radius: 50%;
		}
		.icon{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F0F0F0;
			padding: 15rpx 0;
			image{
				width: 100rpx;
				height: 100rpx;
			}
		}
		.name{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F0F0F0;
			padding: 25rpx 0;
			view{
				display: flex;
				flex-direction: row;
				align-items: center;
				image{
					width: 23rpx;
					margin-left: 15rpx;
				}
			}
		}
	}
</style>
