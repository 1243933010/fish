<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="收支" :leftIcon="true" />
		</view>
		<!-- <view class="tab_top"></view>
		<view class="tab tabTab">
			<view class="item" 
			v-for="(item,index) in tabList" 
			:key="index" 
			:class="ind===index?'active':''"
			@click="Switch(index)">
				<text>{{item.title}}</text>
			</view>
		</view> -->
		
		<view class="box" v-show="ind===0">
			<!-- <text>用户鱼票列表</text> -->
			<view style="font-size: 26rpx;" v-if="fishMoneyList.length===0"><text>暂无鱼票数据</text></view>
			<view class="item" v-for="(item,index) in fishMoneyList" :key="index" @click="see(item)">
				<text class="name">{{item.ground_name}}鱼票</text>
				<text class="name">{{item.ticketnum}}元</text>
				<text class="see">查看明细</text>
			</view>
		</view>
		
		<view class="pox" v-show="ind===1">
			<view style="font-size: 26rpx;" v-if="moneyList.length===0"><text>暂无收支数据</text></view>
			<view class="item" v-for="(item,index) in moneyList" :key="index">
				<text>{{item.remark}}</text>
				<text>{{item.create_time}}</text>
			</view>
			<!-- <text>回鱼记录</text> -->
			<!-- <image src="../../static/me/ticket.png" mode=""></image> -->
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue'
	export default {
		components: {
			headers
		},
		data() {
			return {
				tabList:[
					{title:'俱乐部鱼票列表'},
					{title:'收支明细'},
				],
				ind:0,
				fishMoneyList:[],//俱乐部鱼票列表
				token:'',
				moneyList:[],//收支明细
				offset1:1,
				offset2:1
			};
		},
		onShow(){
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			uni.pageScrollTo({
				scrollTop:0
			})
			this.offset1=1;
			this.offset2=1;
			this.fishMoneyList = [];
			this.getFishMoneyList();//俱乐部鱼票列表
			// this.getFishReturnHistory();//收支明细
		},
		onReachBottom() {
			if(this.ind){
				this.getFishReturnHistory();//收支明细
			}else{
				this.getFishMoneyList();//俱乐部鱼票列表
			}
		},
		methods:{
			Switch(index){
				this.ind = index;
				if(this.ind){
					this.getFishReturnHistory();//收支明细
				}else{
					this.getFishMoneyList();//俱乐部鱼票列表
				}
			},//切换tab
			async getFishMoneyList(){
				uni.showLoading({
					mask:true
				})
				let obj = {token:this.token,offset:this.offset1,limit:10};
				let res = await this.$Post('/api/Groundticket/UserFistTicketList',obj);
				// console.log(res)
				if(res.data.code ===1){
					if(this.offset===1){
						this.fishMoneyList = res.data.data.list;
					}else{
						this.fishMoneyList.push(...res.data.data.list);
					}
					this.offset1++;
					this.offset2++;
				}
				uni.hideLoading();
			},//俱乐部鱼票列表
			async getFishReturnHistory(){
				uni.showLoading({
					mask:true
				})
				let obj = {token:this.token,offset:this.offset2,limit:10};
				let res = await this.$Post('/api/Groundticket/TicketUserloglist',obj);
				if(res.data.code===1){
					if(this.offset===1){
						this.moneyList = res.data.data.list;
					}else{
						this.moneyList.push(...res.data.data.list);
					}
					this.offset2++;
				}
				uni.hideLoading();
				// console.log(res)
			},//收支明细
			see(item){
				uni.navigateTo({
					url:`../userPageDetail/userPageDetail?fishground_id=${item.fishground_id}`
				})
				console.log(item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab_top{
		width: 100%;
		height: 100rpx;
		// background: red;
		margin-bottom: 30rpx;
	}
	.tabTab{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		margin-bottom: 20rpx;
		position: fixed;
		top: 160rpx;
		.item{
			width: 50%;
			height: 100%;
			text-align: center;
			background: #FAFAFA;
			color: #999999;
			font-size: 26rpx;
			display: flex;
			justify-content: center;
			
			align-items: center;
			
		}
	}
	.active{
		background: #00ACFF !important;
		color: white !important;
	}
	.tab{
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		top: 160rpx;
		// background: green;
		
		.item{
			width: 50%;
			text-align: center;
		}
	}
	.pox{
		width: 95%;
		margin: 0 auto;
		.item{
			display: flex;
			justify-content: center;
			flex-direction: column;
			font-size: 26rpx;
			// color: #333333;
			background: #00ACFF;
			margin-bottom: 20rpx;
			color: white;
			border-radius: 10rpx;
			box-sizing: border-box;
			padding: 15rpx ;
			
			text{
				margin-bottom: 10rpx;
			}
		}
	}
	.box{
		width: 95%;
		margin: 0 auto;
		.item{
			width: 690rpx;
			height: 180rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 35rpx;
			// color: #333333;
			background: url(../../static/me/ticket.png) no-repeat;
			background-size: 100% 100%;
			margin: 20rpx auto;
			color: #FF7C34;
			border-radius: 10rpx;
			box-sizing: border-box;
			padding: 15rpx ;
			.name{
				width: 70%;
				margin: 0 auto;
				display: flex;
				// flex-wrap: wrap;
				flex-direction: column;
				align-items: center;
				
			}
			text{
				margin-bottom: 10rpx;
			}
			.see{
				font-size: 30rpx;
				color: #3EC1FF;
			}
		}
	}
</style>
