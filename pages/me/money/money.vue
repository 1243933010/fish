<template>
	<view>
		<view class="top_hr" id="top_hr" style="box-sizing: border-box;margin-bottom: 20rpx;"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="账户余额" :leftIcon="true" />
		</view>
		
		<view class="bk">
			<view class="text">
				<text class="num">￥{{money}}</text>
				<text class="label">账户余额(元)</text>
			</view>
		</view>
		
		<view class="money">
			<view class="tixian">
				<view class="left"><text>可提现(元)</text><text class="label">{{money}}</text></view>
				<view class="btn"><text @click="withDraw">提现</text></view>
			</view>
			<view class="history">
				<view class="left"><text>历史已提现(元)</text></view>
				<view class="num">
					<text>{{money_draw}}</text>
					<image src="../../../static/me/next.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		
		<view class="mingxi">
			<view class="title">
				<text>余额明细</text>
			</view>
			
			<scroll-view scroll-y="true" :style="{height:Height+'px'}" @scrolltolower="scrolltolower">
				<view class="content">
					<view style="font-size: 26rpx;" v-if="historyList.length===0">暂无数据</view>
					<view class="item" v-for="(item,index) in historyList" :key="index">
						<view class="left">
							<text class="name">{{item.memo}}</text>
							<text class="time">{{item.money}}</text>
						</view>
						<view class="right">
							<text>{{item.after*1-item.before*1>0?'+':''}}{{item.money}}元</text>
						</view>
					</view>
				</view>
			</scroll-view>
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
				Height:'',
				money:'',
				money_draw:'',
				userinfo:{},
				historyList:[],
				offset:1
			};
		},
		created() {
			
			
			
				// this.userinfo = uni.getStorageSync('userinfo');
				// this.getUserInfo();
				// this.moneyList();
		},
		onShow() {
			this.offset = 1;
			this.historyList = [];
			this.userinfo = uni.getStorageSync('userinfo');
			this.getUserInfo();
			this.moneyList();
		},
		mounted() {
			uni.getSystemInfo({
				success: (data) => {
					this.Height = data.windowHeight;
				}
			})
			const query = uni.createSelectorQuery().in(this);
			query.select('#top_hr').boundingClientRect(data => {
				this.Height = this.Height-data.height;
			}).exec();
			const query2 = uni.createSelectorQuery().in(this);
			query2.select('.bk').boundingClientRect(data => {
				this.Height = this.Height-data.height;
			}).exec();
			const query3 = uni.createSelectorQuery().in(this);
			query3.select('.money').boundingClientRect(data => {
				this.Height = this.Height-data.height;
			}).exec();
			this.Height = this.Height-80;
		},
		methods:{
			async getUserInfo(){
				let obj = {token:this.userinfo.token};
				let res = await this.$Get('/api/user/Getuserinfo',obj);
				if(res.data.code===1){
					this.money = res.data.data.money;
					this.money_draw = res.data.data.money_draw;
					if(res.data.data.is_merchant==='1'){getApp().globalData.fishground_id=res.data.data.fishid};
				}
			},
			withDraw(){
				uni.navigateTo({
					url:'./withdraw'
				})
			},//跳转到提现操作页面
			async moneyList(status){
				let obj = {token:this.userinfo.token,offset:this.offset,limit:10,keyword:''};
				let res = await this.$Post('/api/User/UserMoneyLogList',obj);
				if(res.data.code===1){
					console.log(status)
					if(this.offset===0){
					this.historyList = res.data.data.list;
					}else{
					this.historyList.push(...res.data.data.list);	
						
					}
					this.offset++;
				}
			},//获取余额变动记录
			scrolltolower(e){
				console.log(e)
				this.moneyList('status');
			},//滚动到底部触发
		}
	}
</script>

<style lang="scss" scoped>
	.mingxi{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 0;
		.title{
			width: 100%;
			background: #F2F2F2;
			font-size: 26rpx;
			color: #333333;
			box-sizing: border-box;
			padding: 10rpx 25rpx;
		}
		.content{
			width: 100%;
			box-sizing: border-box;
			padding: 15rpx 25rpx;
			.item{
				border-bottom: 1px solid #F0F0F0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 15rpx 0;
				.left{
					display: flex;
					flex-direction: column;
					.name{
						font-size: 26rpx;
						margin-bottom: 15rpx;
					}
					.time{
						font-size: 24rpx;
						color: #999999;
					}
				}
				.right{
					font-size: 26rpx;
					color: #666666;
				}
			}
		}
	}
	.money{
		width: 95%;
		height: 250rpx;
		margin: 20rpx auto;
		background: #FFFFFF;
		box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.13);
		border-radius: 15px;
		box-sizing: border-box;
		padding: 30rpx 20rpx;
		.tixian{
			border-bottom: 1px solid #F0F0F0;
		}
		.tixian,.history{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			.left{
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 26rpx;
				text{
					margin-right: 15rpx;
				}
				.label{
					color: #6ACFFF;
				}
			}
			.btn{
				width: 100rpx;
				height: 80rpx;
				border-radius: 10rpx;
				background: #6ACFFF;
				display: flex;
				justify-content: center;
				align-items: center;
				color: white;
				font-size: 26rpx;
			}
			.num{
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 26rpx;
				color: #333333;
				text{
					margin-right: 15rpx;
				}
				image{
					width: 20rpx;
				}
			}
		}
	}
	.bk{
		width: 95%;
		height: 220rpx;
		margin: 20rpx auto;
		background: url(../../../static/me/bg.png) no-repeat;
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.text{
			display: flex;
			flex-direction: column;
			align-items: center;
			.num{
				font-size: 48rpx;
				color: #FFD200;
				margin-bottom: 10rpx;
			}
			.label{
				color: white;
				font-size: 26rpx;
			}
		}
	}
</style>
