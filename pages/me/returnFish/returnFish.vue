<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="回鱼" :leftIcon="true" />
		</view>
		<view @click="giveUserFish" class="give">
			<image src="../../../static/me/saoyisao.png" mode="widthFix"></image>
			<text>赠送用户鱼票回鱼</text>
		</view>
		
		<view class="hr"></view>
		<view class="history">
			<view class="title">
				<text>回鱼历史记录</text>
			</view>
			<!--  -->
			<scroll-view scroll-y="true" :style="{height:Height+'px'}">
				<view class="fish_ticket_list">
					<view style="font-size: 26rpx;" v-if="historyList.length===0">暂无数据</view>
				<view class="item" v-for="(item,index) in historyList" :key="index">
					<view class="name"><text>{{item.create_time}}</text></view>
					<view class="status">
						<view class=""><text>价格:{{item.ticketprice}}元</text></view>
						<!-- <view class=""><text>鱼票时限:{{item.ticket_times}}天</text></view> -->
						<!-- <view class="">
							<text>鱼票状态：</text>
							<text v-if="item.ticket_status==='1'" style="color: green;">可购买</text>
							<text v-if="item.ticket_status==='0'" style="color: red;">不可购买</text>
						</view> -->
					</view>
					<view class="intro">
						<text ><text class="intro_text">备注:</text>{{item.remark}}</text>
					</view>
					<!-- <view class="fn">
						<view class="" @click="Edit(item)">编辑鱼票</view>
						<view class="" @click="Delete(item)">删除鱼票</view>
					</view> -->
					<!-- <view class="">赠送鱼票</view> -->
				</view>
				</view>
			</scroll-view>
			<!--  -->
			<!-- <view class="content" v-if="historyList.length>0">
				<view class="item" v-for="(item,index) in historyList" :key="index">
					<view class="msg">
						<text>{{item.ticketprice}}</text>
						<text>{{item.remark}}</text>
					</view>
					<view class="time"><text>{{item.create_time}}</text></view>
				</view>
			</view> -->
			<view class="" v-if="historyList.length===0"><text>暂无记录</text></view>
		</view>
		
		
		 <uni-popup type="center" ref="give">
			 <view class="box">
			 	<view class="user">
					<image :src="userObj.avatar" mode="widthFix"></image>
					<text>回鱼给<text style="color: #52D2F6;">{{userObj.username}}</text></text>
				</view>
				<view class="inp">
					<input type="text" value="" v-model="price"  placeholder="输入价格"/>
				</view>
				<view class="inp">
					<input type="password" value="" v-model="pwd"  placeholder="输入密码"/>
				</view>
				<view class="btn" @click="giveFish">
					<text>确认</text>
				</view>
			 </view>
	     </uni-popup>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components:{headers,popup},
		data() {
			return {
				userObj:{},
				price:'',
				pwd:'',
				historyList:[],
				Height:null
			};
		},
		mounted() {
			uni.getSystemInfo({
				success: (data) => {
					this.Height = data.windowHeight -210;
					console.log(data.windowHeight)
				}
			})
		},
		onShow() {
			this.getHistoryList();
			
		},
		methods:{
			giveUserFish(){
				// this.userObj = {"userid":9,"username":"test2","avatar":"http://47.95.39.75:9706/assets/img/avatar.png"}

				uni.scanCode({
				    onlyFromCamera: true,
					scanType:['qrCode'],
				    success: (res)=> {
						this.userObj = JSON.parse(res.result);
						this.$refs.give.open();
				    }
				});
			},//扫码打开赠送弹窗
			async giveFish(){
				if(!this.price){
					this.$Toast('请输入价格');
					return
				}
				if(!this.pwd){
					this.$Toast('请输入密码');
					return
				}
				let {token} = uni.getStorageSync('userinfo');
				let obj = {
					token,
					userid:this.userObj.userid,
					ticketprice:this.price,
					ticket_pwd:this.pwd
				}
				let res = await this.$Post('/api/Groundticket/SendGroundticketUser',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.price = '';
					this.pwd = '';
					this.$refs.give.close();
					this.getHistoryList();
				}
			},//确认赠送
			async getHistoryList(){
				let {token} = uni.getStorageSync('userinfo');
				let obj = {token,offset:1,limit:20};
				let res = await this.$Post('/api/Groundticket/GroundticketUserlist',obj);
				if(res.data.code===1){
					this.historyList = res.data.data.list;
				}
				// console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.give{
		width: 85%;
		margin: 20rpx auto;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #69CFFF;
		border-radius: 10rpx;
		padding: 25rpx 0;
		font-size: 26rpx;
		color: white;
		image{
			width: 30rpx;
			margin-right: 15rpx;
			margin-right: 20rpx;
		}
	}
	.hr{
		width: 100%;
		height: 10rpx;
		background: #F9F9F9;
		margin: 20rpx 0;
	}
	.history{
		.title{
			padding-left: 20rpx;
			font-size: 30rpx;
			color: #999999;
		}
	}
	.fish_ticket_list{
		width: 95%;
		margin:  30rpx auto;
	}
	.box{
		width: 700rpx;
		background: white;
		box-sizing: border-box;
		padding: 40rpx 15rpx;
		border-radius: 15rpx;
		.user{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 30rpx;
			margin-bottom: 15rpx;
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 15rpx;
			}
		}
		.inp{
			border: 1px solid #999999;
			margin-bottom: 35rpx;
			border-radius: 10rpx;
			padding: 15rpx 0;
			
			input{
				width: 100%;
				text-indent: 15rpx;
				font-size: 26rpx;
				color: #999999;
				// border-bottom: 1px solid #333333;
			}
		}
		.btn{
			width: 60%;
			margin: 20rpx auto;
			background: #52D2F6;
			text-align: center;
			font-size: 26rpx;
			color: white;
			padding: 15rpx 0;
			border-radius: 10rpx;
		}
	}
	
	.item{
		background: #CBEEFF;
		margin-bottom: 20rpx;
		border-radius: 15rpx;
		box-sizing: border-box;
		padding: 20rpx;
		.name{
			font-size: 30rpx;
			color: #333333;
			margin-bottom: 15rpx;
		}
		.status{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			view{
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #333333;
				font-size: 26rpx;
			}
		}
		.intro{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 30rpx;
			text{
				font-size: 26rpx;
			}
			.intro_text{
				color: #333333;
				font-size: 26rpx;
				font-weight: 600;
			}
		}
		.fn{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			view{
				background: #69CFFF;
				color: white;
				font-size: 26rpx;
				border-radius: 10rpx;
				box-sizing: border-box;
				padding: 10rpx 20rpx;
			}
		}
	}
</style>
