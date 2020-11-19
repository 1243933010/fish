<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="用户页面" :leftIcon="true" />
		</view>
		
		<view class="user">
			<view class="icon">
				<view class="icon_left">
					<image :src="obj.avatar" mode=""></image>
					<text class="name">{{obj.username}}</text>
				</view>
				<view class="fn">
					<text @click="attention" v-if="obj.is_attentionuser==='0'&&userid!==id*1">关注</text>
					<text class="red" @click="unAttention" v-if="obj.is_attentionuser==='1'">取消关注</text>
					<text @click="btn" v-if="obj.is_friend==='0'&&userid!==id*1">添加好友</text>
					<text class="red" @click="deleteFirend" v-if="obj.is_friend==='1'">删除好友</text>
				</view>
				<!-- <view class="btn" @click="btn"><text>添加为好友</text></view> -->
			</view>
			<view class="con">
				<view class="" @click="Guanzhu"><text>关注用户</text><text>{{obj.attention_num}}</text></view>
				<view class="" @click="Fen"><text>粉丝</text><text>{{obj.fans_num}}</text></view>
				<view class="" ><text>动态文章</text><text>{{obj.dynamic_num}}</text></view>
				<view class="" @click="Shiping"><text>视频</text><text>{{obj.video_num}}</text></view>
			</view>
		</view>
		
		<view style="font-size: 32rpx;font-weight: 600;margin-left: 30rpx;margin-bottom: 15rpx;"><text>动态</text></view>
		<scroll-view scroll-y="true" :style="{height:Height+'px'}" >
			<view class="boxx">
				<view class="item" v-for="(item,index) in imgTextList" :key="index" @click.stop="seeDeatil(item,'image')">
					<view class="name">
						<!-- <text style="font-size: 26rpx;">{{item.create_time}}</text> -->
						<!-- <image v-if="item.avatar" :src="item.avatar" mode=""></image> -->
						<!-- <image v-if="!item.avatar" src="../../../static/logo.png" mode="widthFix"></image> -->
						<!-- <text class="username">{{item.username}}</text> -->
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
						<text style="font-size: 26rpx;">{{item.create_time}}</text>
						<view class="fnc">
							<view class="set_zan">
								<!-- <image @click.stop="setZan(item,index)" :src="item.zan" mode="widthFix"></image> -->
								<!-- <image  :src="item.zan" mode="widthFix"></image> -->
								<image v-if="item.is_like==='0'" :src="item.zan" mode="widthFix"></image>
								<image v-if="item.is_like==='1'" src="../../../static/club/zan.png" mode="widthFix"></image>
								
								<text class="btn_text">{{item.likenum}}</text>
							</view>
							<view class="pinglun_icon">
								<image  src="../../../static/club/pinglun.png" mode="widthFix"></image>
								<text  class="btn_text">{{item.reviewnum}}</text>
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
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components:{headers,popup},
		data() {
			return {
				token:'',
				id:'',
				obj:{},
				Height:'',
				offset:1,
				imgTextList:[]
			};
		},
		onLoad(e) {
			console.log(e)
			let {token,user_id} = uni.getStorageSync('userinfo');
			this.token = token;
			this.userid = user_id;
			this.id = e.userid;
			this.getMsg();
			console.log(this.userid,this.id);
			this.getImageText();
			console.log(this.userid,this.id);
			uni.getSystemInfo({
				success: (data) => {
					this.Height = data.windowHeight-270;
				}
			})
		},
		methods:{
			seeDeatil(item,type){
				console.log(type,item)
				uni.navigateTo({
					url:`../../firend/detail?status=${type}&id=${item.id}`
				})
			},
			async getImageText(){
				let obj = {token:this.token,offset:this.offset,limit:10,keyword:'',fishground_id:'',userid:this.id};
				let res = await this.$Post('/api/Groundcircle/ListGroundcircle',obj);
				if(res.data.code===1){
					res.data.data.list.forEach((val,ind)=>{
						val.imgList = val.circle_images.split(',');
						val.zan = '../../../static/club/no_zan.png'
					})
					if(this.offset===1){
						this.imgTextList = res.data.data.list
					}else{
						this.imgTextList.push(...res.data.data.list);
					}
					this.offset++;
				}
				console.log(res,'-----')
			},
			Guanzhu(){
				uni.navigateTo({
					url:`../../firend/attention?userid=${this.id}`
				})
			},
			Fen(){
				uni.navigateTo({
					url:`../../firend/fens?userid=${this.id}`
				})
			},
			Shiping(){
				uni.navigateTo({
					url:`../../firend/video?userid=${this.id}`
				})
			},
			async getMsg(id){
				let obj = {token:this.token,text:this.id};
				let res = await this.$Post('/api/Userfriend/finduser',obj);
				if(res.data.code===1){
					this.obj = res.data.data;
				}
				console.log(res); 
			},
			async btn(){
				let {token} = uni.getStorageSync('userinfo');
				let obj = {token,userid:this.obj.userid};
				let data = await this.$Post('/api/Userfriend/addfirend',obj);
				this.$Toast(data.data.msg);
				if(res.data.code===1){
					this.getMsg(this.id)
				}
				// console.log(this.obj);
			},//添加好友
			async deleteFirend(){
				let obj = {token:this.token,userid:this.obj.userid};
				let data = await this.$Post('/api/Userfriend/delfirend',obj);
				this.$Toast(data.data.msg);
				if(res.data.code===1){
					this.getMsg(this.id)
				}
			},//删除好友
			async attention(){
				let obj = {token:this.token,userid:this.id};
				let res = await this.$Post('/api/Userfriend/AddAttentionUser',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.getMsg(this.id);
				}
			},//关注
			async unAttention(){
				let obj = {token:this.token,userid:this.id};
				let res = await this.$Post('/api/Userfriend/DelAttentionUser',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.getMsg(this.id);
				}
			},//取消关注
		}
	}
</script>

<style lang="scss" scoped>
	.fn{
		text{
			margin:  15rpx;
			font-size: 26rpx;
			color: white;
			background: #34BEFF;
			box-sizing: border-box;
			padding: 15rpx 20rpx;
			border-radius: 10rpx;
		}
		.red{
			background: red;
		}
	}
.top_hr{
		width: 100%;
		height: 160rpx;
	}
	.user{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		.icon{
			display: flex;
			// flex-direction: row;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;
			margin-bottom: 20rpx;
			.icon_left{
				display: flex;
				flex-direction: row;
				align-items: center;
				.name{
					width: 180rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				image{
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			}
			
		}
		.con{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;
		}
	}
	
	.boxx {
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 25rpx;
	
		.item {
			display: flex;
			flex-direction: column;
			margin-bottom: 30rpx;
			box-sizing: border-box;
			padding: 0 20rpx;
			border-left: 4rpx solid #3BC0FF;
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
	
				.fnc {
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
