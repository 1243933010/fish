<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="添加好友" :leftIcon="true" />
		</view>
		
		
		<view class="search">
			<input type="text" value="" v-model="phone" />
			<view class="" @click="search"><text>搜索</text></view>
		</view>
		
		<view class="msg" v-if="obj.userid">
			<view class="user">
				<image :src="obj.avatar" mode=""></image>
				<text>{{obj.username}}</text>
			</view>
			<view class="add" @click="add">
				<text>添加好友</text>
			</view>
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components:{headers,popup},
		data() {
			return {
				phone:'',
				obj:{},
				userinfo:{}
			};
		},
		mounted() {
			let userinfo = uni.getStorageSync('userinfo');
			if(userinfo){
				this.userinfo = userinfo;
			}
		},
		methods:{
			async search(){
				if(!this.phone){
					this.$Toast('请输入名字或手机号');
					return false
				}
				let obj = {
					text:this.phone
				}
			let res = await this.$Post('/api/Userfriend/finduser',obj);
			this.$Toast(res.data.msg);
			if(res.data.code===1){
				this.obj = res.data.data;
			}
			console.log(res)
			},//搜索好友
			async add(){
				let obj = {
					token:this.userinfo.token,
					userid:this.obj.userid
				}
				let res = await this.$Post('/api/Userfriend/addfirend',obj);
				this.$Toast(res.data.msg);
				
			},//添加好友
		}
	}
</script>

<style lang="scss" scoped>
.top_hr{
		width: 100%;
		height: 160rpx;
	}
	.search{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		input{
			width: 80%;
			border: 1px solid rgba(0,0,0,0.5);
			border-radius: 10rpx;
			padding: 10rpx 0;
		}
		view{
			width: 15%;
			text-align: center;
			background: #3EC1FF;
			color: white;
			font-size: 30rpx;
			box-sizing: border-box;
			padding: 10rpx 0;
			border-radius: 10rpx;
		}
	}
	.msg{
		width: 95%;
		margin: 30rpx auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.user{
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 32rpx;
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 15rpx;
			}
		}
		.add{
			background: #3EC1FF;
			font-size: 32rpx;
			color: white;
			box-sizing: border-box;
			padding: 10rpx 20rpx;
			border-radius: 10rpx;
		}
	}
</style>
