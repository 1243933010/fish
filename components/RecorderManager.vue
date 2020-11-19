<template>
	<view>

		<view v-show="managerShow">
			<view class="luyin" @touchstart="start" @touchend="end" @touchcancel="cancel" >
				<image :src="img" mode=""></image>
				<!-- <text>{{text}}</text> -->
			</view>
			<text @click="playVoice"></text>
		</view>
		
		
		<uni-popup type="center" ref="popup">
			 <view class="popup_img">
				<image src="../static/club/GIF2.gif" mode="widthFix"></image>
			 </view>
		</uni-popup>
	</view>
</template>

<script>
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	import popup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components:{
			popup
		},
		props:{
			managerShow:{
				type:Boolean,
				default:false
			},
			imgUrl:{
				type:String,
				default:'../../static/club/yin.png'
			}
		},
		data() {
			return {
				voicePath: '',
				img:'../../static/club/yin.png',
				text:'',
				time:null
			};
		},
		mounted() {
			console.log(this.imgUrl,'========');
			if(this.imgUrl==='firendRoom'){
				this.img = '../../../static/club/yin.png'
				// this.img = '../../../static/club/luyin.gif'
			}
			let self = this;
			let data = uni.getStorageSync('userinfo');
			console.log(data)
			recorderManager.onStop((res)=> {
				if(this.time<1000){
					this.$Toast('录音时间请大于1秒');
					return false
				}
				this.time = null;
				this.startTime = null;
				console.log(this.time,this.startTime)
				// console.log('recorder stop' + JSON.stringify(res));
				self.voicePath = res.tempFilePath;
				console.log(data.token);
				uni.uploadFile({
				            url: `${this.baseUrl}api/common/upload`, 
				            filePath: res.tempFilePath,
				            name: 'file',
							formData: {
							    'token':data.token
							},
				            success: (uploadFileRes) => {
								let msg = JSON.parse(uploadFileRes.data);
								if(msg.code===1){
									console.log(this.baseUrl+msg.data.url)
									this.$emit('getAudio',msg.data.url);
								}
				                // console.log(JSON.parse(uploadFileRes.data));
				            }
				        });
			});
		},
		methods: {
			cancel(){
				this.time = new Date().getTime()-this.startTime;
				if(this.time<1000){
					clearTimeout(this.timeOut);
					return false
				}
				recorderManager.stop();
				this.$refs.popup.close();
				

			},
			start() {
				clearTimeout(this.timeOut);
				this.startTime = new Date().getTime();
				this.timeOut = setTimeout(()=>{
					recorderManager.start();
					// this.img='../../static/club/yin1.gif';
					this.$refs.popup.open();
				},1000)
				
				

			},
			end() {
				this.time = new Date().getTime()-this.startTime;
				if(this.time<1000){
					clearTimeout(this.timeOut);
					return false
				}
				recorderManager.stop();
				this.$refs.popup.close();

				
			},
			playVoice() {
				if (this.voicePath) {
					console.log(this.voicePath);
					innerAudioContext.src = this.voicePath;
					innerAudioContext.play();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup_img{
		image{
			width: 250rpx;
		}
	}
	.luyin {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		box-sizing: border-box;
		padding: 65rpx 0;
		background: #FFFFFF;
		image {
			width: 105rpx;
			height: 105rpx;
		}
	}
</style>