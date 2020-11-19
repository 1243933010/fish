<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="鱼票订单详情" :leftIcon="true" />
		</view>
		
		
		
		<view class="detail">
			<view class="top">
				<text>{{Obj.ticket_name}}</text>
				<view class="">
					<text>状态:
					<text v-if="Obj.ticket_status==='0'">无效</text>
					<text v-if="Obj.ticket_status==='1'">待支付</text>
					<text v-if="Obj.ticket_status==='2'">已支付</text>
					<text v-if="Obj.ticket_status==='3'">正在使用</text>
					<text v-if="Obj.ticket_status==='4'">已使用</text>
					<text v-if="Obj.ticket_status==='5'">已删除</text>
					</text>
				</view>
			</view>
			
			<view class="time" v-if="Obj.ticket_status==='3'"><text><text class="title">鱼票开始使用时间</text> :{{Obj.use_starttime}}</text></view>
			<view class="time" v-if="Obj.ticket_status==='3'"><text><text class="title">鱼票过期时间</text>:{{Obj.use_expiredtime}}</text></view>
			<view class="time">
				<text><text class="title">生成时间</text>:{{Obj.create_time}}</text>
				<view class="">
					<text><text class="title">有效时长</text>:
				    <text>{{Obj.ticket_times}}小时</text>
				  </text>
				</view>
			</view>
			<view class="peoplel">
				<!-- <text><text class="title">比赛人数</text>:{{Obj.pt_number}}人</text> -->
				<text><text class="title">原价</text>:{{Obj.bef_price}}</text>
			</view>
			<view class="time">
				<text><text class="title">单号</text>:{{Obj.ordersn}}</text>
				<!-- <text v-if="Obj.deduction_price*1===0"><text class="title">支付时间</text>:{{Obj.paytime}}</text> -->
			</view>
			<view class="time">
				<text><text class="title">折扣鱼票金额</text>:{{Obj.deduction_price}}</text>
				<text><text class="title">折扣后鱼票价格</text>:{{Obj.ticket_price}}</text>
			</view>
			<view class="content"><text><text class="title">活动内容</text>:{{Obj.ticket_intro}}</text></view>
			<view class="start" @click.stop="start(Obj)" v-if="Obj.ticket_status==='2'">
				<text class="jishi">开始计时</text>
			</view>
			
		<view class="time" v-if="Obj.ticket_status==='3'">
		<view style="display: flex;flex-direction: row;align-items: center;">
			<text>剩余时间:</text>
			<uni-countdown :show-day="false" :hour="hour" :minute="minute" :second="10"></uni-countdown>
		</view>
		</view>
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	import wPicker from "@/components/w-picker/w-picker.vue";
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
	export default {
		components:{headers,popup,wPicker,uniCountdown},
		data() {
			return {
				token:'',
				id:'',
				Obj:{},
				hour:0,
				minute:0,
				second:0
			};
		},
		onLoad(e) {
			console.log(e.orderId)
			this.id = e.orderId;
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			this.getMsg();
		},
		methods:{
			async getMsg(){
				let obj = {token:this.token,id:this.id};
				let res = await this.$Post('/api/Groundticket/StoreTicketinfo',obj);
				if(res.data.code===1){
					this.Obj = res.data.data;
					if(res.data.data.ticket_status==='3'){
						let start = new Date().getTime();
						let end = new Date(res.data.data.use_expiredtime).getTime();
						let time = end-start;
						this.toHHmmss(time);
						console.log(end-start);
					}
				}
				console.log(res);
			},
			toHHmmss(data) {
					if(data){
						let hour = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						let minute = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
						let second = ((data % (1000 * 60)) / 1000).toFixed(0)*1;
						console.log(hour,minute,second)
						this.hour = hour;
						this.minute = minute;
						this.second = second;
					}
			},
			async start(item){
				let obj = {token:this.token,id:item.id};
				let res = await this.$Post('/api/Groundticket/ConfirmStoreTicket',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					setTimeout(()=>{
						let obj1 = {token:this.token,id:this.id};
						this.getMsg(obj1);
					},500)
				}
				console.log(item)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.start{
		margin-top: 20rpx;
		text{
			background: #39BFFF;
			font-size: 26rpx;
			color: white;
			box-sizing: border-box;
			padding: 10rpx 40rpx;
			border-radius: 6rpx;
		}
	}
	.detail{
		background: #F5FAFC;
		width: 95%;
		margin: 20rpx auto;
		border-radius: 15rpx;
		box-sizing: border-box;
		padding: 20rpx;
		view{
			font-size: 26rpx;
			color: #333333;
			
		}
		.title{
			font-weight: 600;
		}
		.top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: 600;
			font-size: 26rpx;
			color: #333333;
			margin-bottom: 15rpx;
		}
		.peoplel{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 15rpx;
		}
		.time{
			margin-bottom: 15rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.content{
			margin-bottom: 15rpx;
		}
		.fn{
			display: flex;
			justify-content: space-between;
			align-items: center;
			// margin-top: 15rpx;
			view{
				width: 150rpx;
				background: #3BC0FF;
				align-items: center;
				font-size: 26rpx;
				color: white;
				padding: 10rpx 0;
				text-align: center;
				border-radius: 10rpx;
			}
		}
	}
</style>
