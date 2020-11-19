<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="比赛订单" :leftIcon="true" />
		</view>
		
		<view class="noList" v-if="list.length===0"><text>暂无数据</text></view>
		<view class="list">
			<view class="item" 
			v-for="(item,index) in list" :key="index"  @click="seeDetail(item)">
				<view class="top">
					<text><text class="title">活动标题</text> :{{item.activity_name}}</text>
					<view class="">
						<text> <text class="title">状态</text>:
						<!-- 状态:0=已取消,1=待支付,2=已支付,3=异常取消 -->
						<text v-if="item.status==='0'">已取消</text>
						<text v-if="item.status==='1'">待支付</text>
						<text v-if="item.status==='2'">已支付</text>
						<text v-if="item.status==='3'">异常取消</text>
					<!-- 	<text v-if="item.status==='5'">统计完成</text>
						<text v-if="item.status==='6'">异常</text> -->
						</text>
					</view>
				</view>
				<!-- <view class="content"><text><text class="title">活动内容</text>:{{item.activity_intro}}</text></view> -->
				<!-- <view class=""><text>报名开始时间{{item.signup_starttime}}</text></view> -->
				<!-- <view class=""><text>报名结束时间{{item.signup_stoptime}}</text></view> -->
				<view class="top">
					<text v-if="item.status==='2'"><text class="title">下单时间</text>:{{item.ordercrea_time}}</text>
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
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components:{headers,popup},
		data() {
			return {
				token:'',
				list:[],
				offset:1
			};
		},
		mounted() {
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			this.getList();
		},
		methods:{
			async getList(){
				let obj = {token:this.token,offset:this.offset,limit:20};
				let res = await this.$Post('/api/Groundactivity/StoreFishGroupActivityList',obj);
				console.log(res)
				if(res.data.code===1){
					this.list = res.data.data.list;
				}
			},//获取列表
			seeDetail(item){
				uni.navigateTo({
					url:`./detail?id=${item.id}`
				})
				console.log(item)
			},//跳转详情
		}
	}
</script>

<style lang="scss" scoped>
	.noList{
		font-size: 26rpx;
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
				margin-bottom: 15rpx;
			}
			.content{
				font-size: 26rpx;
				margin-bottom: 15rpx;
			}
		}
	}
	
</style>
