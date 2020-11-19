<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="关注" :leftIcon="true" />
		</view>
		<view style="font-size: 26rpx;" v-if="list.length===0"><text>暂无关注得人</text></view>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="icon">
					<image :src="item.avatar" mode=""></image>
					<text>{{item.username}}</text>
				</view>
				<!-- <view class="unAttention" @click="unAttention(item)">
					<image src="../../static/me/guanzhu.png" mode="widthFix"></image>
					<text>已关注</text>
				</view> -->
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
				token:'',
				userId:'',
				list:[],
				offset:1,
				// peopleId:''
			};
		},
		onLoad(e) {
			console.log(e.userid)
			this.userId = e.userid;
			this.getFans();
		},
		onReachBottom() {
			this.getFans();
		},
		methods:{
			async getFans(){
				uni.showLoading({
					mask:true
				})
				let obj = {userid:this.userId,offset:this.offset,limit:30};
				let res = await this.$Post('/api/Userfriend/CommAttentionUserList',obj);
				if(res.data.code ===1){
					if(this.offset===1){
						this.list = res.data.data.list;
						console.log('111')
					}else{
						console.log('222')
						this.list.push(...res.data.data.list);
					}
					console.log(res.data.data.list)
					this.$forceUpdate();
					this.offset++;
				}
				uni.hideLoading();
				console.log(res)
			},//获取列表
			async unAttention(item){
				let obj = {token:this.token,userid:item.to_userid};
				let res = await this.$Post('/api/Userfriend/DelAttentionUser',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.offset=1;
					setTimeout(()=>{
						this.getFans();
					},500)
					// this.$forceUpdate();
				}
				console.log(item)
			},//取消关注
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
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			border-bottom: 1px solid #EFEFEF;
			padding: 15rpx 0;
			.icon{
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 26rpx;
				text{
					width: 350rpx;
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
			.unAttention{
				// background: red;
				color: #51D1F5;
				font-size: 26rpx;
				border-radius: 10rpx;
				box-sizing: border-box;
				padding: 10rpx 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				image{
					width: 40rpx;
				}
			}
		}
	}
</style>
