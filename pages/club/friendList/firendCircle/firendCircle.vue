<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="沙龙圈" :leftIcon="true" rightText="发布" @rightClick="rightClick" />
		</view>

		<view class="box">
			<view class="item" v-for="(item,index) in list" :key="index" @click.stop="seeDeatil(item)">
				<view class="name" @click.stop="goUserPage(item)">
					<image :src="item.avatar" mode=""></image>
					<text class="username">{{item.username}}</text>
				</view>
				<view class="content" v-if="item.circle_content"><text>{{item.circle_content}}</text></view>
				<view class="img" v-if="item.circle_images">
					<image v-for="(i,v) in item.imgList" :key="v" :src="i" mode="widthFix"></image>
					<!--  @click.stop="previewImage(item.imgList)" -->

				</view>
				<view class="item_video" v-if="item.circle_video">
					<!--  @click.stop="seeVideo(item)" -->
					<image class="item_bk" :src="item.controimg" mode="widthFix"></image>
					<image  src="../../../../static/club/bofang.png" mode="widthFix" class="img_item"></image>
					<!-- item.controimg -->
				</view>
				<view class="time">
					<text>{{item.create_time}}</text>
					<view class="fn">
						<view class="set_zan">
							<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image> -->
							<image v-if="item.is_like==='0'" @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image>
							<image v-if="item.is_like==='1'" src="../../../../static/club/zan.png" mode="widthFix"></image>
							
							<text>{{item.likenum}}</text>
						</view>
						<view class="pinglun_icon">
							<!-- @click.stop="pinglun(item)" -->
							<image  src="../../../../static/club/pinglun.png" mode="widthFix"></image>
							<text>{{item.reviewnum}}</text>
						</view>
						<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image>
					  <image @click.stop="pinglun(item)" src="../../../../static/club/pinglun.png" mode="widthFix"></image> -->
					</view>
				</view>
				<!-- <view class="btn">
				  <text @click.stop="pinglun(item)">评论</text>
			  </view> -->
				<!-- <view class="">
			  	
			  </view> -->
			</view>
		</view>

		<uni-popup type="bottom" ref="popup">
			<!-- :maskClick="false" -->
			<view class="pox">
				<view @click="goTo(1)">发布视频</view>
				<view @click="goTo(2)">发布图片</view>
			</view>
		</uni-popup>

		<uni-popup type="center" ref="videoPlay" :maskClick="false">
			<view class="video">
				<image src="../../../../static/close.png" mode="widthFix" @click="close"></image>
				<video v-if="videoFlog" :src="videoUrl" objectFit="cover" :poster="controimg" controls></video>
			</view>
		</uni-popup>


		<uni-popup type="bottom" ref="pinglun">
			<view class="pinglun">
				<input type="text" value="" v-model="text" />
				<view class="" @click="pinglunBtn"><text>确定</text></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			headers,
			popup
		},
		data() {
			return {
				tokenL:'',
				userinfo: {},
				circleId: '',
				list: [],
				videoFlog: false,
				text: "",
				statusObj: {
					type: '',
					id: ''
				},
				controimg: '',
				offset:1
			};
		},
		onLoad(e) {
			console.log(e);
			let userinfo = uni.getStorageSync('userinfo');
			if (userinfo) {
				this.userinfo = userinfo;
				this.token = this.userinfo.token;
			}
			this.circleId = e.id;

		},
		onShow() {
			this.list = [];
			this.offset = 1;
			this.getList();
			// this.getVideoList();

		},
		onReachBottom() {
			this.getList();
		},
		methods: {
		
			goUserPage(item) {
				console.log(item)
				uni.navigateTo({
					url: `../../message/userPage?userid=${item.userid}`
				})
			},
			async setZan(item, index) {
				
				let res = await this.$Post('/api/Groundcircle/LikeGroundcircle', {
					token:this.token,
					id: item.id
				});
				this.$Toast(res.data.msg);
				if (res.data.code === 1) {
					this.list.forEach((val, ind) => {
						if (ind === index) {
							val.zan = '../../../../static/club/zan.png';
							val.likenum++;
							console.log(val)
						}
					})
					// this.getList();
					// this.getVideoList();
					this.$forceUpdate();
				}
				// console.log(item);
			}, //设置赞
			previewImage(val) {
				console.log(val)
				// let arr = [];
				// arr.push(val);
				uni.previewImage({
					urls: val
				})
				// console.log(val)
			}, //预览图片
			seeDeatil(item) {
				console.log(item)
				if (item.circle_images) {
					uni.navigateTo({
						url: `./detail?status=image&id=${item.id}`
					})
				} //跳转详情带图文id参数
				if (item.circle_video) {
					uni.navigateTo({
						url: `./detail?status=video&id=${item.id}`
					})
				} //跳转详情带视频id参数

			},
			async pinglunBtn() {
				let obj = {
					token: this.userinfo.token,
					review_content: this.text
				}
				if (this.statusObj.type === 'image') {
					obj.circle_id = this.statusObj.id;

					let res = await this.$Post('/api/Groundcircle/AddCircleReview', obj);
					this.$Toast(res.data.msg);
					if (res.data.code === 1) {
						this.$refs.pinglun.close();
						this.text = '';

						// this.list= [];
						// this.getList();
						// this.getVideoList();
						this.list.forEach((val, ind) => {
							console.log(val.id, this.statusObj.id)
							if (val.id === this.statusObj.id) {
								val.reviewnum++;
							}
						})
						this.statusObj = {};
						this.$forceUpdate();
					}
				} //调取图文评论
				if (this.statusObj.type === 'video') {
					obj.video_id = this.statusObj.id;
					let res = await this.$Post('/api/Groundcircle/AddCircleVideoReview', obj);
					this.$Toast(res.data.msg);
					if (res.data.code === 1) {
						this.$refs.pinglun.close();
						this.text = '';

						this.list.forEach((val, ind) => {
							console.log(val, this.statusObj)
							if (val.id === this.statusObj.id) {
								val.reviewnum++;
							}
						})
						this.statusObj = {};
						this.$forceUpdate();
					}
					console.log(res)
				} //调取视频文接口
			}, //评论按钮
			pinglun(item) {
				this.$refs.pinglun.open();
				if (item.circle_images) {
					this.statusObj.type = 'image';
					this.statusObj.id = item.id;
				} //如果是评论图文
				if (item.circle_video) {
					this.statusObj.type = 'video';
					this.statusObj.id = item.id;
				} //如果是评论视频文字
				// console.log(item,this.statusObj.id)
			}, //打开评论
			seeVideo(item) {
				console.log(item);
				this.videoUrl = item.circle_video;
				this.controimg = item.controimg;
				this.$refs.videoPlay.open();
				this.videoFlog = true;
			}, //查看视频
			close() {
				this.videoFlog = false;
				this.$refs.videoPlay.close();
			}, //关闭弹窗
			rightClick() {
				// this.$refs.popup.open();
				uni.navigateTo({
					url: `./addImage?roomId=${this.circleId}&userid=${this.userinfo.id}`
				})
			},
			async getList() {
				uni.showLoading({
					mask:true
				})
				let obj = {
					token:this.token,
					offset: this.offset,
					limit: 10,
					keyword: '',
					fishground_id: this.circleId,
					// userid: this.userinfo.user_id
				}
				let res = await this.$Post('/api/Groundcircle/ListGroundcircle', obj);
				if (res.data.code === 1) {
					res.data.data.list.forEach((val, ind) => {
						val.imgList = val.circle_images.split(',');
						val.zan = '../../../../static/club/no_zan.png';
					})
					this.list.push(...res.data.data.list);
					this.offset++
				}
				uni.hideLoading();
				// this.getVideoList();
				console.log(res)
			}, //获取朋友圈图片列表信息
			async getVideoList() {
				let obj = {
					token:this.token,
					offset: this.offset,
					limit: 10,
					keyword: '',
					ismy: '1',
					fishground_id: this.circleId,
					// userid: this.userinfo.user_id
				}
				let res = await this.$Post('/api/Groundcircle/ListCircleVideo', obj);
				console.log(res)
				if (res.data.code === 1) {
					res.data.data.list.forEach((val, ind) => {
						val.zan = '../../../../static/club/no_zan.png';
					})
					this.list.push(...res.data.data.list);
				}
				this.offset++
				uni.hideLoading();
			},
			goTo(status) {
				this.$refs.popup.close();
				if (status === 1) {
					uni.navigateTo({
						url: `./addVideo?roomId=${this.circleId}&userid=${this.userinfo.id}`
					})
				} else if (status === 2) {
					uni.navigateTo({
						url: `./addImage?roomId=${this.circleId}&userid=${this.userinfo.id}`
					})
				}
			}, //判断进入
		}
	}
</script>

<style lang="scss" scoped>
	.item_video {
		position: relative;

		.item_bk {
			width: 200rpx;
		}

		.img_item {
			position: absolute;
			top: 50%;
			left: 15%;
			transform: translate(-50%, -50%);
			width: 50rpx;
		}
	}

	.pinglun {
		width: 750rpx;
		background: white;
		box-sizing: border-box;
		padding: 60rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		input {
			width: 80%;
			border: 1px solid #333333;
			margin-bottom: 0rpx;
			padding: 15rpx 0;
			border-radius: 10rpx;
		}

		view {
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #40C2FF;
			color: white;
			padding: 8rpx 30rpx;
			border-radius: 15rpx;
		}
	}

	.top_hr {
		width: 100%;
		height: 160rpx;
	}

	.pox {
		width: 100%;
		background: white;

		view {
			width: 100%;
			text-align: center;
			border-bottom: 1px solid #808080;
			padding: 20rpx 0;
			font-size: 32rpx;
		}
	}

	.box {
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 25rpx;

		.item {
			display: flex;
			flex-direction: column;
			margin-bottom: 30rpx;

			.name {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 20rpx;
				.username{
					width: 400rpx;
					overflow: hidden;
					white-space: normal;
					text-overflow: ellipsis;
					font-size: 26rpx;
				}
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			}

			.content {
				font-size: 28rpx;
				margin-bottom: 25rpx;

				text {
					display: inline-block;
					text-indent: 40rpx;
				}
			}

			.img {
				// width: 280rpx;
				display: flex;
				flex-direction: row;
				// align-items: center;
				flex-wrap: wrap;
				margin-bottom: 25rpx;

				image {
					width: 200rpx;
					margin-right: 25rpx;
					margin-bottom: 20rpx;
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

	.video {
		width: 100%;
		display: flex;
		flex-direction: column;

		image {
			width: 40rpx;
			text-align: right;
			margin-bottom: 60rpx;
			display: flex;
			align-self: flex-end;
			margin-right: 40rpx;
		}

		video {
			width: 750rpx;
		}
	}
</style>
