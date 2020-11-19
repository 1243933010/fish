<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="粉丝" :leftIcon="true" />
		</view>
		
		<view style="font-size: 26rpx;" v-if="list.length===0"><text>暂无粉丝</text></view>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index" @click="seeFans(item)">
				<image :src="item.avatar" mode=""></image>
				<text>{{item.username}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import popup from '@/components/uni-popup/uni-popup.vue';
	import headers from '@/components/header.vue';
	export default {
		components:{popup,headers},
		data() {
			return {
				userId:'',
				list:[],
				offset:1
			};
		},
		onLoad(e) {
			console.log(e.userid)
			this.userId = e.userid;
			this.getFans();
		},
		// mounted() {
		// 	let {user_id} = uni.getStorageSync('userinfo');
		// 	this.userId = user_id;
		// 	this.getFans();
		// },
		onReachBottom() {
			this.getFans();
		},
		methods:{
			async getFans(){
				uni.showLoading({
					mask:true
				})
				let obj = {userid:this.userId,offset:this.offset,limit:30};
				let res = await this.$Post('/api/Userfriend/CommFansUserList',obj);
				if(res.data.code ===1){
					if(this.offset===1){
						this.list = res.data.data.list;
					}else{
						this.list.push(...res.data.data.list);
					}
				}
				uni.hideLoading();
				console.log(res)
			},//获取粉丝列表
			seeFans(item){
				// console.log(item)
				uni.navigateTo({
					url:`../../club/message/userPage?userid=${item.from_userid}`
				})
			},//跳转个人首页
		}
	}
</script>

<style lang="scss" scoped>
	.list{
		width: 100%;
		box-sizing: border-box;
		padding: 10rpx 20rpx;
		.item{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 30rpx;
			border-bottom: 1px solid #EFEFEF;
			padding: 15rpx 0;
			text{
				font-size: 26rpx;
				width: 550rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			image{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 15rpx;
			}
		}
	}
</style>
