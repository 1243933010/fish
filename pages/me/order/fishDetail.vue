<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="鱼票订单详情" :leftIcon="true" />
		</view>
		
		<view class="detail">
			<view class="time"><text><text class="title">单号</text> :{{Obj.ordersn}}</text></view>
			<view class="top">
				<text>鱼票名称:{{Obj.ticket_name}}</text>
				<view class="">
					<text>状态:
					<!-- ticket_status string 状态0:无效,1:已支付,2=待支付,3=正在使用,4=已使用,5=已删除  -->
					<text v-if="Obj.ticket_status==='0'">无效</text>
					<text v-if="Obj.ticket_status==='1'">待支付</text>
					<text v-if="Obj.ticket_status==='2'">已支付</text>
					<text v-if="Obj.ticket_status==='3'">正在使用</text>
					<text v-if="Obj.ticket_status==='4'">已使用</text>
					<text v-if="Obj.ticket_status==='5'">无效</text>
					</text>
				</view>
			</view>
			
			<view class="time"><text><text class="title">鱼票时长</text> :{{Obj.ticket_times}}小时</text></view>
			
			<view class="time">
				<text><text class="title">费用</text>:{{Obj.ticket_price}}</text>
				<text><text class="title">所属渔场</text>:{{Obj.ground_name}}</text>
			</view>
			<view class="time" v-if="Obj.ticket_status==='3'">
				<text class="" >鱼票过期时间：<text>{{Obj.use_expiredtime}}</text></text>
			</view>
			<view class="time" v-if="Obj.ticket_status==='3'">
				<text class="">鱼票开始使用时间：<text>{{Obj.use_starttime}}</text></text>
			</view>
			<view class="time" >
				<text class="">鱼票原价格：<text>{{Obj.bef_price}}</text></text>
			</view>
			<view class="time" >
				<text class="">	折扣鱼票金额：<text>{{Obj.deduction_price}}</text></text>
			</view>
			<view class="time" >
				<text class="">	订单生成时间：<text>{{Obj.create_time}}</text></text>
			</view>
			<view class="time" v-if="Obj.paytotal_fee!=='0'">
				<text class="">实际支付金额：<text>{{Obj.paytotal_fee}}</text></text>
			</view>
			<view class="time" v-if="Obj.paytotal_fee!=='0'">
				<text class="">交易流水号：<text>{{Obj.paytransaction}}</text></text>
			</view>
			<view class="time" v-if="Obj.paytotal_fee!=='0'">
				<text class="">支付时间：<text>{{Obj.paytime}}</text></text>
			</view>
			<view class="content"><text><text class="title">活动内容</text>:{{Obj.ticket_intro}}</text></view>
			<view class="countdown" v-if="Obj.ticket_status==='1'">
				<text>待支付过期时间:</text>
				<uni-countdown  background-color="#39BFFF" color="#FFFFFF" :show-day="false" :hour="hour" :minute="minute" :second="second"></uni-countdown>
			</view>
			<view style="display: flex;justify-content: space-between;align-items: center;">
				<view class="pay" @click="pay" v-if="Obj.ticket_status==='1'"><text>支付</text></view>
				<view class="pay" @click="Cancel" v-if="Obj.ticket_status==='1'"><text>取消订单</text></view>
				<view class="pay" @click="Delete" v-if="Obj.ticket_status==='5'||Obj.ticket_status==='0'"><text>删除订单</text></view>
				<!-- <view class="pay" @click="deleteOrder" v-if="Obj.ticket_status==='1'"><text>删除订单</text></view> -->
			</view>
			<view class="time" v-if="Obj.ticket_status==='3'">
			<view style="display: flex;flex-direction: row;align-items: center;">
				<text>剩余时间:</text>
				<uni-countdown :show-day="false" :hour="hour" :minute="minute" :second="10"></uni-countdown>
			</view>
			</view>
	</view>
	
	
	<w-picker
		:visible.sync="selectorVisible"
		mode="selector"
		value=""
		default-type="name"
		:default-props="defaultProps"
		:options="selectorList"
		@confirm="onConfirm($event,'selector')"
		ref="selector"
	></w-picker>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
	export default {
		components:{headers,popup,wPicker,uniCountdown},
		data() {
			return {
				token:'',
				userinfo:{},
				id:'',
				Obj:{},
				selectorVisible:false,
				defaultProps:{
					label:"name",
					value:"id"
				},
				selectorList:[
					{
						name:"支付宝支付",
						id:"alipay"
					},{
						name:"微信支付",
						id:"wxpay"
					}
				],
				hour:0,
				minute:0,
				second:0
				
			};
		},
		onLoad(e) {
			let {token} = uni.getStorageSync('userinfo');
			this.userinfo = uni.getStorageSync('userinfo');
			this.token = token;
			// console.log(e)
			this.id = e.id;
			// this.getMsg(e.id);
		   this.getMsg(this.id);
		},
		onShow() {
			// this.getMsg(this.id);
		},
		methods:{
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
			async Cancel(){
				let obj = {token:this.token,id:this.Obj.id};
				let res = await this.$Post('/api/Groundticket/UserTicketClose',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},500)
				}
			},
			async Delete(){
				let obj = {token:this.token,id:this.Obj.id};
				let res = await this.$Post('/api/Groundticket/UserTicketDel',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},500)
				}
			},
			async deleteOrder(){
				let obj ={token:this.token,id:this.Obj.id};
				let res = await this.$Post('/api/Groundticket/UserTicketDel',obj);
				this.$Toast(res.data.msg)
				if(res.data.code===1){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},500)
				}
			},
			async getMsg(activityid){
				let res = await this.$Post('/api/Groundticket/UserTicketinfo',{token:this.token,id:activityid});
				if(res.data.code===1){
					this.Obj = res.data.data;
					if(res.data.data.ticket_status==='1'){
						let time = new Date(res.data.data.create_time).getTime()+1800000;
						let newTime = new Date().getTime();
						this.toHHmmss(time-newTime);
					}
					if(res.data.data.ticket_status==='3'){
						let start = new Date().getTime();
						let end = new Date(res.data.data.use_expiredtime).getTime();
						let time = end-start;
						this.toHHmmss(time);
						console.log(end-start);
					}
				}
				console.log(res)
			},//获取详情
			toHHmmss(data) {
				console.log(data)
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
		pay(){
			this.selectorVisible = true;
		},
		async onConfirm(e){
			// console.log(this.Obj)
			// return
			if(e.value==='alipay'){
				uni.request({
					method:'GET',
					url:`http://47.95.39.75:9706/addons/epay/index/Payordersn`,
					header: {'content-type': 'application/json;charset=UTF-8'},
					data:{ordersn:this.Obj.ordersn,type:'alipay'},
					success: (res) => {
						uni.requestPayment({
							provider:'alipay',
							orderInfo:res.data,
							success: (res)=> {
								this.$Toast('您已购买成功');
								 this.getMsg(this.id);
								console.log('success:' + JSON.stringify(res));
							},
							fail: (err)=> {
								this.$Toast('支付出现错误');
							console.log('fail:' + JSON.stringify(err));
							}
						})
					}
				})
				
			}else if(e.value==='wxpay'){
				uni.request({
					method:'GET',
					url:`http://47.95.39.75:9706/addons/epay/index/Payordersn`,
					header: {'content-type': 'application/json;charset=UTF-8'},
					data:{ordersn:this.Obj.ordersn,type:'wechat'},
					success: (res) => {
						console.log(res)
						uni.requestPayment({
							provider:'wxpay',
							orderInfo:res.data,
							success: (res)=> {
								this.$Toast('您已购买成功')
								 this.getMsg(this.id);
								console.log('success:' + JSON.stringify(res));
							},
							fail: (err)=> {
								this.$Toast('支付出现错误');
							console.log('fail:' + JSON.stringify(err));
							}
						})
					}
				})
			}
			console.log(e)
		},
	}
}
</script>

<style lang="scss" scoped>
	.countdown{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.pay{
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
	.people{
		width: 95%;
		margin: 20rpx auto;
		box-sizing: border-box;
		padding: 20rpx;
		.title{
			font-weight: 600;
			font-size: 26rpx;
			margin-bottom: 15rpx;
			display: inline-block;
		}
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F0F0F0;
			padding: 15rpx 0;
			.user{
				width: 30%;
				display: flex;
				flex-direction: row;
				align-items: center;
				image{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			}
			input{
				width: 70%;
				border: 1px solid red;
			}
		}
	}
	.box{
		width: 700rpx;
		background: white;
		box-sizing: border-box;
		padding: 40rpx 15rpx;
		border-radius: 15rpx;
	}
	
	.popup{
		width: 700rpx;
		max-height: 900rpx;
		overflow-y: scroll;
		background: white;
		border-radius: 15rpx;
		box-sizing: border-box;
		padding: 50rpx 25rpx;
		.inp{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 15rpx;
			height: 80rpx;
			text{
				width: 40%;
			}
			input{
				width: 60%;
				height: 80%;
				border: 1px solid #333333;
				box-sizing: border-box;
				border-radius: 10rpx;
				padding: 10rpx 0;
				text-indent: 15rpx;
			}
		}
		.switch{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.btn{
			width: 80%;
			background: #007AFF;
			margin: 40rpx auto;
			border-radius: 10rpx;
			text-align: center;
			color: white;
			padding: 10rpx 0;
		}
	}
</style>
