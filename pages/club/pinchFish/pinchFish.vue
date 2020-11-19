<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="掐鱼比赛" :leftIcon="true" />
		</view>
		<view v-if="list.length===0" style="font-size: 26rpx;"><text>暂无比赛</text></view>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index"  @click="seeDetail(item)">
				<view class="top">
					<text><text class="title">活动标题</text> :{{item.activity_name}}</text>
					<view class="">
						<text> <text class="title">状态</text>:
						<text v-if="item.status==='1'">待发布</text>
						<text v-if="item.status==='2'">已发布</text>
						<text v-if="item.status==='3'">比赛中</text>
						<text v-if="item.status==='4'">结束中</text>
						<text v-if="item.status==='5'">统计完成</text>
						<text v-if="item.status==='6'">异常</text>
						</text>
					</view>
				</view>
				<!-- <view class="content"><text><text class="title">活动内容</text>:{{item.activity_intro}}</text></view> -->
				<!-- <view class=""><text>报名开始时间{{item.signup_starttime}}</text></view> -->
				<!-- <view class=""><text>报名结束时间{{item.signup_stoptime}}</text></view> -->
				<view class="top">
					<text><text class="title">比赛时间</text>:{{item.pt_starttime}}</text>
					<view class="">
						<text><text class="title">比赛类型</text>:
					     <text v-if="item.activity_type==='1'">团体</text>
						 <text v-if="item.activity_type==='2'">掐鱼</text>
					  </text>
					</view>
				</view>
				<!-- <view class=""><text>比赛人数{{item.pt_number}}</text></view> -->
				<!-- <view class=""><text>最低参赛人数{{item.lowpt_number}}</text></view> -->
				<!-- <view class=""><text>报名费用{{item.registery_fee}}</text></view> -->
				<!-- <view class=""><text>联系人电话{{item.phone_num}}</text></view> -->
				
				
				<!-- <view class=""><text @click="Enter(item)">参与</text></view> -->
				<!-- <view class=""><text>详情</text></view> -->
				<!-- <view class=""  v-if="item.status==='4'"><text @click="seeRank(item)">查看排行</text></view> -->
			</view>
		</view>
		<view class="posi">
			<view class="one" @click="goTo"><text>我的</text><text>发起</text></view>
			<view class="two" @click="participate"><text>我的</text><text>参与</text></view>
		</view>
		
		
		
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components:{headers,popup},
		data() {
			return {
				id:'',
				token:'',
				list:[],
				userName:'',
				userPhone:'',
				pwd:'',
				orderId:'',
				offset:1
			};
		},
		 onLoad(e) {
			 this.id = e.roomId;
			 let {token} = uni.getStorageSync('userinfo');
			 this.token = token;
			
		},
		onShow() {
			this.list = [];
			this.offset = 1;
			let obj = {offset:this.offset,limit:20,fishground_id:this.id,activity_type:2};
			// let obj1 = {offset:1,limit:20,fishground_id:this.id,activity_type:1};
			this.getList(obj);
			// this.getList(obj1);
		},
		onReachBottom() {
			let obj = {offset:this.offset,limit:20,fishground_id:this.id,activity_type:2};
			// let obj1 = {offset:1,limit:20,fishground_id:this.id,activity_type:1};
			this.getList(obj);
		},
		methods:{
			async getList(obj){
				uni.showLoading({
					mask:true
				})
				let res = await this.$Post('/api/Groundactivity/ListFishGroupActivity',obj);
				if(res.data.code===1){
					this.list.push(...res.data.data.list)
					this.offset++;
					// this.list = res.data.data.list;
				}
				uni.hideLoading();
				console.log(res)
			},//钓场掐鱼列表
			goTo(){
				uni.navigateTo({
					url:`./Initiate?id=${this.id}`
				})
			},//我的发起
			participate(){
				uni.navigateTo({
					url:'./participate'
				})
			},//我的参与
			
			seeDetail(item){
				uni.navigateTo({
					url:`./pinchFishDetail?id=${item.id}&people=people`
				})
				
			},//去详情页面
			// seeRank(item){
				
			// },//查看排行
		}
	}
</script>

<style lang="scss" scoped>
	.posi{
		font-size: 30rpx;
		position: fixed;
		right: 50rpx;
		bottom: 150rpx;
		view{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
			color: white;
			z-index: 10;
		}
		.one{
			background: red;
		}
		.two{
			background: green;
		}
	}
	.list{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		.item{
			margin-bottom: 20rpx;
			background: #F8FAFB;
			box-sizing: border-box;
			padding: 20rpx;
			border-radius: 15rpx;
			.title{
				font-weight: 600;
			}
			.top{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				margin-bottom: 35rpx;
			}
			.content{
				font-size: 26rpx;
				margin-bottom: 15rpx;
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
</style>
