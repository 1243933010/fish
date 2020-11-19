<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="订单详情" :leftIcon="true" />
		</view>
		
		<view class="detail">
			<view class="top">
				<text>{{Obj.activity_name}}</text>
				<view class="">
					<text>状态:
					<text v-if="Obj.status==='0'">已取消</text>
					<text v-if="Obj.status==='1'">待支付</text>
					<text v-if="Obj.status==='2'">已支付</text>
					<text v-if="Obj.status==='3'">异常取消</text>
					<!-- <text v-if="Obj.status==='1'">待发布</text>
					<text v-if="Obj.status==='2'">已发布</text>
					<text v-if="Obj.status==='3'">比赛中</text>
					<text v-if="Obj.status==='4'">结束中</text>
					<text v-if="Obj.status==='5'">赛事完成</text>
					<text v-if="Obj.status==='6'">异常</text> -->
					</text>
				</view>
			</view>
			<view class="content"><text><text class="title">活动内容</text>:{{Obj.activity_intro}}</text></view>
			<view class="time"><text><text class="title">报名开始时间</text> :{{Obj.signup_starttime}}</text></view>
			<view class="time"><text><text class="title">报名结束时间</text>:{{Obj.signup_stoptime}}</text></view>
			<view class="time">
				<text><text class="title">比赛时间</text>:{{Obj.pt_starttime}}</text>
				<view class="">
					<text><text class="title">比赛类型</text>:
				     <text v-if="Obj.activity_type==='1'">团体</text>
					 <text v-if="Obj.activity_type==='2'">掐鱼</text>
				  </text>
				</view>
			</view>
			<view class="peoplel">
				<text><text class="title">比赛人数</text>:{{Obj.pt_number}}人</text>
				<text><text class="title">最低参赛人数</text>:{{Obj.lowpt_number}}人</text>
			</view>
			<view class="time">
				<text><text class="title">报名费用</text>:{{Obj.registery_fee}}</text>
				<text><text class="title">联系人电话</text>:{{Obj.phone_num}}</text>
			</view>
		</view>
		
		<view class="people">
			<text class="title">已参与人数</text>
			<view class="item" v-for="(item,index) in Obj.userlist" :key="index">
				<view class="user">
					<image :src="item.avatar" mode="widthFix"></image>
					<text>{{item.username}}</text>
				</view>
				<view class=""  
				v-if="Obj.status==='4'"
				 @click="enterRank(item)"><text>输入成绩</text></view>
			</view>
		</view>
		
	
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
				userinfo:{},
				id:'',
				Obj:{}
			};
		},
		onLoad(e) {
			let {token} = uni.getStorageSync('userinfo');
			this.userinfo = uni.getStorageSync('userinfo');
			this.token = token;
			console.log(e)
			this.id = e.id;
			this.getMsg(e.id);
		},
		methods:{
		
			async getMsg(activityid){
				let res = await this.$Post('/api/Groundactivity/StoreFishGroupActivityInfo',{token:this.token,id:activityid});
				if(res.data.code===1){
					this.Obj = res.data.data;
					// console.log(this.Obj,this.userinfo)
					if(this.Obj.status==='5'){this.rightText='排行'}
				}else{
					this.$Toast(res.data.msg);
				}
				console.log(res)
			},//获取详情
		}
	}
</script>

<style lang="scss" scoped>
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
