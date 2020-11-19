<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="在线列表" :leftIcon="true" />
		</view>
		
		
		<view class="box">
			<view class="item" v-for="(item,index) in list" :key="index" @click="goTo(item)">
				<view class="user_icon">
					<image :src="item.avatar" mode=""></image>
					<text class="username">{{item.client_name}}</text>
				</view>
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
				list:[]
			};
		},
		
		mounted() {
			let arr = [];
			let obj = getApp().globalData.onlineList;
			for (let s in obj) {
				arr.push(obj[s])
			}
			this.list = arr;
			// console.log(arr)
			// console.log(getApp().globalData.onlineList)
		},
		methods:{
			goTo(item){
				uni.navigateTo({
					url:`./userPage?userid=${item.userid}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.top_hr{
		width: 100%;
		height: 160rpx;
	}
	.box{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 25rpx;
			.user_icon{
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 28rpx;
				image{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
				.username{
					width: 450rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
</style>
