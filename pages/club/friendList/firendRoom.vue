<template>
	<view>
		<!-- <view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers :title="title" :leftIcon="true" />
		</view> -->
		
		<!-- <view class="top_tab">
			<view class="item" 
			:class="[ind===index?'active':'']"
			 v-for="(item,index) in topTabList" 
			 :key="index" 
			 @click="choose(item,index)">
				<text>{{item.title}}</text>
			</view>
		</view> -->

		<scroll-view scroll-y="true" :style="{height:Height+'px'}" :scroll-top="scrollTop" scroll-with-animation="true">
			<view class="msg_con" @click="hideManager">
				<view class="item" 
				v-for="(item,index) in msgList" 
				:key="index" 
				:class="name===item.name?'reserve':''">
					<!-- v-if="item.to_client_id !==id" -->
					<view class="ox" >  <!-- v-if="item.to_client_id !=='all'" -->
					<view style="display: flex;justify-content: center;align-items: center;font-size: 26rpx;">
						<text v-if="item.time">{{item.time}}</text>
						<text v-if="item.create_time">{{item.create_time}}</text>
					</view>
						<view class="icon">
							<image :src="item.avatar" mode=""></image>
							<view class="name"><text>{{item.name}}</text></view>
						</view>
						
						<view class="msg">
							
							<text class="text" v-if="item.content_type==='1'">
							{{item.content}}
							</text>
							<view class="expression_icon" v-if="item.content_type==='2'" >
								<!-- <text>对你说</text> -->
							<image :src="item.expressionUrl" mode="widthFix"></image>
							</view>
							<view class="text videoImg"  v-if="item.content_type==='5'" :style="'background: url('+ item.videoImg +')!important;background-size:100% 100%;'">
								<!-- <text>对你说</text> -->
								<view class="video_test" @click="seeVideo(item)"></view>
							</view>
							<view class="audio" v-if="item.content_type==='4'" @click="playAudio(item)">
								<!-- <text>对你说</text> -->
								<image src="../../../static/club/audio_play.png" mode="widthFix"></image>
								<image src="../../../static/club/audio_icon.png" mode="widthFix"></image>
								<!-- <audio :src="item.content"  controls ></audio> -->
							</view>
							<view class="text" v-if="item.content_type==='3'">
								<!-- <text>对你说</text> -->
								<image :src="item.content" @click="seeImg(item.content)" mode="widthFix"></image>
							</view>
						</view>
					</view>
					<!-- <view >
						<view class="time">{{item.time}}</view>
						<view class="rox">
							<view class="icon">
								<image src="../../../static/logo.png" mode="widthFix"></image>
							</view>
							<view class="msg">
								<view class="name"><text>{{item.name}}</text></view>
								<view class="text" v-if="item.content_type==='1'"> {{item.content}}</view>
								<view class="text" v-if="item.content_type==='5'">
									<view class="video_test" @click="seeVideo(item)"></view>
								</view>
								<view class="" v-if="item.content_type==='4'">
									<audio :src="item.content" controls></audio>
								</view>
								<view class="text" v-if="item.content_type==='3'">
									<image :src="item.content" mode="widthFix"></image>
								</view>
						
							</view>
						</view>
					</view> -->
					

				</view>
			</view>


		</scroll-view>


		<!-- @click="addImg" -->
		<!-- <view class="bottom_fixed">
			<view class="send">
				<image class="add" @click="open" src="../../../static/club/club_add.png" mode="widthFix"></image>
				<view class="inp"><input type="text"  @focus="change" v-model="inp" /> </view>
				<image class="img" @click="setManager" src="../../../static/club/expression.png" mode="widthFix"></image>
				<image class="send_icon" @click="send" src="../../../static/club/send.png" mode="widthFix"></image>
			</view> -->
		<view class="bottom_fixed">
			<view class="send">
				<image class="img" @click="setManager" src="../../../static/club/audio.png" mode="widthFix"></image>
				<view class="inp"><input type="text" @focus="change" v-model="inp" /> </view>
				<image class="add" @click="openExpression" src="../../../static/club/expression.png" mode="widthFix"></image>
				<image v-show="!inpFlog" class="add" @click="open" src="../../../static/club/club_add.png" mode="widthFix"></image>
				<image v-show="inpFlog" class="send_icon" @click="send" src="../../../static/club/send.png" mode="widthFix"></image>
			</view>

			<!-- <view class="bottom_tab">
				<view class="item reserve" 
				v-for="(item,index) in bottomTabList"
				 :key="index" 
				 :class="[index!==bottomTabList.length-1?'active1':'']"
				 @click="goTo(item)">
					<text>{{item.title}}</text>
				</view>
			</view> -->

			<view class="">
				<RecorderManager @getAudio="getAudio" :managerShow="managerShow" imgUrl="firendRoom" />
			</view>
			<view v-show="expressionFlog">
				<scroll-view scroll-y="true" style="height: 400rpx;">
					<view class="expression" v-show="expressionFlog">
						<view class="item" v-for="(item,index) in expressionList" :key="index" @click="chooseExpression(item)">
							<image :src="item.url" mode="widthFix"></image>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>


		<popup ref="popup" type="bottom">
			<view class="pox">
				<view @click="addVideo" style="border-bottom: 1px solid rgba(0,0,0,0.5);">选择视频</view>
				<view @click="addImg">选择图片</view>
			</view>
		</popup>

		<uni-popup type="center" ref="videoPlay" :maskClick="false">
			<view class="video" :style="{height:Height+50+'px'}">
				<image src="../../../static/close.png" mode=""  @click="close"></image>
				<view class="video_view" :style="{height:Height-50+'px'}">
					<video
					id="videoId"
					:style="{height:Height-200+'px'}"
					v-if="videoFlog" 
					:src="videoUrl" 
					objectFit="contain"
					loop
					autoplay></video>
					<!-- :poster="videoImg" 
					controls -->
				</view>
			</view>
		</uni-popup>
		<!-- <image src="../../../static/club/luyin.gif" mode=""></image> -->
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import RecorderManager from '@/components/RecorderManager.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	// #ifdef APP-PLUS
	const videoCompress = uni.requireNativePlugin('Carlos-VideoCompress');
	// #endif
	// import lkAudio from '../../components/lk-audio/lk-audio.vue'
	// import lyDragSlider from '@/components/ly-drag-slider/dc-slider.vue'
	export default {
		components: {
			headers,
			RecorderManager,
			popup,
			// lyDragSlider
		},
		data() {
			return {
				title: '沙龙',
				topTabList: [{
						title: '公告',
						url: './announcement'
					},
					{
						title: '环境',
						url: './surroundings'
					},
					{
						title: '分享',
						url: './share'
					},
					{
						title: '垂钓',
						url: ''
					},
					{
						title: '现场',
						url: './fieldService'
					}
				],
				bottomTabList: [{
						title: '找钓场',
						url: './message/map/map'
					},
					{
						title: '沙龙',
						url: ''
					},
					{
						title: '通讯录',
						url: './friendList/friendList'
					},
					{
						title: '圈子',
						url: ''
					}
				],
				ind: 0,
				Height: '',
				socketTask: null,
				inp: '',
				msgList: [],
				name: '',
				id: '',
				scrollTop: 1000000,
				managerShow: false, //录音相关数据
				token: '',
				videoUrl: '',
				videoFlog: false,
				clientid: '',
				userid: '',
				inpFlog: false,
				expressionList: [{
						val: 'img9',
						url: '../../../static/expression/9.gif'
					},
					{
						val: 'img11',
						url: '../../../static/expression/11.gif'
					},
					{
						val: 'img12',
						url: '../../../static/expression/12.gif'
					},
					{
						val: 'img13',
						url: '../../../static/expression/13.gif'
					},
					{
						val: 'img14',
						url: '../../../static/expression/14.gif'
					},
					{
						val: 'img15',
						url: '../../../static/expression/15.gif'
					},
					{
						val: 'img16',
						url: '../../../static/expression/16.gif'
					},
					{
						val: 'img17',
						url: '../../../static/expression/17.gif'
					},
					{
						val: 'img18',
						url: '../../../static/expression/18.gif'
					},
					{
						val: 'img19',
						url: '../../../static/expression/19.gif'
					},
					{
						val: 'img20',
						url: '../../../static/expression/20.gif'
					},
					{
						val: 'img21',
						url: '../../../static/expression/21.gif'
					},
					{
						val: 'img22',
						url: '../../../static/expression/22.gif'
					},
					{
						val: 'img23',
						url: '../../../static/expression/23.gif'
					},
					{
						val: 'img24',
						url: '../../../static/expression/24.gif'
					},
					{
						val: 'img25',
						url: '../../../static/expression/25.gif'
					},
					{
						val: 'img26',
						url: '../../../static/expression/26.gif'
					},
					{
						val: 'img27',
						url: '../../../static/expression/27.gif'
					},
					{
						val: 'img28',
						url: '../../../static/expression/28.gif'
					},
					{
						val: 'img29',
						url: '../../../static/expression/29.gif'
					},
					{
						val: 'img30',
						url: '../../../static/expression/30.gif'
					},
					{
						val: 'img31',
						url: '../../../static/expression/31.gif'
					},
					{
						val: 'img32',
						url: '../../../static/expression/32.gif'
					},
					{
						val: 'img33',
						url: '../../../static/expression/33.gif'
					},
					{
						val: 'img34',
						url: '../../../static/expression/34.gif'
					},
					{
						val: 'img35',
						url: '../../../static/expression/35.gif'
					},
					{
						val: 'img36',
						url: '../../../static/expression/36.gif'
					},
					{
						val: 'img37',
						url: '../../../static/expression/37.gif'
					},
					{
						val: 'img38',
						url: '../../../static/expression/38.gif'
					},
					{
						val: 'img39',
						url: '../../../static/expression/39.gif'
					},
					{
						val: 'img46',
						url: '../../../static/expression/46.gif'
					},
					{
						val: 'img47',
						url: '../../../static/expression/47.gif'
					},
					{
						val: 'img48',
						url: '../../../static/expression/48.gif'
					},
					{
						val: 'img49',
						url: '../../../static/expression/49.gif'
					},
					{
						val: 'img50',
						url: '../../../static/expression/50.gif'
					},
					{
						val: 'img66',
						url: '../../../static/expression/66.gif'
					},
					{
						val: 'img67',
						url: '../../../static/expression/67.gif'
					},
					{
						val: 'img68',
						url: '../../../static/expression/68.gif'
					},
					{
						val: 'img69',
						url: '../../../static/expression/69.gif'
					},
					{
						val: 'img70',
						url: '../../../static/expression/70.gif'
					},
					{
						val: 'img71',
						url: '../../../static/expression/71.gif'
					},
					{
						val: 'img72',
						url: '../../../static/expression/72.gif'
					},
					{
						val: 'img73',
						url: '../../../static/expression/73.gif'
					},
					{
						val: 'img83',
						url: '../../../static/expression/83.gif'
					},
					{
						val: 'img84',
						url: '../../../static/expression/84.gif'
					},
					{
						val: 'img85',
						url: '../../../static/expression/85.gif'
					},
					{
						val: 'img86',
						url: '../../../static/expression/86.gif'
					},
					{
						val: 'img87',
						url: '../../../static/expression/87.gif'
					},
					{
						val: 'img88',
						url: '../../../static/expression/88.gif'
					},
					{
						val: 'img89',
						url: '../../../static/expression/89.gif'
					},
					{
						val: 'img90',
						url: '../../../static/expression/90.gif'
					},
					{
						val: 'img91',
						url: '../../../static/expression/91.gif'
					}
				],
				expressionFlog: false,
				videoImg:''
			};
		},
		onUnload() {
			this.socketTask.close({
				code: 1000,
				reason: 'test',
				success: (res) => {
					console.log(res)
				}
			})
		},
		watch: {
			inp() {
				this.inpFlog = this.inp.length !== 0;
				// console.log(this.inpFlog)
			}
		},
		onLoad(e) {
			let data = uni.getStorageSync('userinfo');
			console.log(e)
			let str = JSON.parse(e.data);
			this.title = str.username;
			uni.setNavigationBarTitle({
				title:str.username
			})
			this.str = str;
			this.userid = str.userid;
			this.getMsgList(str.userid);
			if (str.clientid) {
				this.clientid = str.clientid;
				this.socketTask = uni.connectSocket({
					url: 'ws://47.95.39.75:9715',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						var login_data = {
							"type": "login",
							'token': data.token,
							join_type: ' onechat'
						};
						setTimeout(() => {
							this.socketTask.send({
								data: JSON.stringify(login_data)
							});

							this.socketTask.onMessage((data) => {
								this.onmessage(data);
							})
						}, 500)
					},
					fail: (err) => {

					}
				});
				uni.getSystemInfo({
					success: (res) => {
						this.Height = res.windowHeight - 50  ; //50
					}
				});
			}
			this.scrollTop = new Date().getTime();
		},

		onShow() {
			let {
				token
			} = uni.getStorageSync('userinfo');
			if (token) {
				this.token = token;
			}
		},
		onUnload() {
			uni.removeStorageSync('beforeUrl');
		},
		methods: {
			playAudio(item){
				console.log(item)
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = item.content;
				innerAudioContext.onPlay(() => {
				  console.log('开始播放');
				});
				innerAudioContext.onError((res) => {
				  console.log(res.errMsg);
				  console.log(res.errCode);
				});
			},//播放音频
			seeImg(url){
				uni.previewImage({
					urls:[url]
				})
			},//预览图片
			openExpression() {
				this.expressionFlog = true;
				this.managerShow = false;
			}, //打开表情
			chooseExpression(item) {
				// console.log(item)
				let time = new Date().getTime();
				let obj = {
					type: 'say',
					from_client_id: this.id,
					// from_client_name:'test',
					to_userid: this.userid,
					content_type: '2',
					content: item.val,
					time,
					token: this.token
				}
				let str = JSON.stringify(obj);
				this.socketTask.send({
					data: str,
					success: (res) => {
						this.inp = '';
						this.expressionFlog = false
					}
				})
			}, //选择表情
			async getMsgList(id) {
				let {
					token
				} = uni.getStorageSync('userinfo');
				let obj = {
					token,
					userid: id,
					offset: 1,
					limit: 1000
				};
				let res = await this.$Post('/api/Userfriend/Getchatuserlist', obj);
				console.log(res)
				if (res.data.code === 1) {
					res.data.data.list.forEach((val,ind)=>{
						val.avatar = val.from_avatar;
						val.name = val.from_username;
						if(val.content_type==='5'){
							 val.videoImg = val.content.slice(0,val.content.length-3)+'jpg';
						}
						if(val.content_type==='2'){
								this.expressionList.forEach((v,i)=>{
								 if(v.val===val.content){
								 val.expressionUrl = v.url;
								}
							})
						}
					})
					this.msgList = res.data.data.list;
					setTimeout(() => {
						this.scrollTop = new Date().getTime();
					}, 1000)
				}
				console.log(this.msgList)
			}, //获取单聊记录
			close() {
				this.videoFlog = false;
				this.$refs.videoPlay.close();
			}, //关闭弹窗
			seeVideo(item) {
				console.log(item);
				this.videoUrl = item.content;
				this.videoImg = item.videoImg;
				this.$refs.videoPlay.open();
				this.videoFlog = true;
				
			}, //查看视频
			getRequestMsg(msg) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: `${this.baseUrl}api/common/upload`,
						filePath: msg,
						name: 'file',
						formData: {
							'token': this.token
						},
						success: (uploadFileRes) => {
							uni.hideLoading();
								console.log(uploadFileRes)
								if(uploadFileRes.statusCode===413){
									this.$Toast('文件过大，请先压缩');
									return
								}
								let msg = JSON.parse(uploadFileRes.data);
								
								if(msg.code===1){
									console.log(msg.data.url)
									resolve(msg.data.url);
								}
							},
							fail(err) {
								uni.hideLoading();
								this.$Toast(err);
								reject(err)
							}
					});
				})
			}, //获取拿到数据发送后的返回数据
			addVideo() {
				this.$refs.popup.close();
				let time = new Date().getTime();
				
				uni.chooseVideo({
					// sourceType:['album','camera'],
					success: async(res) => {
						// console.log(res.tempFilePath)
						// console.log(plus.io.convertLocalFileSystemURL(res.tempFilePath))
						// console.log(res.tempFilePath.indexOf('_doc'))
						let mobileUrl = '';
						if(res.tempFilePath.indexOf('_doc')===0||res.tempFilePath.indexOf('_www')===0){
							mobileUrl = plus.io.convertLocalFileSystemURL(res.tempFilePath);
						}else{
							mobileUrl=res.tempFilePath;
						}
						
						if(res.size>10000000){
							uni.showLoading({
								mask:true
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
									uni.hideLoading();
									let obj = {
										type: 'say',
										from_client_id: this.id,
										// from_client_name:'test',
										to_userid: this.userid,
										content_type: '5',
										content: data,
										time,
										token: this.token
									}
									let str = JSON.stringify(obj);
									this.socketTask.send({
										data: str,
										success:(res)=>{
											console.log(res)
										}
									})
								}else{
									uni.hideLoading();
									this.$Toast('压缩失败');
								}
							})
						}else{
							let data = await this.getRequestMsg(mobileUrl);
							console.log(data)
							uni.hideLoading();
							let obj = {
								type: 'say',
								from_client_id: this.id,
								// from_client_name:'test',
								to_userid: this.userid,
								content_type: '5',
								content: data,
								time,
								token: this.token
							}
							let str = JSON.stringify(obj);
							this.socketTask.send({
								data: str,
								success:(res)=>{
									console.log(res)
								}
							})
						}
						
						// uni.showLoading({
						// 	title:'正在压缩'
						// })
						// this.yaSuo(mobileUrl,async(path)=>{
						// 	console.log(path);
						// 	if(path){
						// 		console.log(path);
						// 		// uni.hideLoading();
						// 		let arr =  path.split('.');
						// 		if(arr[1]==='3gp'){
						// 			console.log('11111')
						// 			this.$Toast('视频文件格式无法上传');
						// 			uni.hideLoading();
						// 			return
						// 		}
						// 		console.log(path);
						// 		let data = await this.getRequestMsg(path);
						// 		console.log(data)
						// 		uni.hideLoading();
						// 		let obj = {
							// type: 'say',
							// from_client_id: this.id,
							// // from_client_name:'test',
							// to_userid: this.userid,
							// content_type: '5',
							// content: data,
							// time,
							// token: this.token
						// 		}
						// 		let str = JSON.stringify(obj);
						// 		this.socketTask.send({
						// 			data: str,
						// 			success:(res)=>{
						// 				console.log(res)
						// 			}
						// 		})
						// 	}else{
						// 		uni.hideLoading();
						// 		this.$Toast('压缩失败');
						// 	}
						// })
					}
				})
				// uni.chooseVideo({
				// 	sourceType: ['album', 'camera'],
				// 	maxDuration: 30,
				// 	camera: 'front',
				// 	success: async (res) => {
				// 		let arr = res.tempFilePath.split('.');

				// 		if (arr[1] === '3gp') {
				// 			this.$Toast('视频文件格式无法上传');
				// 			return
				// 		}
				// 		uni.showLoading();
				// 		console.log(res.tempFilePath);
				// 		let data = await this.getRequestMsg(res.tempFilePath);
				// 		// uni.hideLoading();
				// 		console.log(data);
				// 		let obj = {
				// 			type: 'say',
				// 			from_client_id: this.id,
				// 			// from_client_name:'test',
				// 			to_userid: this.userid,
				// 			content_type: '5',
				// 			content: data,
				// 			time,
				// 			token: this.token
				// 		}
				// 		let str = JSON.stringify(obj);
				// 		this.socketTask.send({
				// 			data: str,
				// 			success: (res) => {
				// 				console.log(res)
				// 			}
				// 		})
				// 		// console.log(res.tempFilePath);
				// 	}
				// })
			}, //选择视频
			yaSuo(source,callback){
				videoCompress.compress({source,bitRate:55000,size:2048}, (result) => {
					// console.log(result)
					if(result.status==='success'){
						// console.log(result.path);
						callback(result.path);
					}
					
				});
			},
			open() {
				this.$refs.popup.open();
				this.managerShow = false;
				this.expressionFlog = false;
			}, //打开弹窗
			async getAudio(e) {
				let time = new Date().getTime();
				let obj = {
					type: 'say',
					from_client_id: this.id,
					// from_client_name:'test',
					to_userid: this.userid,
					content_type: '4',
					content: e,
					time,
					token: this.token
				}
				let str = JSON.stringify(obj);
				this.socketTask.send({
					data: str,
					success: (res) => {
						console.log(res)
						this.managerShow = false;
					}
				})
				
			}, //获取音频地址
			change() {
				this.managerShow = false;
				this.expressionFlog = false;
			},
			addImg() {
				this.$refs.popup.close();
				this.managerShow = false;
				let time = new Date().getTime();
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						console.log(res.tempFilePaths[0]);
						let data = await this.getRequestMsg(res.tempFilePaths[0]);
						let obj = {
							type: 'say',
							from_client_id: this.id,
							// from_client_name:'test',
							to_userid: this.userid,
							content_type: '3',
							content: data,
							time,
							token: this.token
						}
						let str = JSON.stringify(obj);
						this.socketTask.send({
							data: str,
							success: (res) => {
								console.log(res)
							}
						})
						console.log(data)
					}
				})
			}, //添加图片
			setManager() {
				this.managerShow = true;
				this.expressionFlog = false;
			}, //调出语音
			hideManager() {
				this.managerShow = false;
			},
			choose(item, index) {
				this.ind = index;
				this.managerShow = false;
				if (item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
			},
			goTo(item) {
				this.managerShow = false;
				if (item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
			},
			send() {
				this.managerShow = false;
				this.expressionFlog = false;
				let time = new Date().getTime();
				let obj = {
					type: 'say',
					from_client_id: this.id,
					// from_client_name:'test',
					to_userid: this.userid,
					content_type: '1',
					content: this.inp,
					time,
					token: this.token
				}
				let str = JSON.stringify(obj);
				this.socketTask.send({
					data: str,
					success: (res) => {
						console.log(res)
						this.inp='';
					}
				})
			},
			// 服务端发来消息时
			onmessage(e) {
				var data = JSON.parse(e.data);
				// console.log(data['type'])
				switch (data['type']) {
					// 服务端ping客户端
					case 'ping':
						this.socketTask.send({
							data: `{'type':'pong','token':${getApp().globalData.token}}`
						})
						break;
					case 'groupmsg':
						break;
					case 'login':
						this.name = data.client_name;
						this.id = data.client_id;
						// client_id
						break;
					case 'say':
						// console.log(this.name,'-------')
						if (data.content_type === '2') {
							this.expressionList.forEach((val, ind) => {
								if (val.val === data.content) {
									data.expressionUrl = val.url;
								}
							})
						}
						if(data.content_type==='5'){
							if(data.content.indexOf('http')===-1){
								 data.content = this.baseUrl+data.content;
							}
							data.videoImg =data.content.slice(0,data.content.length-3)+'jpg';
							 console.log(data)
						}
						if(data.content_type==='3'){
							 if(data.content.indexOf('http')===-1){
								 data.content = this.baseUrl+data.content;
							 }
						}
						data.name = data.from_client_name;
						this.msgList.push(data);
						console.log(this.name, data)
						this.$nextTick(() => {
							this.scrollTop = new Date().getTime();
						})

						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.audio{
		width: 200rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #FAFAFA;
		box-sizing: border-box;
		padding: 8rpx 15rpx;
		border-radius: 10rpx;
		image{
			width: 50rpx;
		}
	}
	.expression_icon {
		image {
			width: 45rpx;
		}
	}

	.expression {
		width: 100%;
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		padding: 40rpx 40rpx;
		// justify-content: center;
		flex-wrap: wrap;

		.item {
			width: 20%;
			margin-bottom: 15rpx;
			text-align: center;

			image {
				width: 50rpx;
				margin: 0 auto;
			}
		}
	}

	.video{
		width: 100%;
		// height: 600rpx;
		background: #000000;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.video_view{
			width: 750rpx;
			// height: 600rpx;
			background: black;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		image{
			width: 50rpx;
			height: 50rpx;
			text-align: left;
			margin-bottom: 0rpx;
			display: flex;
			align-self: flex-start;
			margin-left: 40rpx;
			// z-index: 100;
			// position: relative;
		}
		video{
			width: 750rpx;
			// height: 500rpx;
		}
	}

	.top_hr {
		width: 100%;
		height: 160rpx;
	}

	.pox {
		width: 100%;
		background: white;
		box-sizing: border-box;
		padding: 0rpx 0;

		view {
			text-align: center;
			font-size: 30rpx;
			box-sizing: border-box;
			padding: 45rpx 0;

		}
	}

	.msg_con {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 20rpx 20rpx 20rpx;

		// overflow-y: scroll;
		.item {
			display: flex;
			// flex-direction: row;
			flex-direction: column;
			// align-items: center;
			// height: 140rpx;
			margin-bottom: 30rpx;
           .ox{
			   
				display: flex;
				flex-direction: column;
			}
			.rox {
				display: flex;
				flex-direction: row;
				align-items: center;

			}

			.time {
				text-align: center;
				font-size: 27rpx;
				color: #333333;
			}
			.icon{
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 27rpx;
			}
			.msg{
				// width: 200rpx;
				display: flex;
				flex-direction: row;
				align-self: flex-start;
				margin-left: 80rpx;
				.text{
					width: auto;
					display: inline-block;
					background: #FAFAFA;
					background-size: 100% 100% !important;
					image{
						width: 250rpx;
					}
				}
			}
		}

		.reserve {
			display: flex;
			flex-direction: column;
			.rox {
				display: flex;
				flex-direction: row-reverse;
				align-items: center;
			}
			.icon{
				display: flex;
				flex-direction: row-reverse;
				align-items: center;
			}
			.ox{
				display: flex;
				flex-direction: column;
			}
			.text {
				// background: #FAFAFA;
				background: #41C2FF !important;
				color: white !important;
				// color: white !important;
			}

			.msg {
				// width: auto;
				display: flex;
				// flex-direction: column;
				flex-direction: row;
				align-self: flex-end;
				text-align: right !important;
				text{
					width: auto;
				}
				// flex-direction: row-reverse;
				.expression_icon{
					margin-right: 20rpx;
				}
			}

			.icon {
				image {
					margin-left: 15rpx;
				}
			}
		}

		.reserve,
		.item {
			.icon {
				// margin-bottom: 10rpx;
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			}

			.msg {
				height: 100%;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				text-align: left;
				margin-right: 80rpx;
				.video_test {
					width: 60rpx;
					height: 60rpx;
					border: 1px solid #FAFAFA;
					background: url(../../../static/club/bofang.png) no-repeat 45% 45%;
					// background: url(../../static/club/play.png) no-repeat 45% 45%;
					// background: url(../../static/logo.png) no-repeat;
					background-size: 80% 80%;
				}

				.name {
					font-size: 24rpx;
					color: #666666;
					text-indent: 10rpx;
					
				}

				.text {
					font-size: 24rpx;
					color: #333333;
					box-sizing: border-box;
					padding: 12rpx 25rpx;
					border-radius: 8rpx;
					margin-right: 35rpx;
					background-size: 100% 100% !important;
					text-align: left;
				}
			}
		}
	}

	.active1 {
		border-right: 2px solid white;
	}

	.bottom_fixed {
		width: 100%;
		position: fixed;
		bottom: 0rpx;

		// z-index: 9999;
		.send {
			width: 100%;
			height: 100rpx;
			background: #F8F8F8;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding: 0 20rpx;

			.add {
				width: 40rpx;
				margin-right: 15rpx;
			}

			.inp {
				width: 60%;
				background: white;
				margin-right: 15rpx;
				padding: 10rpx 0;

				inp {
					padding: 10rpx 0;
					font-size: 28rpx;
				}
			}

			.img {
				width: 40rpx;
				margin-right: 15rpx;
			}

			.send_icon {
				width: 70rpx;
				height: 70rpx;
			}
		}

		.bottom_tab {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.item {
				box-sizing: border-box;
				background: #33BEFF;
				height: 100%;
				width: 25%;
				font-size: 30rpx;
				color: white;
				line-height: 110rpx;
				text-align: center;
			}
		}
	}

	.active {
		color: #24BAFF !important;
	}

	.top_tab {
		background: #F8F8F8;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 120rpx;

		.item {
			width: 16%;
			border: 1px solid #B2E5FF;
			margin: 0 10rpx;
			font-size: 24rpx;
			color: #333333;
			text-align: center;
			padding: 10rpx 0;
			border-radius: 10rpx;
		}
	}
	.videoImg{
		width: 300rpx !important;
		height: 300rpx !important;
		background-size: 100% 100% !important;
		position: relative;
		.video_test{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			border: none !important;
		}
		
	}
</style>
