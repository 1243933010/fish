<template>
	<view>
		<headers title="即时分享" :leftIcon="true" />
		<view class="tab">
			<view class="item" @click="choose(0)">
				<text :class="[ind===0?'active':'']">最新</text>
			</view>
			<view class="item" @click="choose(1)">
				<text :class="[ind===1?'active':'']">推荐</text>
			</view>
			
		</view>

		<view class="swiper_con">
			<swiper class="swiper" 
			:indicator-dots="false" 
			:autoplay="false"  
			:duration="500"
			@change="change"
			:current="current"
			:style="{height:Height+'px'}">
				<swiper-item>
					<scroll-view :style="{height:Height+'px'}" scroll-y="true" @scrolltolower="scrolltolower">
						
							<view class="pox" v-show="ind===0">
								<view class="swiper_item" 
								v-for="(item,index) in list" 
								:key="index"
								@click="goRecommend(item)">
									<image class="bk" :src="item.controimg" mode="widthFix"></image>
									<view class="msg">
										<view class="title">
											<!-- <text>{{item.circle_content}}</text> -->
										</view>
										<view class="num">
											<view class="see">
												<image src="../../static/index/view.png" mode="widthFix"></image>
											    <text>{{item.catnum}}</text>
											</view>
											<view class="zan">
												<image src="../../static/index/praise.png" mode="widthFix"></image>
											    <text>{{item.likenum}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view :style="{height:Height+'px'}" scroll-y="true"  @scrolltolower="scrolltolower">
						<view class="pox" v-show="ind===1">
							<view class="swiper_item" 
							v-for="(item,index) in list" 
							:key="index"
							@click="goRecommend(item)">
								<image class="bk" :src="item.controimg" mode="widthFix"></image>
								<view class="msg">
									<view class="title">
										<!-- <text>{{item.circle_content}}</text> -->
									</view>
									<view class="num">
										<view class="see">
											<image src="../../static/index/view.png" mode="widthFix"></image>
										    <text>{{item.catnum}}</text>
										</view>
										<view class="zan">
											<image src="../../static/index/praise.png" mode="widthFix"></image>
										    <text>{{item.likenum}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		
		
		<view class="posi" >
			<image @click="goTo" src="../../static/index/add.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue'
	export default {
		components: {
			headers
		},
		data() {
			return {
				ind: 0,
				current:0,
				Height:'',
				offset:1,
				roomId:'',
				list:[]
			};
		},
		mounted() {
			uni.getSystemInfo({
			    success: (res)=> {
					this.Height = res.windowHeight-80-50;
			    }
			});
		},
		onLoad(e) {
			this.roomId = e.roomId;
			this.getList();
		},
		methods: {
			goRecommend(item){
				let videoMsg = {type:this.ind,list:this.list,id:item.id};
				getApp().globalData.shareVideoMsg = videoMsg;
				uni.navigateTo({
					url:`./shareVideoDetail?roomId=${this.roomId}`
				})
				// console.log(getApp().globalData.videoMsg)
			},//选择某个视频保存信息并跳转
			scrolltolower(){
				this.getList();
			},//滚动到底部
			choose(num) {
				this.ind = num;
				this.current = num;
				// this.offset = 1;
				// this.list=[];
				// this.getList();
			},
			change(e){
				this.ind = e.detail.current;
				this.offset = 1;
				this.list=[];
				this.getList();
				uni.pageScrollTo({
					scrollTop:0
				})
			},
			async getList(){
				uni.showLoading({
					mask:true
				})
				
				let obj = {ismy:'1',offset:this.offset,limit:10,keyword:'',fishground_id:this.roomId,token:'',isrecommend:this.ind}
			    let res = await this.$Post('/api/Groundcircle/ListCircleVideo',obj);
				if(res.data.code===1){
					if(this.offset===1){
						console.log(this.offset)
						this.list = res.data.data.list;
					}else{
						this.list.push(...res.data.data.list);
					}
					this.offset++
				}
				uni.hideLoading();
				console.log(res)
			},
			goTo(){
				uni.navigateTo({
					url:`./friendList/firendCircle/addVideo?roomId=${this.roomId}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.posi{
		position: fixed;
		right: 40rpx;
		bottom: 200rpx;
		image{
			width: 100rpx;
		}
	}
	uni-swiper-item{
		// width: 98% !important;
	}
	.swiper_con{
		// background: green;
		width: 100%;
		box-sizing: border-box;
		padding:0  20rpx;
	}
	// swiper-item{
	// 	margin-right: 15rpx;
	// }
	.swiper_item{
		width: 48%;
		height: 600rpx;
		background: black;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		// height: 500rpx;
		position: relative;
		margin-bottom: 40rpx;
		border-radius: 15rpx;
		.bk{
			width: 100%;
			border-radius: 15rpx;
		}
		.msg{
			width: 100%;
			position: absolute;
			bottom: 0rpx;
			background: rgba(0,0,0,0.5);
			box-sizing: border-box;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			color: white;
			border-bottom-left-radius: 15rpx;
			border-bottom-right-radius: 15rpx;
			.title{
				font-size: 28rpx;
				margin-bottom: 10rpx;
			}
			.num{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.see,.zan{
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 26rpx;
					image{
						width: 35rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
	.pox{
		width: 98%;
		margin: 0 auto;
		display: flex;
		// flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;
		padding:20rpx  0rpx;
	}
	.swiper{
		overflow-y: scroll;
	}
	.tab {
		width: 40%;
		margin: 0 auto;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26rpx;
		color: #333333;

		.item {
			width: 50%;
			text-align: center;
		}
	}

	.active {
		color: #FD1849 !important;
		border-bottom: 2px solid #FD1849;
	}
</style>
