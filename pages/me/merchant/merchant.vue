<template>
	<view>
		<view class="top_hr" style="padding: 0;"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="商家中心" :leftIcon="true" rightText="系统通知" @rightClick="rightClick" :radio="messageFlog"/>
		</view>
		
		
		<view class="box">
			<view class="item" v-for="(item,index) in fnList" :key="index" @click="goTo(item)">
				<view class="pox" v-if="item.title" :style="{'border-bottom':item.sty?'none':'auto'}">
					<text>{{item.title}}</text>
					<image src="../../../static/me/next.png" mode="widthFix"></image>
				</view>
				<view class="icon" v-if="item.val">
					<image :src="item.icon" mode="widthFix"></image>
					<text>{{item.val}}</text>
				</view>
			</view>
		</view>
		<!-- <image src="../../../static/me/dingdan.png" mode=""></image> -->
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	export default {
		components:{headers},
		data() {
			return {
				fnList:[
					{val:'钓场管理',icon:'../../../static/me/guanli.png',flog:true},
					{title:'钓场信息',url:'./edit/edit'},
					// {title:'环境服务',url:''},
					{title:'公告栏',url:'./bulletinBoard/bulletinBoard'},
					// {title:'即时分享',url:''},
					{title:'现场服务',url:'./fieldService/fieldService',sty:true},
					{val:'服务管理',icon:'../../../static/me/fuwu.png',flog:true},
					{title:'团体正赛列表',url:'./game/game'},
					{title:'鱼票列表',url:'./fishTicket/fishTicket',sty:true},
					{val:'订单管理',icon:'../../../static/me/dingdan.png',flog:true},
					{title:'比赛订单',url:'./gameOrder/gameOrder'},
					{title:'鱼票订单',url:'./fishOrder/fishOrder',sty:true},
					{val:'结算中心',icon:'../../../static/me/jiesuan.png',flog:true},
					{title:'我的余额',url:'../money/money'},
					{title:'回鱼',url:'../returnFish/returnFish',sty:true}
				],
				messageFlog:false
			};
		},
		onShow() {
			this.getMessage();
		},
		methods:{
			async getMessage(){
				let res = await this.$Post('/api/Index/IndexNoticeNum',{token:this.token});
				if(res.data.code===1){
					this.messageFlog = true;
				}else{
					this.messageFlog = false;
				}
				// console.log(res)
			},
			goTo(item){
				if(item.flog){
					return
				}
				if(item.url){
					uni.navigateTo({
						url:item.url
					})
				}else{
					this.$Toast('暂未开放');
				}
			},
			rightClick(){
				uni.navigateTo({
					url:'../../club/message/message'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		width: 100%;
		margin: 0 auto;
		.item{
			width: 100%;
			.pox{
				width: 90%;
				margin: 15rpx auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #343434;
				font-size: 26rpx;
				border-bottom: 1px solid #F0F0F0;
				// margin-bottom: 15rpx;
				padding: 18rpx 0;
				image{
					width: 15rpx;
				}
			}
			.icon{
				width: 100%;
				box-sizing: border-box;
				padding: 25rpx 20rpx;
				background: #F9F9F9;
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 26rpx;
				color: #333333;
				font-weight: 600;
				image{
					width: 30rpx;
					margin-right: 15rpx;
				}
			}
		}
	}
</style>
