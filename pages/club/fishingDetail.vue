<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%; z-index: 100;">
			<headers title="鱼票详情" :leftIcon="true" />
		</view>

		<view class="detail">
			<!-- {{obj.ticket_name}} -->
			<view class="name"> {{obj.ticket_name}}</view>
			<view class="flex">
				<view class="price">价格：{{obj.ticket_price}}</view>
				<!-- <view class="status"><text class="price">当前状态</text>：
					<text style="color: red;" v-if="obj.ticket_status==='0'">不可购买</text>
					<text style="color: green;" v-if="obj.ticket_status==='1'">可购买</text>
				</view> -->
			</view>
			
			<view class="status"><text class="price">您在该渔场得回鱼额度</text>：{{ticketnum}}</view>
			
			<view class="radio" v-if="ticketnum!=='0'">
				<text>是否使用回鱼鱼票抵用？</text>
				<radio-group @change="radioChange">
					<label class="radio">
						<radio value="sure" style="transform:scale(0.7)" :checked="checkStatus" />是</label>
					<label class="radio">
						<radio value="fail" style="transform:scale(0.7)" :checked="!checkStatus" />否</label>
				</radio-group>

			</view>
			<view class="content"><text class="price">介绍</text>：
			{{obj.ticket_intro}}
			</view>
			<view class="pay" @click="pay" v-if="obj.ticket_status==='1'"><text>购买</text></view>
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
			 @cancel="cancel"
		></w-picker>
		<!-- <rich-text :nodes="test"></rich-text>
		<view class="">{{JSON.stringify(test)}}</view> -->
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components: {
			headers,
			popup,
			wPicker
		},
		data() {
			return {
				token: '',
				roomId: '',
				fishId: '',
				ticketnum: '',
				obj: {},
				statusObj:{
					sure:'1',
					fail:'2'
				},
				checkStatus:false,
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
				ordersn:'',
				// test:''
			};
		},
		onLoad(e) {
			this.roomId = e.id;
			this.fishId = e.fishId;
			let {
				token
			} = uni.getStorageSync('userinfo');
			this.token = token;
			this.getMoney();
			this.getFishDetail();
		},
		methods: {
			radioChange(e){
				if(e.detail.value==='sure'){
					this.checkStatus = true;
				}else{
					this.checkStatus = false;
				}
				console.log(e)
			},//切换
			async getMoney() {
				let obj = {
					token: this.token,
					fishground_id: this.roomId
				};
				let res = await this.$Post('/api/Groundticket/UserFistTicketinfo', obj);
				if (res.data.code === 1) {
					this.ticketnum = res.data.data.ticketnum;
				}
				// console.log(res)
			}, //获取用户在该渔场得回鱼总额
			async getFishDetail() {
				let obj = {
					ticketid: this.fishId
				};
				let res = await this.$Post('/api/Groundticket/Groundticketinfo', obj);
				if (res.data.code === 1) {
					this.obj = res.data.data;
				}
				console.log(res)
			},
			async pay() {
				let status = '';
				if(this.checkStatus){
					status = '1';
				}else{
					status = '2';
				}
				let obj = {
					token: this.token,
					ticketid: this.fishId,
					use_wallet: status
				}
				
				let data = await this.$Post('/api/Groundticket/buyTicketone', obj);
				// this.$Toast(data.data.msg);
				if(data.data.code===1){
					this.ordersn = data.data.data.ordersn;
					if(this.checkStatus){
                         this.$Toast(data.data.msg);
					}else{
						this.selectorVisible = true;
					}
				}else{
					this.$Toast(data.data.msg);
				}
				console.log(data)
			},
			async onConfirm(e){
				console.log(this.ordersn)
				if(e.value==='alipay'){
					uni.request({
						method:'GET',
						url:`http://47.95.39.75:9706/addons/epay/index/Payordersn`,
						header: {'content-type': 'application/json;charset=UTF-8'},
						data:{ordersn:this.ordersn,type:'alipay'},
						success: (res) => {
							console.log(res)
							uni.requestPayment({
								provider:'alipay',
								orderInfo:res.data,
								success: (res)=> {
									this.$Toast('您已购买成功')
									setTimeout(()=>{
										uni.navigateTo({
											url:'../me/order/order?type=fish'
										})
									},500)
									console.log('success:' + JSON.stringify(res));
								},
								fail: (err)=> {
									setTimeout(()=>{
										uni.navigateTo({
											url:'../me/order/order?type=fish'
										})
									},500)
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
						data:{ordersn:this.ordersn,type:'wechat'},
						success: (res) => {
							console.log(res)
							uni.requestPayment({
								provider:'wxpay',
								orderInfo:res.data,
								success: (res)=> {
									this.$Toast('您已购买成功')
									setTimeout(()=>{
										uni.navigateTo({
											url:'../me/order/order?type=fish'
										})
									},500)
									console.log('success:' + JSON.stringify(res));
								},
								fail: (err)=> {
									setTimeout(()=>{
										uni.navigateTo({
											url:'../me/order/order?type=fish'
										})
									},500)
								console.log('fail:' + JSON.stringify(err));
								}
							})
						}
					})
					// this.$Toast('暂未开放微信支付');
				}
				console.log(e)
			},
			cancel(){
				this.$Toast('您取消支付，可在我的订单里面继续支付');	
				setTimeout(()=>{
					uni.navigateTo({
						url:'../me/order/order?type=fish'
					})
				},500)
			   
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		width: 95%;
		margin: 0 auto;
		background: #CBEEFF;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 50rpx 25rpx;
		.name{
			font-size: 26rpx;
			font-weight: 600;
			margin-bottom: 15rpx;
		}
		.price{
			font-size: 26rpx;
			font-weight: 600;
			margin-bottom: 15rpx;
		}
		.content{
			font-size: 28rpx;
			margin-bottom: 15rpx;
		}
		.status{
			font-size: 26rpx;
			margin-bottom: 15rpx;
		}
		.radio{
			margin-bottom: 15rpx;
		}
		.pay{
			width: 50%;
			margin: 30rpx auto;
			background: #6ACFFF;
			border-radius: 8rpx;
			color: white;
			font-size: 26rpx;
			text-align: center;
			padding: 15rpx 0;
		}
		.flex{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
