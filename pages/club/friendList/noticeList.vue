<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="申请列表" :leftIcon="true" />
		</view>
		
		<view class="notice" v-if="list.length>0">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="msg">
					<view class="user">
						<image :src="item.avatar" mode=""></image>
						<text class="name">{{item.username}}</text>
					</view>
					<!-- <view class="label">
						<text>{{item.content}}</text>
					</view> -->
				</view>
				<view class="fn" v-if="item.status==='1'">
					<view class="agree" @click="fnc(item,1)"><text>同意</text></view>
					<view class="no" @click="fnc(item,2)"><text>拒绝</text></view>
				</view>
				<view style="color: #999999;font-size: 26rpx;" v-if="item.status==='2'"><text>已处理</text></view>
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
				userinfo:{},
				list:[],
				offset:1
			};
		},
		onShow() {
			this.offset = 1;
			let userinfo = uni.getStorageSync('userinfo');
			if(userinfo){
				this.userinfo = userinfo;
				// console.log(userinfo)
				this.getList();
			}
		},
		methods:{
			async getList(){
				uni.showLoading({
					mask:true
				})
				let obj = {
					token:this.userinfo.token,
					offset:this.offset,
					limit:20
				}
				let res = await this.$Post('/api/Userfriend/usernotice',obj);
				if(res.data.code===1){
					if(this.offset===1){
						this.list = res.data.data.list;
					}else{
						this.list.push(...res.data.data.list);
					}
				}
				uni.hideLoading();
			},//获取申请列表
			async fnc(item,status){
				let obj = {
					token:this.userinfo.token,
					noticeid:item.id,
					status
				}
				let res = await this.$Post('/api/Userfriend/confmfirend',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.getList();
				}
				
			},//对申请得操作 状态1同意2拒绝
		}
	}
</script>

<style lang="scss" scoped>
.top_hr{
		width: 100%;
		height: 160rpx;
	}
	.notice{
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 20rpx;
		.item{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			.msg{
				display: flex;
				flex-direction: column;
				.user{
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 30rpx;
					margin-bottom: 15rpx;
					.name{
						width: 180rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					image{
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						margin-right: 15rpx;
					}
				}
				.label{
					font-size: 27rpx;
				}
			}
			.fn{
				display: flex;
				flex-direction: column;
				align-items: center;
				view{
					width: 150rpx;
					color: white;
					font-size: 32rpx;
					text-align: center;
					margin: 0 7rpx;
					box-sizing: border-box;
					padding: 5rpx 25rpx;
					border-radius: 8rpx;
					margin-bottom: 15rpx;
					
				}
				.agree{
					background: #52D2F6;
				}
				.no{
					background: #FF0000;
				}
			}
		}
	}
</style>
