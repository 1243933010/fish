<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="发布视频" :leftIcon="true" />
		</view>
		
		
		

		<view class="box">
			
			<image @click="addVideo" v-if="!flog" src="../../../../static/club/add.png" mode="widthFix"></image>
			<view class="video_view">
				<view class="video_view_img">
					<image  @click="seeVideo" class="video_view_img_img" v-if="flog" :src="controimg" mode="widthFix"></image>
					<view class="delete_img" v-show="flog" @click="deleteVideo">
							<image style="width: 40rpx;height: 40rpx;" src="../../../../static/club/delete.png" mode="widthFix"></image>	
					</view>
					<image  @click="seeVideo" class="play" src="../../../../static/index/video_play.png" mode=""></image>
				</view>
				<!-- <video style="margin-bottom: 30rpx;" v-if="flog" object-fit="fill" :poster="controimg" :src="videoUrl" controls></video> -->
				
			</view>
			
			<view class="hr"></view>
			<view class="texa">
				<view class="title">
					<text>添加文字</text>
					<text style="color: #999999;">({{texa.length}}/20)</text>
				</view>
				<textarea class="textarea" v-model="texa" maxlength="20" placeholder="点击此处输入文字" />
			</view>
			<view class="send" @click="rightClick"><text>发布</text></view>
		</view>
		
		
		<uni-popup type="bottom" ref="popup" >
		<!-- :maskClick="false" -->
			<view class="pox">
				<view @click="choose(1)">发布到当前渔场</view>
				<view @click="choose(0)" v-if="is_masteruser==='1'">发布到首页推荐</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	 // #ifdef APP-PLUS
	 const videoCompress = uni.requireNativePlugin('Carlos-VideoCompress');
	 // #endif
	export default {
		components:{headers,popup},
		data() {
			return {
				texa:'',
				flog:false,
				videoUrl:'',
				token:'',
				roomId:'',
				userId:'',
				videoData:'',
				index:1,
				is_masteruser:'',
				controimg:'',
				controimgData:''
			};
		},
	async onLoad(e) {
			let data = uni.getStorageSync('userinfo');
			this.token = data.token;
			this.roomId = e.roomId;
			// this.userId = e.userid;
			// let res = await this.$Get('/api/user/Getuserinfo',{token:data.token})
			// if(res.data.code===1){
			// 	this.is_masteruser = res.data.data.is_masteruser;
			// }//获取用户是不是大师身份
			// console.log(res)
		},
		methods:{
			seeVideo(){
				uni.navigateTo({
					url:`../../../me/userPage/videoPage?url=${this.videoUrl}`
				})
			},
			deleteVideo(){
				this.controimg = '';
				this.videoData = '';
				this.controimgData = '';
				this.flog = false;
			},//删除临时视频
			async rightClick(){
				if(!this.videoData){
					this.$Toast('请上传视频');
					return
				}
				if(!this.texa){
					this.$Toast('请输入文字信息');
					return
				}
				
			let	obj = {
					token:this.token,
					fishground_id:this.roomId,
					circle_content:this.texa,
					circle_video:this.videoData,
					controimg:this.controimgData
				}
				let res = await this.$Post('/api/Groundcircle/AddCircleVideo',obj);
				this.$Toast(res.data.msg);
				console.log(res)
				if(res.data.code===1){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},700)
				}
			},//打开弹窗
			async choose(ind){
				this.index = ind;
				let obj = {};
				if(this.index){
					obj = {
						token:this.token,
						fishground_id:this.roomId,
						circle_content:this.texa,
						circle_video:this.videoData
					}
				}else{
					obj = {
						token:this.token,
						circle_content:this.texa,
						circle_video:this.videoData
					}
				}
				
				
				let res = await this.$Post('/api/Groundcircle/AddCircleVideo',obj);
				this.$Toast(res.data.msg);
				console.log(res)
				if(res.data.code===1){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},700)
				}
			},//选择发布位置
			// async addVideo(){
			// 	uni.chooseVideo({
			// 		sourceType:['album','camera'],
			// 		maxDuration:20,
			// 		camera:'front',
			// 		compressed:true,
			// 		success: async(res) => {
			// 			let arr =  res.tempFilePath.split('.');
			// 			if(arr[1]==='3gp'){
			// 				this.$Toast('视频文件格式无法上传');
			// 				return
			// 			}
			// 			uni.showLoading();
			// 			console.log(res.tempFilePath);
			// 			let data = await this.getRequestMsg(res.tempFilePath);
						
			// 			console.log(data);
			// 			this.videoUrl = data.website+data.url;
			// 			this.videoData = data.url;
			// 			if(data.video_imgurl){
			// 				uni.hideLoading();
			// 			this.controimg = data.website+data.video_imgurl;
			// 			this.controimgData = data.video_imgurl;	
			// 			}
			// 			uni.hideLoading();
			// 			this.flog = true;
			// 			// console.log(res.tempFilePath);
			// 		}
			// 	})
			// },
			
			async addVideo(){
				// console.log(videoCompress)
				uni.chooseVideo({
					// sourceType:['album','camera'],
					success: async(res) => {
						if(res.size<10000000){
							uni.showLoading({
								mask:true
							})
							let data = await this.getRequestMsg(res.tempFilePath);
							console.log(data)
							this.videoUrl = data.website+data.url;
							this.videoData = data.url;
							if(data.video_imgurl){
								uni.hideLoading();
							this.controimg = data.website+data.video_imgurl;
							this.controimgData = data.video_imgurl;	
							}
							uni.hideLoading();
							this.flog = true;
							return
						}
						let mobileUrl = '';
						if(res.tempFilePath.indexOf('_doc')===0||res.tempFilePath.indexOf('_www')===0){
							mobileUrl = plus.io.convertLocalFileSystemURL(res.tempFilePath);
						}else{
							mobileUrl=res.tempFilePath;
						}
						
						uni.showLoading({
							title:'正在压缩'
						})
						this.yaSuo(mobileUrl,async(path)=>{
							console.log(path);
							if(path){
								console.log(path);
								// uni.hideLoading();
								let arr =  path.split('.');
								if(arr[1]==='3gp'){
									console.log('11111')
									this.$Toast('视频文件格式无法上传');
									uni.hideLoading();
									return
								}
								console.log(path);
								let data = await this.getRequestMsg(path);
								console.log(data)
								this.videoUrl = data.website+data.url;
								this.videoData = data.url;
								if(data.video_imgurl){
									uni.hideLoading();
								this.controimg = data.website+data.video_imgurl;
								this.controimgData = data.video_imgurl;	
								}
								uni.hideLoading();
								this.flog = true;
							}else{
								uni.hideLoading();
								this.$Toast('压缩失败');
							}
						})
						// uni.showLoading();
						// console.log(res);
						
					
						// console.log(res.tempFilePath);
					},
					fail: (err) => {
						console.log(err)
					},
					complete: (a) => {
						console.log(a)
					}
				})
			},
			yaSuo(source,callback){
				videoCompress.compress({source,bitRate:55000,size:2048}, (result) => {
					console.log(result)
					if(result.status==='success'){
						// console.log(result.path);
						callback(result.path);
					}
					
				});
			},
			getRequestMsg(msg){
				return new Promise((resolve,reject)=>{
					uni.uploadFile({
					            url: `${this.baseUrl}api/common/upload`, 
					            filePath: msg,
					            name: 'file',
								formData: {
								    'token':this.token
								},
					            success: (uploadFileRes) => {
									let msg = JSON.parse(uploadFileRes.data);
									if(msg.code===1){
										if(uploadFileRes.data.msg){
											this.$Toast(uploadFileRes.data.msg);
										}
										let msg = JSON.parse(uploadFileRes.data);
										resolve(msg.data);
									}else if(uploadFileRes.statusCode==413){
										this.$Toast('文件过大，请先压缩');
									}
					                // console.log(JSON.parse(uploadFileRes.data));
					            },
								fail(err) {
									console.log(err)
									reject(err)
								}
					        });
				})
			},//获取拿到数据发送后的返回数据
		}
	}
</script>

<style lang="scss" scoped>
	.video_view{
		position: relative;
		.video_view_img{
			width: 380rpx;
			position: relative;
			.play{
				width: 35rpx;
				height: 35rpx;
				position: absolute;
				left: 45%;
				top: 45%;
				transform: translate(-50% -50%);
			}
			.video_view_img_img{
				width: 380rpx;
			}
		}
		.delete_img{
			position: absolute;
			right: -40rpx;
			top: -20rpx;
		}
	}
	.send{
		width: 60%;
		margin: 0 auto;
		font-size: 26rpx;
		color: white;
		background: #52D2F6;
		border-radius: 8rpx;
		padding: 25rpx 0;
		text-align: center;
	}
	.texa{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		.title{
			font-size: 26rpx;
			color: #333333;
			margin-bottom: 15rpx;
		}
		.textarea{
			border: none;
			color: #999999;
			font-size: 26rpx;
		}
	}
	.hr{
		width: 100%;
		height: 10rpx;
		background: #F0F0F0;
		margin-bottom: 30rpx;
	}
.top_hr{
		width: 100%;
		height: 160rpx;
	}
	.box{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		textarea{
			width: 100%;
			border: 1px solid #333333;
		}
		image{
			width: 100rpx;
		}
	}
	
	.pox{
		width: 100%;
		background: white;
		view{
			width: 100%;
			text-align: center;
			border-bottom: 1px solid #808080;
			padding: 20rpx 0;
			font-size: 32rpx;
		}
	}
</style>
