<template>
	<view>
		<view class="top_hr" style="padding-bottom: 0;"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="订单" :leftIcon="true" />
		</view>
		
		<view class="tab_top"></view>
		<view class="tab tabTab">
			<view class="item" 
			v-for="(item,index) in tabList" 
			:key="index" 
			:class="ind===index?'active':''"
			@click="Switch(index)">
				<text>{{item.title}}</text>
			</view>
		</view>
		
		<view class="box" v-if="ind===0">
			<view style="font-size: 26rpx;" v-if="orderList.length===0"><text>暂无个人鱼票数据</text></view>
			<view class="user_fish_order">
				<view class="item" v-for="(item,index) in orderList" :key="index" @click="seeFish(item)">
					<view class="fish_name">
						<text>{{item.ticket_name}}</text>
						<view class="">
							<text>状态:</text>
							<!-- <text v-if="item.ticket_status==='0'">已取消</text>
							<text v-if="item.ticket_status==='1'">待支付</text>
							<text v-if="item.ticket_status==='2'">已支付</text>
							<text v-if="item.ticket_status==='3'">异常取消</text> -->
							<text v-if="item.ticket_status==='0'">无效</text>
							<text v-if="item.ticket_status==='1'">待支付</text>
							<text v-if="item.ticket_status==='2'">已支付</text>
							<text v-if="item.ticket_status==='3'">正在使用</text>
							<text v-if="item.ticket_status==='4'">已使用</text>
							<text v-if="item.ticket_status==='5'">无效</text>
							<!-- <text v-if="item.ticket_status==='3'">正在使用</text> -->
							<!-- 0:无效,1:有效,2=待支付,3=正在使用,4=已使用,all=全部 -->
							<!-- {status:'3',name:'待支付'},
							{status:'2',name:'已支付'},
							{status:'4',name:'正在使用'},
							{status:'5',name:'已使用'},
							{status:'1',name:'无效'} -->
						</view>
						</view>
					
					<view class="con">
						<view class=""><text>单号:{{item.ordersn}}</text></view>
						<view class=""><text>费用:{{item.ticket_price}}</text></view>
					</view>
					<view class="bottom" style="margin-bottom: 15rpx;">
						<view class=""><text>渔场名称:{{item.ground_name}}</text></view>
						
					</view>
					<view class="bottom"><text>订单生成时间:{{item.create_time}}</text></view>
				</view>
			</view>
		</view>
		
		<view class="box" v-if="ind===1">
			<view style="font-size: 26rpx;" v-if="gameList.length===0"><text>暂无比赛报名订单</text></view>
			<!-- <view class="item" v-for="(item,index) in gameList" :key="index">
				<view class=""><text>单号:{{item.ordersn}}</text></view>
				<view class=""><text>渔场名称:{{item.ground_name}}</text></view>
				<view class=""><text>鱼票名称:{{item.ticket_name}}</text></view>
				<view class=""><text>鱼票金额:{{item.ticket_price}}</text></view>
				<view class=""><text>时间:{{item.create_time}}</text></view>
			</view> -->
			<view class="user_fish_order">
				<view class="item" v-for="(item,index) in gameList" :key="index" @click="seeGame(item)">
					<view class="fish_name">
						<text>{{item.activity_name}}</text>
						<view class="">
							<text>状态:</text>
						<!-- 	<text v-if="item.activity_status==='1'">待发布</text>
							<text v-if="item.activity_status==='2'">已发布</text>
							<text v-if="item.activity_status==='3'">比赛中</text>
							<text v-if="item.activity_status==='4'">结束比赛</text>
							<text v-if="item.activity_status==='5'">赛事完成</text>
							<text v-if="item.activity_status==='6'">异常</text> -->
							<text v-if="item.status==='0'">已取消</text>
							<text v-if="item.status==='1'">待支付</text>
							<text v-if="item.status==='2'">已支付</text>
							<text v-if="item.status==='3'">异常取消</text>
						</view>
						</view>
					
					<!-- <view class="con">
						<view class=""><text>单号:{{item.ordersn}}</text></view>
						<view class=""><text>金额:{{item.pt_number}}</text></view>
					</view> -->
					<view class="bottom">
						<!-- <view class="bottom_text"><text>备注:{{item.activity_intro}}</text></view> -->
						<view class=""><text>订单生成时间:{{item.ordercrea_time}}</text></view>
					</view>
				</view>
			</view>
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
					{title:'鱼票订单列表'},
					{title:'比赛订单'},
				],
				ind:0,
				token:'',
				orderList:[],
				gameList:[],
				offset:1,
				type:''
			};
		},
		onLoad(e) {
			console.log(e)
			
			this.type = e.type;
			
		},
		mounted() {
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			// this.getOrderList();
		},
		onShow() {
			this.offset=1;
			if(this.type){
				this.ind =0;
			}else{
				this.ind = 1;
			}
			
			if(this.ind){
				this.getGameOrder();
			}else{
				this.getOrderList();
			}
		},
		onReachBottom() {
			if(this.ind){
				this.getGameOrder();
			}else{
				this.getOrderList();
			}
		},
		methods:{
			Switch(index){
				this.ind = index;
				this.offset = 1;
				uni.pageScrollTo({
					scrollTop:0
				})
				if(this.ind){
					this.getGameOrder();
				}else{
					this.getOrderList();
				}
			},//切换tab
			async getOrderList(){
				uni.showLoading({
					mask:true
				})
				let obj = {token:this.token,offset:this.offset,limit:10,ticket_status:'all'};
				let res = await this.$Post('/api/Groundticket/UserTicketList',obj);
				if(res.data.code===1){
					if(this.offset===1){
						this.orderList = res.data.data.list;
					}else{
						this.orderList.push(...res.data.data.list);
					}
					this.offset++;
				}
				uni.hideLoading();
				console.log(res)
			},//个人订单列表
			async getGameOrder(){
				uni.showLoading({
					mask:true
				})
				let obj = {token:this.token,offset:this.offset,limit:10};
				let res = await this.$Post('/api/Groundactivity/UserFishGroupActivityList',obj); 
				if(res.data.code===1){
					if(this.offset===1){
						this.gameList = res.data.data.list;
					}else{
						this.gameList.push(...res.data.data.list);
					}
					this.offset++;
				}
				uni.hideLoading();
				// console.log(res)
			},//获取
			seeFish(item){
				console.log(item)
				uni.navigateTo({
					url:`./fishDetail?id=${item.id}`
				})
			},
			seeGame(item){
				uni.navigateTo({
					url:`./gameDetail?id=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		.item{
			margin-bottom: 40rpx;
		}
	}
	
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
    .user_fish_order{
		width: 95%;
		margin: 20rpx auto;
		.item{
			background: #CBEEFF;
			border-radius: 15rpx;
			box-sizing: border-box;
			padding: 40rpx 20rpx;
			margin-bottom: 30rpx;
			.fish_name{
				font-size: 26rpx;
				font-weight: 600;
				margin-bottom: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.con{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				margin-bottom: 20rpx;
			}
			.bottom{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				.bottom_text{
					width: 40%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
