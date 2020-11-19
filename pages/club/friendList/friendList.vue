<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="好友列表" :leftIcon="true"  rightText="添加" @rightClick="rightClick"/>
		</view>
		
		
		<view class="firendList">
			<view class="new_firend" @click="notice">
				<view class="icon">
					<image src="../../../static/club/new_friend.png" mode="widthFix"></image>
					<text>新的好友</text>
				</view>
				<text class="num" :class="[noticeNum>0?'active':'']">{{noticeNum}}</text>
			</view>
			<view class="firend_box">
				<view class="item" 
				v-for="(item,index) in firendList" 
				:key="index"
				@click="goRoom(item)">
					<view class="user">
						<image v-if="item.avatar" :src="item.avatar" mode=""></image>
						<image v-if="!item.avatar" src="../../../static/logo.png" mode="widthFix"></image>
						<text class="username">{{item.username}}</text>
						<view class="status">
							<text v-if="item.online==='1'">（在线）</text>
							<text  v-if="item.online==='0'">（离线）</text>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		
		
			
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	export default {
		components:{headers},
		data() {
			return {
				userinfo:{},
				firendList:[],
				noticeNum:0,
				time:null,
				offset:1
			};
		},
		onShow() {
			this.offset = 1;
			clearInterval(this.time);
			this.time=null;
			let userinfo = uni.getStorageSync('userinfo');
			if(userinfo){
				this.userinfo = userinfo;
				console.log(userinfo)
				this.getFirendList();
				this.userNotice();
			}
			// this.time = setInterval(()=>{
				// this.userNotice();
				// this.getFirendList();
			// },10000)
		},
		onUnload() {
			console.log('1111')
			clearInterval(this.time);
			this.time = null;
		},
		methods:{
			rightClick(){
				// this.$refs.popup.open();
				uni.navigateTo({
					url:'./addFirend'
				})
			},//添加好友
			async getFirendList(){
				uni.showLoading({
					mask:true
				})
				let obj = {
					token:this.userinfo.token,
					offset:this.offset,
					limit:10
				}
				// console.log(obj)
				let res = await this.$Post('/api/Userfriend/firendlist',obj);
				console.log(res); 
				if(res.data.code===1){
					if(this.offset===1){
						this.firendList=res.data.data.list;
					}else{
						this.firendList.push(...res.data.data.list);
					}
					this.offset++;
				}
				uni.hideLoading();
			},//好友列表
			async userNotice(){
				let obj = {
					token:this.userinfo.token,
					offset:1,
					limit:100
				}
				let res = await this.$Post('/api/Userfriend/usernotice',obj);
				let num = 0;
				if(res.data.code===1){
					if(res.data.data.list.length>0){
						res.data.data.list.forEach((val,ind)=>{
							if(val.status==='1'){
								num++;
							}
						})
					}
					this.noticeNum = num;
				}
			},//好友请求数量
			notice(){
				uni.navigateTo({
					url:'./noticeList'
				})
			},//申请页面
			goRoom(item){
				uni.navigateTo({
					url:`./firendPage?data=${JSON.stringify(item)}`
				})
				console.log(item)
			},//好友一对一聊天
		}
	}
</script>

<style lang="scss" scoped>
	.active{
		width: 50rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: red;
		border-radius: 50%;
		color: white;
	}
.top_hr{
		width: 100%;
		height: 160rpx;
	}
	.firendList{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 0rpx;
		.new_firend{
			box-sizing: border-box;
			padding: 0 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 4px solid #F0F0F0;
			margin-bottom: 20rpx;
		    padding-bottom: 20rpx;
			.icon{
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 30rpx;
				color: #343434;
				image{
					width: 80rpx;
					margin-right: 15rpx;
				}
			}
		}
		.firend_box{
			width: 100%;
			.item{
				width: 100%;
				margin: 15rpx auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 3px solid #F0F0F0;
				box-sizing: border-box;
				padding: 20rpx 20rpx;
				.user{
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 30rpx;
					.username{
						width: 150rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					image{
						width: 75rpx;
						height: 75rpx;
						border-radius: 50%;
						margin-right: 15rpx;
					}
					.status{
						font-size: 26rpx;
						color: #9A9A9A;
					}
				}
			}
		}
	}
</style>
