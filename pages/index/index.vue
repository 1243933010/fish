<template>
	<view>
		
		<view style="background: white;z-index: 100;position: fixed;width: 100%;height: 260rpx;">
			<!-- <view class="top_hr" style="padding-bottom: 0rpx;z-index: 100;"></view> -->
			<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
				<headers title="自媒体" :leftIcon="false" />
			</view>
			<!-- <view style="width: 100%;height: 100rpx;background: white;z-index: 100;"></view> -->
			<view style="position: fixed;top: 180rpx;width: 100%;background: white;z-index: 100;">
				<view class="tab">
					<view class="item" @click="choose(0)">
						<text :class="[ind===0?'active':'']">推荐</text>
					</view>
					<view class="item" @click="choose(1)">
						<text :class="[ind===1?'active':'']">最新</text>
					</view>
					<view class="item" @click="choose(2)" v-if="userFlog">
						<text :class="[ind===2?'active':'']">我的发布</text>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%;height: 260rpx;"></view>

		<view class="swiper_con">
			<swiper class="swiper" 
			:indicator-dots="false" 
			:autoplay="false"  
			:duration="500"
			@change="change"
			:current="current"
			:style="{height:Height+'px'}">
			<!-- 推荐 -->
				<swiper-item>
					<scroll-view :style="{height:Height+'px'}" scroll-y="true" @scrolltolower="scrolltolower(0)">
						<view class="pox" v-show="ind===0">
							<view class="swiper_item" 
							v-for="(item,index) in recommendList"
							:key="index"
							@click="goRecommend(item)">
								<image class="bk" :src="item.controimg" mode="widthFix"></image>
								<view class="msg">
									<view class="title">
										<!-- <text>{{item.title}}</text> -->
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
				<!-- 最新 -->
				<swiper-item>
					<scroll-view :style="{height:Height+'px'}" scroll-y="true"  @scrolltolower="scrolltolower(1)">
						<view class="pox" v-show="ind===1">
							<view class="swiper_item" 
							v-for="(item,index) in newList" 
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
				<!-- 我的发布 -->
				<swiper-item v-if="userFlog">
					<scroll-view :style="{height:Height+'px'}" scroll-y="true"  @scrolltolower="scrolltolower(2)">
						<view class="pox" v-show="ind===2">
							<view class="swiper_item" 
							v-for="(item,index) in userList" 
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
		
		<view class="posi" v-if="userFlog">
			<image @click="goTo" src="../../static/index/add.png" mode="widthFix"></image>
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
				ind: 0,
				current:0,
				Height:'',
				recommendList:[],
				newList:[],
				userList:[],
				userFlog:false,
				offset:1
			};
		},
		async created() {
			uni.getSystemInfo({
			    success: (res)=> {
					this.Height = res.windowHeight-80-50;
			    }
			});
			let {token} = uni.getStorageSync('userinfo');
			if(token){
				this.token = token;
				let res = await this.$Get('/api/user/Getuserinfo',{token})
				if(res.data.code===1){
					let is_masteruser =  res.data.data.is_masteruser;
					is_masteruser==='1'?this.userFlog = true:this.userFlog = false;
				}//获取用户是不是大师身份
			}else{
				this.userFlog = false;
			}
			
			// let obj = {ismy:'1',offset:1,limit:20,keyword:'',isrecommend:'1',type:'1'};
			// this.getList(obj);
			// console.log(this.Height)
		},
		onShow(){
			this.offset = 1;
			if(this.ind===0){ //推荐
				let obj = {ismy:'1',offset:1,limit:10,keyword:'',isrecommend:'1',type:'1'};
				this.getList(obj);
			}else if(this.ind===1){ //最新
				let obj = {ismy:'1',offset:1,limit:10,keyword:'',isrecommend:'0',type:'2'};
				this.getList(obj);
			}else if(this.ind===2){ //我的发布
				let obj = {ismy:'2',offset:1,limit:10,keyword:'',token:this.token,type:'3'};
				this.getList(obj);
			}
		},
		methods: {
			scrolltolower(e){
				if(this.ind===0){ //推荐
					let obj = {ismy:'1',offset:this.offset,limit:10,keyword:'',isrecommend:'1',type:'1'};
					this.pushList(obj);
				}else if(this.ind===1){ //最新
					let obj = {ismy:'1',offset:this.offset,limit:10,keyword:'',isrecommend:'0',type:'2'};
					this.pushList(obj);
				}else if(this.ind===2){ //我的发布
					let obj = {ismy:'2',offset:this.offset,limit:10,keyword:'',token:this.token,type:'3'};
					this.pushList(obj);
				}
			},
			choose(num) {
				this.ind = num;
				this.current = num;
				this.offset = 1;
				// if(num===0){ //推荐
				// 	let obj = {ismy:'1',offset:1,limit:20,keyword:'',isrecommend:'1',type:'1'};
				// 	this.getList(obj);
				// }else if(num===1){ //最新
				// 	let obj = {ismy:'1',offset:1,limit:20,keyword:'',isrecommend:'0',type:'2'};
				// 	this.getList(obj);
				// }else if(num===2){ //我的发布
				// 	let obj = {ismy:'1',offset:1,limit:20,keyword:'',token:this.token,type:'3'};
				// 	this.getList(obj);
				// }
			},//额外传个type标注类型
			change(e){
				// console.log(e)
				this.ind = e.detail.current;
				this.current = e.detail.current;
				this.offset = 1;

				if(this.ind===0){ //推荐
					let obj = {ismy:'1',offset:1,limit:10,keyword:'',isrecommend:'1',type:'1'};
					this.getList(obj);
				}else if(this.ind===1){ //最新
					let obj = {ismy:'1',offset:1,limit:10,keyword:'',isrecommend:'0',type:'2'};
					this.getList(obj);
				}else if(this.ind===2){ //我的发布
					let obj = {ismy:'2',offset:1,limit:10,keyword:'',token:this.token,type:'3'};
					this.getList(obj);
				}
			},
			goRecommend(item){
				let list = [];
				let type = 0;
				switch(this.ind){
					case 0:
					list = this.recommendList;
					type = 0;
					break;
					case 1:
					list = this.newList;
					type = 1;
					break;
					case 2:
					list = this.userList;
					type = 2;
					break;
					default:
				}
				let videoMsg = {type,list,id:item.id};
				getApp().globalData.videoMsg = videoMsg;
				// console.log(getApp().globalData.videoMsg)
				// console.log(item)
				uni.navigateTo({
					url:`./AudioDetail/AudioDetail`
				})
				// console.log(item)
			},//推荐详情
			goTo(){
				uni.navigateTo({
					url:'./addVideo/addVideo'
				})
			},//去发布视频
			async getList(obj){
				let res = await this.$Post('/api/Groundcircle/ListCircleVideo',obj);
				console.log(res)
				if(res.data.code===1){
					res.data.data.list.forEach((val,ind)=>{
						if(val.catnum>1000&&val.catnum<10000){
							val.catnum = (val.catnum/1000).toFixed(0)+'k'
						}
						if(val.likenum>1000&&val.likenum<10000){
							val.likenum = (val.likenum/1000).toFixed(0)+'k'
						}
						if(val.reviewnum>1000&&val.reviewnum<10000){
							val.reviewnum = (val.reviewnum/1000).toFixed(0)+'k'
						}
						if(val.catnum>10000){
							val.catnum = (val.catnum/10000).toFixed(0)+'w'
						}
						if(val.likenum>10000){
							val.likenum = (val.likenum/10000).toFixed(0)+'w'
						}
						if(val.reviewnum>10000){
							val.reviewnum = (val.reviewnum/10000).toFixed(0)+'w'
						}
					})
				}
				// console.log(obj)
				switch(obj.type){
					case '1':
					if(res.data.code===1){
						this.recommendList = res.data.data.list;
						this.offset++;
					}
					break;
					case '2':
					if(res.data.code===1){
						this.newList = res.data.data.list;
						this.offset++;
					}
					break;
					case '3':
					if(res.data.code===1){
						this.userList = res.data.data.list;
						this.offset++;
					}
					break;
					default:
				}
				
			},//获取选中得列表
			async pushList(obj){
				uni.showLoading({
					mask:true
				})
				let res = await this.$Post('/api/Groundcircle/ListCircleVideo',obj);
				// console.log(res)
				// console.log(obj)
				if(res.data.code===1){
					res.data.data.list.forEach((val,ind)=>{
						if(val.catnum>1000&&val.catnum<10000){
							val.catnum = (val.catnum/1000).toFixed(0)+'k'
						}
						if(val.likenum>1000&&val.likenum<10000){
							val.likenum = (val.likenum/1000).toFixed(0)+'k'
						}
						if(val.reviewnum>1000&&val.reviewnum<10000){
							val.reviewnum = (val.reviewnum/1000).toFixed(0)+'k'
						}
						if(val.catnum>10000){
							val.catnum = (val.catnum/10000).toFixed(0)+'w'
						}
						if(val.likenum>10000){
							val.likenum = (val.likenum/10000).toFixed(0)+'w'
						}
						if(val.reviewnum>10000){
							val.reviewnum = (val.reviewnum/10000).toFixed(0)+'w'
						}
					})
				}
				switch(obj.type){
					case '1':
					if(res.data.code===1){
						this.recommendList.push(...res.data.data.list);
						this.offset++;
					}
					break;
					case '2':
					if(res.data.code===1){
						this.newList.push(...res.data.data.list);
						this.offset++;
					}
					break;
					case '3':
					if(res.data.code===1){
						this.userList.push(...res.data.data.list);
						this.offset++;
					}
					break;
				}
				uni.hideLoading();
			},//添加数据
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
		// position: absolute;
		z-index: -1;
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
		background: #555555;
		// height: 500rpx;
		overflow: hidden;
		position: relative;
		margin-bottom: 40rpx;
		border-radius: 15rpx;
		.bk{
			width: 100%;
			border-radius: 15rpx;
			image{
				width: 100%;
				height: 400rpx
			}
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
		width: 60%;
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
