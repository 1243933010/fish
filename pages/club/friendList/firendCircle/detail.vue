<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="说说详情" :leftIcon="true" />
		</view>
		
		<view class="" v-if="status==='image'">
			<view class="box">
				<view class="user_icon">
					<image :src="obj.avatar" mode=""></image>
					<text>{{obj.username}}</text>
				</view>
				<view class="content">
					<view class="msg">
						<text>{{obj.circle_content}}</text>
						<view class="msg_img">
							<image v-for="(item,index) in obj.imgList" @click="seeImg(index)" :src="item" mode="widthFix"></image>
						</view>
					</view>
					<view class="bottom">
						<view class="time"><text>{{obj.create_time}}</text></view>
						<view class="fn">
							<view class="set_zan">
								<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image> -->
								<image v-if="obj.is_like==='0'" @click.stop="setZan(obj)" :src="obj.zan" mode="widthFix"></image>
								<image v-if="obj.is_like==='1'" src="../../../../static/club/zan.png" mode="widthFix"></image>
								
								<text>{{obj.likenum}}</text>
							</view>
							<view class="pinglun_icon">
								<image @click="pinglun(obj)" src="../../../../static/club/pinglun.png" mode="widthFix"></image>
								<text>{{obj.reviewnum}}</text>
							</view>
							<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image>
						  <image @click.stop="pinglun(item)" src="../../../../static/club/pinglun.png" mode="widthFix"></image> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="" v-if="status==='video'">
			<view class="box">
				<view class="user_icon">
					<image :src="obj.avatar" mode="widthFix"></image>
					<text>{{obj.username}}</text>
				</view>
				<view class="content">
					<view class="msg">
						<text>{{obj.circle_content}}</text>
						<view class="video" @click="seeVideo">
							<image class="poster" :src="obj.controimg" mode="scaleToFill"></image>
							<image src="../../../../static/index/video_play.png" mode="widthFix" class="play_video"></image>
						</view>
						<!-- <video objectFit="cover" :poster="obj.controimg" :src="obj.circle_video" controls></video> -->
					</view>
					<view class="bottom">
						<view class="time"><text>{{obj.create_time}}</text></view>
						<view class="fn">
							<view class="set_zan">
								<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image> -->
								<image v-if="obj.is_like==='0'" @click.stop="setZan(obj)" :src="obj.zan" mode="widthFix"></image>
								<image v-if="obj.is_like==='1'" src="../../../../static/club/zan.png" mode="widthFix"></image>
								
								<text>{{obj.likenum}}</text>
							</view>
							<view class="pinglun_icon">
								<image @click="pinglun(obj)" src="../../../../static/club/pinglun.png" mode="widthFix"></image>
								<text>{{obj.reviewnum}}</text>
							</view>
							<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image>
						  <image @click.stop="pinglun(item)" src="../../../../static/club/pinglun.png" mode="widthFix"></image> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="pinglun_box" v-if="list.length>0">
		<scroll-view scroll-y="true" style="height: 500rpx;">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="oo">
					<view class="user_icon">
						<!-- <image :src="item.avatar" mode="widthFix"></image> -->
						<text>{{item.username}}:</text>
					</view>
					<view class="msg">
						<text>{{item.review_content}}</text>
						
					</view>
				</view>
				<!-- <view class="time"><text>{{item.create_time}}</text></view> -->
			</view>
		</scroll-view>
			
		</view>
		
		
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
		components:{headers,popup},
		data() {
			return {
				token:'',
				status:'',
				obj:{
					
				},
				list:[],
				text:''
			};
		},
		onLoad(e) {
			console.log(e);
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			this.getMsg(e.status,e.id);
			this.getList(e.status,e.id);
			this.status = e.status;
		},
		methods:{
			seeVideo(){
				uni.navigateTo({
					url:`../../../me/userPage/videoPage?url=${this.obj.circle_video}`
				})
				// // this.$refs.video.open();
				// this.flog = true;
				// setTimeout(()=>{
				// 	this.$refs.video.open();
				// 	// this.flog = true;
				// },0)
			},//预览视频
			pinglun(obj) {
				console.log(obj)
				this.$refs.pinglun.open();
			}, //打开评论
			async pinglunBtn() {
				let obj = {
					token: this.token,
					review_content: this.text
				}
				if (this.status === 'image') {
					obj.circle_id = this.obj.id;
					let res = await this.$Post('/api/Groundcircle/AddCircleReview', obj);
					this.$Toast(res.data.msg);
					if (res.data.code === 1) {
						this.$refs.pinglun.close();
						this.text = '';
			            this.getList(this.status,this.obj.id);
					}
				} //调取图文评论
				if (this.status === 'video') {
					obj.video_id = this.obj.id;
					let res = await this.$Post('/api/Groundcircle/AddCircleVideoReview', obj);
					this.$Toast(res.data.msg);
					if (res.data.code === 1) {
						this.$refs.pinglun.close();
						this.text = '';
						this.getList(this.status,this.obj.id);
					}
					console.log(res)
				} //调取视频文接口
			}, //评论按钮
			async setZan(obj) {
				let res = await this.$Post('/api/Groundcircle/LikeGroundcircle', {
					token:this.token,
					id: obj.id
				});
				this.$Toast(res.data.msg);
				if (res.data.code === 1) {
					this.getMsg(this.status,this.obj.id);
				}
			}, //设置赞
			
			seeImg(index){
				uni.previewImage({
					urls:this.obj.imgList,
					current:index
				})
			},//预览图片
			async getMsg(status,id){
				if(status==='image'){
					let obj = {id,token:this.token};
					let res = await this.$Post('/api/Groundcircle/Groundcircleinfo',obj);
					if(res.data.code===1){
						this.obj = res.data.data;
						this.obj.imgList = res.data.data.circle_images.split(',');
						this.obj.zan = '../../../../static/club/no_zan.png';
					}
					// console.log(res.data.data.circle_images)
				}//获取图文详情
				if(status==='video'){
					let obj = {id,token:this.token};
					let res = await this.$Post('/api/Groundcircle/CircleVideoinfo',obj);
					if(res.data.code===1){
						this.obj = res.data.data;  
						this.obj.zan = '../../../../static/club/no_zan.png';
					}
					console.log(res);
				}
			},
			async getList(status,id){
				if(status==='image'){
					let obj = {circle_id:id,offset:1,limit:50};
					let res = await this.$Post('/api/Groundcircle/ListCircleReview',obj);
					if(res.data.code===1){
						this.list = res.data.data.list;
					}
					console.log(res)
				}//获取图文评论列表
				if(status==='video'){
					let obj = {video_id:id,offset:1,limit:50};
					let res = await this.$Post('/api/Groundcircle/ListCircleVideoReview',obj);
					if(res.data.code===1){
						this.list = res.data.data.list;
					}
					console.log(res)
				}//获取图文评论列表
			}
		}
	}
</script>

<style lang="scss" scoped>
	.video{
		position: relative;
		width: 40%;
		.poster{
			width: 100% !important;
		}
		.play_video{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 60rpx !important;
		}
	}
	.msg_img{
		display: flex;
		// justify-content: center;
		flex-direction: row;
		flex-wrap: wrap;
		padding-left: 40rpx;
		image{
			margin-right: 15rpx;
			margin-bottom: 15rpx;
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
.top_hr{
		width: 100%;
		height: 160rpx;
	}
	
	.box{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		.user_icon{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-right: 50rpx;
			margin-bottom: 20rpx;
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 15rpx;
			}
		}
		.content{
			width: 100%;
			display: flex;
			flex-direction: column;
			.msg{
				display: flex;
				flex-direction: column;
				margin-bottom: 20rpx;
				text{
					font-size: 26rpx;
					color: #333333;
					margin-bottom: 20rpx;
					text-indent: 15rpx;
				}
				image{
					width: 200rpx;
				}
				video{
					width: 400rpx;
					height: 400rpx;
				}
			}
			.bottom{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.time{
					// width: 100%;
					// text-align: right;
					font-size: 28rpx;
				}
			}
			
		}
	}
	
	.pinglun_box{
		width: 90%;
		margin: 0 auto;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		background: #F0F0F0;
		.item{
			width: 100%;
			display: flex;
			flex-direction: column;
			margin-bottom: 20rpx;
			// align-items: flex-start;
			.oo{
				display: flex;
				flex-direction: row;
				// align-items: center;
			}
			.user_icon{
				display: flex;
				flex-direction: row;
				// align-items: center;
				font-size: 30rpx;
				margin-right: 20rpx;
				image{
					width: 100rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			}
			.msg{
				display: flex;
				flex-direction: column;
				font-size: 30rpx;
			}
			.time{
				width: 100%;
				text-align: right;
					font-size: 28rpx;
			}
		}
	}
</style>
