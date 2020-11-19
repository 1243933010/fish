<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="支付" :leftIcon="true" />
		</view>
		
		<view class="pay">
			<view class="title">
				<text>支付方式</text>
			</view>
			<view class="item" v-for="(item,index) in payList" :key="index" @click="Switch(index)">
				<view class="icon">
					<image :src="item.icon" mode="widthFix"></image>
					<text>{{item.title}}</text>
				</view>
				<view v-show="ind!==index" class="radio"></view>
				<image  v-show="ind===index" src="../../static/pay/select.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="btn">
			<text>确认支付</text>
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	export default {
		components:{headers},
		data() {
			return {
				payList:[
					{title:'微信支付',type:'',icon:'../../static/pay/alipay.png'},
					{title:'支付宝支付',type:'',icon:'../../static/pay/wecat.png'}
				],
				ind:0
			};
		},
		methods:{
			Switch(index){
				this.ind = index;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pay{
		width: 100%;
		box-sizing: border-box;
		padding: 0 15rpx;
		margin-bottom: 300rpx;
		.title{
			text-align: left;
			font-size: 32rpx;
			margin-bottom: 30rpx;
		}
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			.icon{
				display: flex;
				flex-direction: row;
				align-items: center;
				image{
					width: 60rpx;
					margin-right: 10rpx;
				}
			}
			image{
				width: 45rpx;
			}
			.radio{
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				border: 1px solid #333333;
			}
		}
	}
	.btn{
		width: 80%;
		border-radius: 10rpx;
		margin: 0 auto;
		background: red;
		color: white;
		font-size: 30rpx;
		text-align: center;
		padding: 15rpx 0;
	}
</style>
