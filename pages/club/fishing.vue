<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="垂钓服务" :leftIcon="true" />
		</view>
		
		<view class="box">
			<view class="bisai">
				<view class="baoming">
					<text class="title">团体正赛报名</text>
					<view class="btn" @click="game"><text>立即报名</text></view>
				</view>
			</view>
			<view class="qia" @click="qia">
				<image src="../../static/club/jiangbei.png" mode="widthFix"></image>
				<text>掐鱼比赛</text>
			</view>
			<view v-if="fishTicketList.length===0" style="font-size: 26rpx;"><text>暂无鱼票</text></view>
			<view class="piao">
				<view class="item" v-for="(item,index) in fishTicketList" :key="index" @click="pay(item)">
					<view class="title">
						<text>{{item.ticket_name}}</text>
					</view>
					<!-- <view class="label"><text>立即购买</text></view> -->
					<view class="label"><text>价格：{{item.ticket_price}}元</text></view>
					<!-- <view class="label"><text>备注：{{item.ticket_intro}}</text></view> -->
					<!-- <view class="label">
						<text >立即购买</text>
					</view> -->
				</view>
			</view>
			
			<!-- <view class="botton" @click="qia">
				<image src="../../static/club/jiangbei.png" mode="widthFix"></image>
				<text>掐鱼比赛</text>
			</view> -->
		</view>
		
		
		
		
		<!-- 掐鱼编辑弹窗 -->
		 <uni-popup type="bottom" ref="form">
			 <view class="pox">
			 	<view class="huiyu"><text>回鱼额度：{{ticketnum}}</text></view>
				 <view class="radio" v-if="ticketnum!=='0'">
					 <text>是否使用回鱼鱼票抵用？</text>
					  <radio-group @change="radioChange">
					 <label class="radio"><radio value="sure" style="transform:scale(0.7)" :checked="checkStatus" />是</label>
					 <label class="radio"><radio value="fail" style="transform:scale(0.7)" :checked="!checkStatus" />否</label>
					  </radio-group>
					 
				 </view>
				 <view class="btn" @click="payBtn"><text>确定</text></view>
			 </view>
	     </uni-popup>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			headers,
			popup
		},
		data() {
			return {
				fishTicketList:[
					// {ticket_name:'竞技练竿池鱼票',ticket_price:'50'},
					// {ticket_name:'休闲散钓大池鱼票',ticket_price:'100'},
					// {ticket_name:'罗非专钓池鱼票',ticket_price:'150'},
					// {ticket_name:'草鱼专钓池鱼票',ticket_price:'200'},
				],
				id:'',
				token:'',
				ticketnum:'',
				checkStatus:true,
				switchList:{sure:'1',fail:'2'},
				checkFlog:'1',
				fishId:'',
				offset:1
			};
		},
		onLoad(e) {
			// console.log(e)
			this.id = e.roomId;
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			this.getFishTicketList(e.roomId);
			this.getMoney();
		},
		methods:{
			radioChange(e){
				this.checkFlog = this.switchList[e.detail.value];
				// console.log(this.switchList[e.detail.value])
				// console.log(e.detail.value);
			},//选择是否抵用
			async payBtn(){
				if(this.ticketnum==='0'){
					this.checkFlog ='2'
				}
				let obj={token:this.token,ticketid:this.fishId,use_wallet:this.checkFlog}
						let data = await this.$Post('/api/Groundticket/buyTicketone',obj);
						this.$Toast(data.data.msg);
						console.log(data)
			},//购买鱼票
			async getMoney(){
				let obj = {token:this.token,fishground_id:this.roomId};
				let res = await this.$Post('/api/Groundticket/UserFistTicketinfo',obj);
				if(res.data.code===1){
					this.ticketnum = res.data.data.ticketnum;
				}
				// console.log(res)
			},//获取用户在该渔场得回鱼总额
			async getFishTicketList(id){
				let obj = {fishground_id:id};
				let res = await this.$Post('/api/Groundticket/ListGroundticket',obj);
				
				if(res.data.code===1){
					let arr = [];
					res.data.data.forEach((val,ind)=>{
						if(val.ticket_status==='1'){
							arr.push(val);
						}
					})
					this.fishTicketList = arr;
				}
				console.log(res)
			},//获取绑定渔场的鱼票列表
			 pay(item){
				 this.fishId = item.id;
				 // this.$refs.form.open();
				 uni.navigateTo({
				 	url:`./fishingDetail?id=${this.id}&fishId=${item.id}`
				 })
				// let {token} = uni.getStorageSync('userinfo');
				// uni.showModal({
				// 	content:'是否使用回鱼鱼票抵用？',
				// 	success: async(res) => {
				// 		let obj;
				// 		if(res.confirm){
				// 			obj={token,ticketid:item.id,use_wallet:1};
				// 		}else{
				// 			obj={token,ticketid:item.id,use_wallet:2}
				// 		}
				// 		let data = await this.$Post('/api/Groundticket/buyTicketone',obj);
				// 		this.$Toast(data.data.msg);
				// 		console.log(data)
				// 	}
				// })
			},//购买鱼票
			qia(){
				// this.$refs.form.open();
				uni.navigateTo({
					url:`./pinchFish/pinchFish?roomId=${this.id}`
				})
			},//去往掐鱼比赛
			game(){
				uni.navigateTo({
					url:`./game/game?roomId=${this.id}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pox{
		width: 100%;
		background: white;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		.huiyu{
			font-size: 28rpx;
			margin-bottom: 20rpx;
		}
		.radio{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 20rpx;
			uni-radio-group{
				display: flex;
				flex-direction: row;
				align-items: center;
			}
		}
		.btn{
			width: 70%;
			margin: 0 auto;
			background: #3DC1FF;
			font-size: 27rpx;
			color: white;
			border-radius: 8rpx;
			padding: 15rpx 0;
			text-align: center;
		}
	}
	.box{
		.botton,.qia{
			// position: fixed;
			// bottom: 0;
			// left: 25rpx;
			width: 700rpx;
			height: 40rpx;
			margin: 0 auto;
			background: #6ACFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			color: white;
			border-radius: 10rpx;
			padding: 18rpx 0;
			margin-bottom: 65rpx;
			image{
				width: 40rpx;
				margin-right: 15rpx;
			}
		}
		.bisai{
			width: 730rpx;
			height: 270rpx;
			margin: 0rpx auto;
			background: url(../../static/club/vs.png) no-repeat;
			background-size: 100% 100%;
			box-sizing: border-box;
			padding: 40rpx 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.baoming{
				display: flex;
				flex-direction: column;
				height: 100%;
				justify-content: space-between;
				padding: 15rpx 0;
				.title{
					font-size: 50rpx;
					color: white;
					font-weight: 600;
				}
				.btn{
					background: #FFCF73;
					color: white;
					text-align: center;
					border-radius: 10rpx;
					box-sizing: border-box;
					padding: 10rpx 0;
				}
			}
		}
		.piao{
			width: 700rpx;
			margin: 0 auto;
			padding-bottom: 50rpx;
			.item{
				width: 100%;
				height: 250rpx;
				background: url(../../static/club/ticket.png) no-repeat;
				background-size: 100% 100%;
				margin-bottom: 50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction:column;
				.title{
					color: #27B9FF;
					font-size: 44rpx;
					margin-bottom: 25rpx;
					text-align: center;
					text{
						display: inline-block;
						width: 500rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				.label{
					color: #F32727;
					font-size: 30rpx;
					font-weight: 600;
				}
			}
		}
	}
</style>
