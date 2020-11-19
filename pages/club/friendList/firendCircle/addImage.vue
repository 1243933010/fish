<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="发布图片" :leftIcon="true" />
		</view>
		
		
		<view class="box">
			
			<view class="img">
				<view class="item" v-for="(item,index) in imgList" >
					<image :src="item" mode="widthFix"></image>
					<image class="delete" @click="Delete(index)" src="../../../../static/club/delete.png" mode="widthFix"></image>
				</view>
				<image @click="addImage"  src="../../../../static/club/add.png" mode="widthFix"></image>
			</view>
			
			<view class="hr"></view>
			<view class="texa">
				<view class="title">
					<text>添加文字</text>
					<text style="color: #999999;">({{texa.length}}/300)</text>
				</view>
				<textarea class="textarea"  v-model="texa" maxlength="300" placeholder="点击此处输入文字" />
			</view>
			<view class="send" @click="rightClick"><text>发布</text></view>
			<!-- <image @click="addImage"  src="../../../../static/club/add.png" mode="widthFix"></image> -->
			<!-- <image :src="videoUrl" mode="widthFix" v-if="flog"></image> -->
			<!-- <video v-if="flog" :src="videoUrl" controls></video> -->
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components:{headers,popup},
		data() {
			return {
				texa:'',
				imgList:[],
				imgData:[],
				token:'',
				roomId:'',
				userId:''
			};
		},
		onLoad(e) {
			let data = uni.getStorageSync('userinfo');
			this.token = data.token;
			this.roomId = e.roomId;
			this.userId = e.userid;
			// console.log(e)
		},
		methods:{
			change(){
				
			},
			async rightClick(){
				if(this.imgData.length>9){
					this.$Toast('发布图片不能多于9张');
					return;
				}
				
				let circle_images = this.imgData.join(',');
				let obj = {
					token:this.token,
					fishground_id:this.roomId,
					circle_content:this.texa,
					circle_images
				}
				
				let res = await this.$Post('/api/Groundcircle/AddGroundcircle',obj);
				this.$Toast(res.data.msg);
				console.log(res)
				if(res.data.code===1){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},500)
				}
			},
			async addImage(){
				if(this.imgData.length>9){
					this.$Toast('发布图片不能多于9张');
					return;
				}
				uni.chooseImage({
					count:1,
					sizeType:['compressed '],
					sourceType:['album','camera'],
					success: async(res) => {
						let data = await this.getRequestMsg(res.tempFilePaths[0]);
						this.imgList.push('http://47.95.39.75:9706'+data);
						this.imgData.push(data);
					}
				})
			},
			Delete(index){
				let arr = JSON.parse(JSON.stringify(this.imgList));  
				let arr2 = JSON.parse(JSON.stringify(this.imgData));
				arr.splice(index,1);
				arr2.splice(index,1)
				this.imgList = arr;
				this.imgData = arr2;
			},//删除选中得图片
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
									this.$Toast(msg.msg);
									if(msg.code===1){
										resolve(msg.data.url);
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
		padding: 40rpx 0rpx;
		textarea{
			width: 100%;
			border: 1px solid #333333;
		}
		// image{
		// 	width: 100rpx;
		// }
		.img{
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			margin-bottom: 50rpx;
			box-sizing: border-box;
			padding: 0 20rpx;
			image{
				width: 180rpx;
				margin-right: 25rpx;
			}
			.item{
				position: relative;
				image{
					width: 180rpx;
					margin-right: 25rpx;
				}
				.delete{
					width: 40rpx;
					position: absolute;
					top: -20rpx;
					right: -20rpx;
				}
			}
		}
	}
</style>
