<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="我的参与" :leftIcon="true" />
		</view>
		
		<!-- <view class="list">
			<view class="item" v-for="(item,index) in list" :key="index"  @click="seeDetail(item)">
				<view class=""><text>活动标题{{item.activity_name}}</text></view>
				<view class=""><text>活动内容{{item.activity_intro}}</text></view>
				<view class=""><text>报名开始时间{{item.signup_starttime}}</text></view>
				<view class=""><text>报名结束时间{{item.signup_stoptime}}</text></view>
				<view class=""><text>比赛时间{{item.pt_starttime}}</text></view>
				<view class=""><text>比赛人数{{item.pt_number}}</text></view>
				<view class=""><text>最低参赛人数{{item.lowpt_number}}</text></view>
				<view class=""><text>报名费用{{item.registery_fee}}</text></view>
				<view class=""><text>联系人电话{{item.phone_num}}</text></view>
				<view class="">
					<text>状态
					<text v-if="item.status==='0'">已取消</text>
					<text v-if="item.status==='1'">待支付</text>
					<text v-if="item.status==='2'">已支付</text>
					<text v-if="item.status==='3'">异常取消</text>
					</text>
				</view>
				<view class="">
					<text>比赛类型
				     <text v-if="item.activity_type==='1'">团体</text>
					 <text v-if="item.activity_type==='2'">掐鱼</text>
				  </text>
				</view>
				
			</view>
		</view> -->
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
						<!-- <text v-if="item.status==='0'">已取消</text>
						<text v-if="item.status==='1'">待支付</text>
						<text v-if="item.status==='2'">已支付</text>
						<text v-if="item.status==='3'">异常取消</text> -->
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
		
		<uni-popup type="center" ref="popup">
			<view class="box">
				<view class="inp">
					<text>填写分数</text>
					<input type="text"   v-model="num"/>
				</view>
				<view class="btn" @click="btn"><text>确定</text></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{headers,popup,wPicker},
		data() {
			return {
				token:'',
				list:[],
				id:'',
				num:'',
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
				uni.showLoading({
					mask:true
				})
				let obj = {token:this.token,offset:this.offset,limit:10};
				let res = await this.$Post('/api/Groundactivity/UserFishGroupActivityList',obj);
				if(res.data.code===1){
					if(this.offset===1){
						this.list = res.data.data.list;
					}else{
						this.list.push(...res.data.data.list);
					}
					this.offset++;
				}
				uni.hideLoading();
			},//获取参与列表
			async report(item){
				this.id = item.activityid;
				this.$refs.popup.open();
				console.log(item)
			},//上报成绩弹窗
			async btn(){
				let obj = {token:this.token,activityid:this.id,grades:this.num};
				let res = await this.$Post('/api/Groundactivity/UpActivityUserGrades',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.$refs.popup.close();
				}
			},//上报成绩
			seeDetail(item){
				console.log(item)
				uni.navigateTo({
					url:`./pinchFishDetail?id=${item.activityid}&flog=canyu`
				})
				
			},//去详情页面
		}
	}
</script>

<style lang="scss" scoped>
	.item{
		margin-bottom: 50rpx;
	}
	.box{
		background: white;
		border-radius: 15rpx;
		width: 700rpx;
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
</style>
