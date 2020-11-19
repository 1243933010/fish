<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="状态" :leftIcon="true" />
		</view>
		
		<view class="money">
			<view class="icon">
				<image src="../../../static/me/success.png" mode="widthFix"></image>
				<view class=""><text>申请提现成功</text></view>
				<view class="big"><text>￥{{obj.num}}</text></view>
			</view>
			<view class="type">
				<view class=""><text>提现方式</text></view>
				<view class=""><text>{{obj.type}}</text></view>
			</view>
			<view class="status">
				<uni-steps
				:options="statusList" direction="column" :active="0"></uni-steps>
			</view>
			
			<view class="text">
				<view class="title"><text>到账时间</text></view>
				<view class="con">
					<text>1.支付宝、微信方式提现到账时间2小时内。</text>
					<text>2.银行卡方式提现工作日15:00之前提现，2小时到账15:00之后提现次日到账。</text>
					<text>3.节假日提现顺延。</text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	import uniSteps from '@/components/uni-steps/uni-steps.vue';
	export default {
		components:{headers,popup,uniSteps},
		data() {
			return {
				obj:{},
				statusList:[
					
				]
			};
		},
		onLoad(e) {
			this.obj = uni.getStorageSync('withDrawStatus');
			console.log(this.obj)
			let time1 = new Date().getTime();
			let time2 = time1+720000;
			this.statusList=[
				{title:'提现申请已提交，等待处理',desc:time1},
				{title:'到账时间预计2小时内',desc:time2}
			]
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.money{
		width: 100%;
		padding: 25rpx 0;
		.icon{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			image{
				width: 180rpx;
				margin-bottom: 15rpx;
			}
			view{
				margin-bottom: 15rpx;
				color: #333333;
			}
			.big{
				font-size: 80rpx;
			}
		}
		
		.type{
			width: 100%;
			border-top: 1px solid #F0F0F0;
			border-bottom: 1px solid #F0F0F0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			margin-bottom: 10rpx;
			box-sizing: border-box;
			padding: 25rpx 20rpx;
		}
		.status{
			margin-bottom: 20rpx;
		}
		.text{
			width: 90%;
			margin: 0 auto;
			.title{
				font-size: 26rpx;
				color: #333333;
				margin-bottom: 15rpx;
			}
			.con{
				font-size: 24rpx;
				color: #666666;
				display: flex;
				flex-direction: column;
				text{
					margin-bottom: 15rpx;
				}
			}
		}
	}
</style>
