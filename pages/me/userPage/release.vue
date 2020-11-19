<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="发布" :leftIcon="true" />
		</view>
		
		<view class="tab_top"></view>
		<view class="tab tabTab">
			<view class="item" 
			v-for="(item,index) in tabList" 
			:key="index" 
			:class="ind===index?'active':''"
			@click="Switch(index)">
				<text>{{item.title}}</text>
			</view>
		</view>
		<view class="img_text" v-show="ind===0">
			<view style="font-size: 26rpx;" v-if="imgTextList.length===0">暂无信息</view>
			<scroll-view scroll-y="true" :style="{height:Height+'px'}" @scrolltolower="scrolltolower">
				<view class="box">
					<view class="item" v-for="(item,index) in imgTextList" :key="index" @click.stop="seeDeatil(item,'image')">
						<view class="name">
							<image v-if="item.avatar" :src="item.avatar" mode=""></image>
							<image v-if="!item.avatar" src="../../../static/logo.png" mode="widthFix"></image>
							<text class="username">{{item.username}}</text>
						</view>
						<view class="content" v-if="item.circle_content"><text>{{item.circle_content}}</text></view>
						<view class="img" v-if="item.circle_images">
							<image v-for="(i,v) in item.imgList" :key="v" :src="i" mode="widthFix"></image>
							<!--  @click.stop="previewImage(item.imgList)" -->
				
						</view>
						<!-- <view class="item_video" v-if="item.circle_video">
							<image class="item_bk" :src="item.controimg" mode="widthFix"></image>
							<image  src="../../../static/club/bofang.png" mode="widthFix" class="img_item"></image>
						</view> -->
						<view class="time">
							<text>{{item.create_time}}</text>
							<view class="fn">
								<view class="set_zan">
									<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image> -->
									<image  :src="item.zan" mode="widthFix"></image>
									<!-- <image v-if="item.is_like==='1'" src="../../../static/club/zan.png" mode="widthFix"></image> -->
									
									<text>{{item.likenum}}</text>
								</view>
								<view class="pinglun_icon">
									<image  src="../../../static/club/pinglun.png" mode="widthFix"></image>
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
			</scroll-view>
		</view>
		<view class="video_text" v-show="ind===1">
			<view style="font-size: 26rpx;" v-if="videoTextList.length===0">暂无信息</view>
			<scroll-view scroll-y="true" :style="{height:Height+'px'}" @scrolltolower="scrolltolower">
			<view class="box">
				<view class="item" v-for="(item,index) in videoTextList" :key="index" @click.stop="seeDeatil(item,'video')">
					<view class="name">
						<image :src="item.avatar" mode=""></image>
						<text class="username">{{item.username}}</text>
					</view>
					<view class="content" v-if="item.circle_content"><text>{{item.circle_content}}</text></view>
					<!-- <view class="img" v-if="item.circle_images">
						<image v-for="(i,v) in item.imgList" :src="i" mode="widthFix"></image>
					</view> -->
					<view class="item_video" v-if="item.circle_video">
						<image class="item_bk"  :src="item.controimg" mode="widthFix"></image>
						<image  src="../../../static/club/bofang.png" mode="widthFix" class="img_item"></image>
						<!-- item.controimg -->
					</view>
					<view class="time">
						<text>{{item.create_time}}</text>
						<view class="fn">
							<view class="set_zan">
								<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image> -->
								<image  :src="item.zan" mode="widthFix"></image>
								<!-- <image  src="../../../static/club/zan.png" mode="widthFix"></image> -->
								
								<text>{{item.likenum}}</text>
							</view>
							<view class="pinglun_icon">
								<image  src="../../../static/club/pinglun.png" mode="widthFix"></image>
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
			</scroll-view>
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
				userid:'',
				tabList:[
					{title:'已发布图文'},
					{title:'已发布视频'},
				],
				ind:0,
				offset:1,
				imgTextList:[],
				videoTextList:[],
				Height:''
			};
		},
		created() {
			uni.getSystemInfo({
				success:(data)=> {
					this.Height = data.screenHeight-80-60;
					// console.log(data.screenHeight)
				}
			})
		},
		onLoad() {
			let {token,user_id} = uni.getStorageSync('userinfo');
			this.token = token;
			this.userid = user_id;	
			
		},
		onShow() {
			console.log(this.ind);
			this.offset = 1;
			if(this.ind){
				this.getVideoText();
			}else{
				this.getImgText();
			}
		},
		methods:{
			scrolltolower(e){
				console.log(e)
				if(this.ind){
					this.getVideoText();
				}else{
					this.getImgText();
				}
			},
			Switch(index){
				this.ind = index;
				this.offset=1;
				if(this.ind){
					this.getVideoText();
				}else{
					this.getImgText();
				}
			},//切换tab
			async getImgText(){
				uni.showLoading({
					mask:true
				})
				let obj = {token:this.token,offset:this.offset,limit:10,keyword:'',fishground_id:'',userid:this.userid};
			    let res = await this.$Post('/api/Groundcircle/ListGroundcircle',obj);
				if(res.data.code===1){
					res.data.data.list.forEach((val,ind)=>{
						val.imgList = val.circle_images.split(',');
						val.zan = '../../../static/club/no_zan.png'
					})
					console.log(res.data.data.list)
					if(this.offset===1){
						this.imgTextList = res.data.data.list;
					}else{
						this.imgTextList.push(...res.data.data.list);
					}
					this.offset++;
				}
				uni.hideLoading();
			},
			async getVideoText(){
				uni.showLoading({
					mask:true
				})
				let obj = {ismy:'2',isrecommend:'',offset:this.offset,limit:10,keyword:'',fishground_id:'',token:this.token,userid:this.userid};
			    let res = await this.$Post('/api/Groundcircle/ListCircleVideo',obj);
				console.log(res)
				if(res.data.code===1){
					res.data.data.list.forEach((val,ind)=>{
						val.zan = '../../../static/club/no_zan.png';
					})
					if(this.offset===1){
						this.videoTextList = res.data.data.list;
					}else{
						this.videoTextList.push(...res.data.data.list);
					}
					this.offset++;
				}
				// let obj2 = {ismy:'1',isrecommend:'',offset:this.offset,limit:10,keyword:'',fishground_id:'',token:this.token,userid:this.userid};
				//  let res2 = await this.$Post('/api/Groundcircle/ListCircleVideo',obj2);
				//  if(res2.data.code===1){
				// 	 res2.data.data.list.forEach((val,ind)=>{
				// 	 	val.zan = '../../../static/club/no_zan.png';
				// 	 })
				// 	 	this.videoTextList.push(...res2.data.data.list);
				//  }
			
				uni.hideLoading();
			},
			seeDeatil(item,status){
				uni.navigateTo({
					url:`./releaseDetail?status=${status}&id=${item.id}`
				})
				console.log(item)
			},//跳转详情
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
					// display: -webkit-box;
					// -webkit-box-orient: vertical;
					// -webkit-line-clamp: 3;
					// overflow: hidden;
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
