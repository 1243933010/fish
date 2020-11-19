<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="视频列表"  :leftIcon="true"/>
		</view>
		<view class="boxx">
			<view class="item" v-for="(item,index) in videoTextList" :key="index" @click.stop="seeDeatil(item,'video')">
				<!-- <view class="name">
					<image :src="item.avatar" mode=""></image>
					<text class="username">{{item.username}}</text>
				</view> -->
				<!-- <view class="content" v-if="item.circle_content"><text>{{item.circle_content}}</text></view> -->
				<!-- <view class="img" v-if="item.circle_images">
					<image v-for="(i,v) in item.imgList" :src="i" mode="widthFix"></image>
				</view> -->
				<!-- <text style="font-size: 26rpx;margin-bottom: 15rpx;">{{item.time}}</text> -->
				<view class="item_video" v-if="item.circle_video">
					<image class="item_bk"  :src="item.controimg" mode="widthFix"></image>
					<image  src="../../static/club/bofang.png" mode="widthFix" class="img_item"></image>
					<!-- item.controimg -->
				</view>
				<!-- <view class="time">
					<text>{{item.create_time}}</text>
					<view class="fn">
						<view class="set_zan">
							
							<image v-if="item.is_like==='0'"  :src="item.zan" mode="widthFix"></image>
							<image v-if="item.is_like==='1'" src="../../static/club/zan.png" mode="widthFix"></image>
							
							<text>{{item.likenum}}</text>
						</view>
						<view class="pinglun_icon">
							<image  src="../../static/club/pinglun.png" mode="widthFix"></image>
							<text>{{item.reviewnum}}</text>
						</view>
						
					</view>
				</view> -->
				<!-- <view class="btn">
				  <text @click.stop="pinglun(item)">评论</text>
			  </view> -->
				<!-- <view class="">
			  	
			  </view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	export default {
		components: {
			headers
		},
		data() {
			return {
				token:'',
				videoTextList:[],
				offset:1,
				peopleId:''
			};
		},
		onLoad(e) {
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			this.peopleId = e.userid;
			this.getVideoMsg();
		},
		onReachBottom() {
			this.getVideoMsg();
		},
		methods:{
			async getVideoMsg(){
				let obj = {ismy:'1',offset:this.offset,limit:20,keyword:'',fishground_id:'',token:'',isrecommend:'',userid:this.peopleId};
				let res = await this.$Post('/api/Groundcircle/ListCircleVideo',obj);
				if(res.data.code===1){
					res.data.data.list.forEach((val,ind)=>{
						// val.imgList = val.circle_images.split(',');
						val.zan = '../../static/club/no_zan.png';
						let time = val.create_time.split(' ');
						// console.log(time[0])
						val.time = time[0];
					})
					if(this.offset===1){
						this.videoTextList = res.data.data.list;
					}else{
						this.videoTextList.push(... res.data.data.list);
					}
					this.offset++
				}
				console.log(res)
			},
			seeDeatil(item){
				uni.navigateTo({
					url:`../me/userPage/videoPage?url=${item.circle_video}`
				})
				console.log(item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item_video {
			position: relative;
			background: black;
			width: 200rpx;
			height: 500rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 15rpx;
			.item_bk {
				width: 200rpx;
			}
		
			.img_item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 50rpx;
			}
		}
	.tab_top{
			width: 100%;
			height: 80rpx;
			// background: red;
			// margin-bottom: 30rpx;
		}
		.tabTab{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			margin-bottom: 20rpx;
			position: fixed;
			top: 160rpx;
			z-index: 100;
			.item{
				width: 50%;
				height: 100%;
				text-align: center;
				background: #FAFAFA;
				color: #999999;
				font-size: 26rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.active{
			background: #00ACFF !important;
			color: white !important;
		}
		
		.box {
			width: 100%;
			box-sizing: border-box;
			padding: 0rpx 25rpx;
		
			.item {
				display: flex;
				flex-direction: column;
				margin-bottom: 30rpx;
		
				.name {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-bottom: 20rpx;
		
					image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						margin-right: 15rpx;
					}
					.username{
						width: 250rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 26rpx;
					}
				}
		
				.content {
					font-size: 28rpx;
					margin-bottom: 25rpx;
		
					text {
						display: inline-block;
						text-indent: 40rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						overflow: hidden;
					}
				}
		
				.img {
					// width: 280rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-wrap: wrap;
					margin-bottom: 25rpx;
					image {
						width:200rpx;
						margin-right: 25rpx;
						margin-bottom: 15rpx;
					}
				}
		
				.btn {
					width: 100%;
					display: flex;
					flex-direction: row-reverse;
					align-items: center;
				}
		
				.time {
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #666666;
					font-size: 27rpx;
		
					.fn {
						display: flex;
						flex-direction: row;
						align-items: center;
		
						.set_zan,
						.pinglun_icon {
							display: flex;
							flex-direction: row;
							align-items: center;
		
							image {
								width: 35rpx;
								margin: 0 10rpx;
							}
						}
		
					}
				}
			}
		}
.boxx {
		width: 100%;
		box-sizing: border-box;
		padding: 50rpx 25rpx;
		display: flex;
		flex-direction: row;
		// justify-content: center;
		// align-items: center;
		flex-wrap: wrap;
		.item {
			width: 30%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			// align-items: center;
			// margin-bottom: 30rpx;
			margin: 20rpx 10rpx;
			.name {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 20rpx;
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
				.username{
					width: 250rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 26rpx;
				}
			}
	
			.content {
				font-size: 28rpx;
				margin-bottom: 25rpx;
	
				text {
					display: inline-block;
					text-indent: 40rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					overflow: hidden;
				}
			}
	
			.img {
				// width: 280rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				flex-wrap: wrap;
				margin-bottom: 25rpx;
				image {
					width:200rpx;
					margin-right: 25rpx;
					margin-bottom: 15rpx;
				}
			}
	
			.btn {
				width: 100%;
				display: flex;
				flex-direction: row-reverse;
				align-items: center;
			}
	
			.time {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #666666;
				font-size: 27rpx;
	
				.fn {
					display: flex;
					flex-direction: row;
					align-items: center;
	
					.set_zan,
					.pinglun_icon {
						display: flex;
						flex-direction: row;
						align-items: center;
	
						image {
							width: 35rpx;
							margin: 0 10rpx;
						}
					}
	
				}
			}
		}
	}
</style>
