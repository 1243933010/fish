<template>
	<view>
		<!-- <view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="沙龙" :leftIcon="true" />
		</view> -->
		<view class="top_tab">
			<view class="item" 
			:class="[ind===index?'active':'']"
			 v-for="(item,index) in topTabList" 
			 :key="index" 
			 @click="choose(item,index)">
				<text>{{item.title}}</text>
			</view>
		</view>

<scroll-view 
scroll-y="true" 
:style="{height:Height+'px'}"
 :scroll-top="scrollTop"
 scroll-with-animation="true">
	<view class="msg_con"  @click="hideManager">
		<view class="item" 
		v-for="(item,index) in msgList" 
		:key="index" 
		:class="name===item.name?'reserve':'res'"
		>
		<!-- v-if="item.to_client_id !==id" -->
		<view v-if="!item.to_client_id||item.to_client_id ==='all'">
			<view class="time">{{item.time}}</view>
				<view class="rox">
					<view class="icon"  >
						<image :src="item.avatar" mode="" @click="goToUser(item)"></image>
						<view class="name"><text>{{item.name}}</text></view>
					</view>
					<view class="msg">
						<view class="text" v-if="item.content_type==='1'">
						{{item.content}}
						</view>
						<view class="expression_icon" v-if="item.content_type==='2'" >
						<image :src="item.expressionUrl" mode="widthFix"></image>
						</view>
						<view class="text videoImg" v-if="item.content_type==='5'" :style="'background: url('+ item.videoImg +');'">
							<view  class="video_test" @click="seeVideo(item)"></view>
						</view>
						<view class="audio"  v-if="item.content_type==='4'" @click="playAudio(item)">
							<image src="../../static/club/audio_play.png" mode="widthFix"></image>
							<image src="../../static/club/audio_icon.png" mode="widthFix"></image>
						</view>
						<view class="text" v-if="item.content_type==='3'">
							<image @click="seeimg(item.content)" :src="item.content" mode="widthFix"></image>
						</view>
						
					</view>
				</view>
		</view>
		<view class="" v-if="item.to_client_id&&item.to_client_id !=='all'">
			<view class="icon"  >
				<image :src="item.avatar" mode="" @click="goToUser(item)"></image>
				<view class="name"><text>{{item.name}}</text></view>
			</view>
			<view class="msg">
				<view class="text" v-if="item.content_type==='1'">
				对你说：{{item.content}}
				</view>
				<view class="expression_icon" v-if="item.content_type==='2'" >
					<text>对你说</text>
				<image :src="item.expressionUrl" mode="widthFix"></image>
				</view>
				<view class=""  v-if="item.content_type==='5'">
					<text>对你说</text>
					<view class="text videoImg" :style="'background: url('+baseUrl+ item.videoImg +');'">
						<view class="video_test" @click="seeVideo(item)"></view>
					</view>
				</view>
				<view class="audio"   v-if="item.content_type==='4'" @click="playAudio(item)">
					<image src="../../static/club/audio_play.png" mode="widthFix"></image>
					<image src="../../static/club/audio_icon.png" mode="widthFix"></image>
				</view>
				<view class="text" v-if="item.content_type==='3'">
					<text>对你说</text>
					<image @click="seeimg(baseUrl+item.content)" :src="baseUrl+item.content" mode="widthFix"></image>
				</view>
			</view>
		</view>
			
		</view>
	</view>
	

</scroll-view>
		

		<view class="bottom_fixed">
			<view class="send">
				<image class="img" @click="setManager" src="../../static/club/audio.png" mode="widthFix"></image>
				<view class="inp"><input type="text"  @focus="change" v-model="inp" /> </view>
				<image class="add" @click="openExpression" src="../../static/club/expression.png" mode="widthFix"></image>   
				<image v-show="!inpFlog" class="add" @click="open" src="../../static/club/club_add.png" mode="widthFix"></image>
				<image v-show="inpFlog" class="send_icon" @click="send" src="../../static/club/send.png" mode="widthFix"></image>
			</view>
			
			
			<view class="bottom_tab">
				<view class="item reserve" 
				v-for="(item,index) in bottomTabList"
				 :key="index" 
				 :class="[index!==bottomTabList.length-1?'active1':'']"
				 @click="goTo(item)">
					<text>{{item.title}}</text>
				</view>
			</view>
			
			<view class="">
				  <RecorderManager  @getAudio="getAudio" :managerShow="managerShow"/>
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
		
		<uni-popup type="center" ref="videoPlay" >
			<view class="video" :style="{height:Height+150+'px'}">
				<image src="../../static/close.png" mode=""  @click="close"></image>
				<view class="video_view" :style="{height:Height+'px'}">
					<video
					:style="{height:Height-100+'px'}"
					id="videoId"
					v-if="videoFlog" 
					:src="videoUrl" 
					objectFit="contain"
					loop
					autoplay></video>
				</view>
			</view>
		</uni-popup>
		
	
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import RecorderManager from '@/components/RecorderManager.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	// import lkAudio from '../../components/lk-audio/lk-audio.vue'
	// import lyDragSlider from '@/components/ly-drag-slider/dc-slider.vue'
	// #ifdef APP-PLUS
	const videoCompress = uni.requireNativePlugin('Carlos-VideoCompress');
	// #endif
	export default {
		components: {
			headers,
			RecorderManager,
			popup,
			// lyDragSlider
		},
		data() {
			return {
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
						url: './fishing'
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
						title: '在线列表',
						url: './message/onlineList'
					},
					{
						title: '通讯录',
						url: './friendList/friendList'
					},
					{
						title: '圈子',
						url: './friendList/firendCircle/firendCircle'
					}
				],
				ind: 0,
				Height: '',
				socketTask: null,
				inp:'',
				msgList:[],
				name:'',
				id:'',
				scrollTop:1000000,
				managerShow:false,//录音相关数据
				token:'',
				videoUrl:'',
				videoFlog:false,
				join_type:'room',
				roomId:null,
				inpFlog:false,
				expressionList:[
					{val:'img9',url:'../../static/expression/9.gif'},
					{val:'img11',url:'../../static/expression/11.gif'},
					{val:'img12',url:'../../static/expression/12.gif'},
					{val:'img13',url:'../../static/expression/13.gif'},
					{val:'img14',url:'../../static/expression/14.gif'},
					{val:'img15',url:'../../static/expression/15.gif'},
					{val:'img16',url:'../../static/expression/16.gif'},
					{val:'img17',url:'../../static/expression/17.gif'},
					{val:'img18',url:'../../static/expression/18.gif'},
					{val:'img19',url:'../../static/expression/19.gif'},
					{val:'img20',url:'../../static/expression/20.gif'},
					{val:'img21',url:'../../static/expression/21.gif'},
					{val:'img22',url:'../../static/expression/22.gif'},
					{val:'img23',url:'../../static/expression/23.gif'},
					{val:'img24',url:'../../static/expression/24.gif'},
					{val:'img25',url:'../../static/expression/25.gif'},
					{val:'img26',url:'../../static/expression/26.gif'},
					{val:'img27',url:'../../static/expression/27.gif'},
					{val:'img28',url:'../../static/expression/28.gif'},
					{val:'img29',url:'../../static/expression/29.gif'},
					{val:'img30',url:'../../static/expression/30.gif'},
					{val:'img31',url:'../../static/expression/31.gif'},
					{val:'img32',url:'../../static/expression/32.gif'},
					{val:'img33',url:'../../static/expression/33.gif'},
					{val:'img34',url:'../../static/expression/34.gif'},
					{val:'img35',url:'../../static/expression/35.gif'},
					{val:'img36',url:'../../static/expression/36.gif'},
					{val:'img37',url:'../../static/expression/37.gif'},
					{val:'img38',url:'../../static/expression/38.gif'},
					{val:'img39',url:'../../static/expression/39.gif'},
					{val:'img46',url:'../../static/expression/46.gif'},
					{val:'img47',url:'../../static/expression/47.gif'},
					{val:'img48',url:'../../static/expression/48.gif'},
					{val:'img49',url:'../../static/expression/49.gif'},
					{val:'img50',url:'../../static/expression/50.gif'},
					{val:'img66',url:'../../static/expression/66.gif'},
					{val:'img67',url:'../../static/expression/67.gif'},
					{val:'img68',url:'../../static/expression/68.gif'},
					{val:'img69',url:'../../static/expression/69.gif'},
					{val:'img70',url:'../../static/expression/70.gif'},
					{val:'img71',url:'../../static/expression/71.gif'},
					{val:'img72',url:'../../static/expression/72.gif'},
					{val:'img73',url:'../../static/expression/73.gif'},
					{val:'img83',url:'../../static/expression/83.gif'},
					{val:'img84',url:'../../static/expression/84.gif'},
					{val:'img85',url:'../../static/expression/85.gif'},
					{val:'img86',url:'../../static/expression/86.gif'},
					{val:'img87',url:'../../static/expression/87.gif'},
					{val:'img88',url:'../../static/expression/88.gif'},
					{val:'img89',url:'../../static/expression/89.gif'},
					{val:'img90',url:'../../static/expression/90.gif'},
					{val:'img91',url:'../../static/expression/91.gif'}
				],
				expressionFlog:false,
				fishFlog:null,
				videoImg:''
			};
		},
		watch:{
			inp(){
				this.inpFlog = this.inp.length!==0;
			}
		},
		onLoad(e) {
			let data = uni.getStorageSync('userinfo');
			this.name = data.username;
			if(e.id){
				this.roomId = e.id;
			}
			if(data.token){
			 this.token = data.token;
			}
			this.getMsgList(e.id)
			// console.log(e.id)
			this.getFishDetail(e.id);
			// this.$nextTick(()=>{
			// 	this.scrollTop = new Date().getTime();
			// })
			
				uni.getSystemInfo({
					success: (res) => {
						// 50 - 60 
						this.Height = res.windowHeight - 80 - 50-20 ;//50
					}
				});
				
				// let socketTask = getApp().globalData.socketTask;
					this.socketTask = uni.connectSocket({
			    url: 'ws://47.95.39.75:9715',
				 header: {
				        'content-type': 'application/json'
				    },
					success:(res)=>{
						// uni.showToast({
						// 	title:'ssss'
						// })
						var login_data = {"type":"login",
						 "room_id":this.roomId,
						 'token':data.token,
						 join_type:this.join_type
						 }; 
						setTimeout(()=>{
							this.socketTask.send({data:JSON.stringify(login_data)});
							this.socketTask.onMessage((data)=> {
								this.onmessage(data);
							})
						},500)
						 
					},
					fail:(err)=>{
						// console.log(err)
					}
			});
			this.scrollTop = new Date().getTime();
		},
		
		onUnload() {
			uni.removeStorageSync('beforeUrl');
			console.log('111')
			this.socketTask.close({
				code:1000,
				reason:'test',
				success:(res)=>{
					console.log(res)
				}
			})
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
			async getFishDetail(fishground_id){
				let res = await this.$Post('/api/Ground/GroundListinfo',{fishground_id})
				if(res.data.code===1){
					if(res.data.data.is_setin==='1'){
						this.fishFlog = false;
					}else if(res.data.data.is_setin==='2'){
						this.fishFlog = true;
					}
				}
			},
			goToUser(item){
				uni.navigateTo({
					url:`./message/userPage?userid=${item.userid}`
				})
				console.log(item);
			},
			seeimg(url){
				uni.previewImage({
					urls:[url]
				})
			},//聊天图片预览
			openExpression(){
				if(!this.fishFlog){
					this.$Toast('该钓场未入驻');
					return;
				}
				this.expressionFlog = true;
				this.managerShow = false;
			},//打开表情
			chooseExpression(item){
				if(!this.fishFlog){
					this.$Toast('该钓场未入驻');
					return;
				}
				// console.log(item)
				let time = new Date().getTime();
				let obj = {
					type:'say',
					from_client_id:this.id,
					// from_client_name:'test',
					to_userid:"all",
					content_type:'2',
					content:item.val,
					time,
					token:this.token
				}
				let str = JSON.stringify(obj);
				this.socketTask.send({
					data: str,
					success:(res)=>{
						this.inp = '';
						this.expressionFlog = false
					}
				})
			},//选择表情
			async getMsgList(id){
				let obj = {roomid:id,offset:1,limit:50};
				let res = await this.$Post('/api/Userfriend/Getchatgrouplist',obj);
				if(res.data.code===1){
					res.data.data.list.forEach((val,ind)=>{
						val.name = val.username;
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
					setTimeout(()=>{
						this.scrollTop = new Date().getTime();
					},1000)
				}
				console.log(res)
			},//获取群聊记录
			close(){
				this.videoFlog = false;
				this.$refs.videoPlay.close();
			},//关闭弹窗
			seeVideo(item){
				console.log(item);
				//this.baseUrl+
				if(item.content.indexOf('http')===-1){
					this.videoUrl = this.baseUrl+item.content;
				}else{
					this.videoUrl = item.content;
				}
				if(item.videoImg.indexOf('http')===-1){
					this.videoImg = this.baseUrl+item.videoImg;
				}else{
					this.videoImg = item.videoImg;
				}
				// this.videoImg = item.videoImg;
				 
				this.$refs.videoPlay.open();
				this.videoFlog = true;
			},//查看视频
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
									uni.hideLoading();
									console.log(uploadFileRes)
									if(uploadFileRes.statusCode===413){
										this.$Toast('文件过大，请先压缩');
									}
									let msg = JSON.parse(uploadFileRes.data);
									if(msg.code===1){
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
			},//获取拿到数据发送后的返回数据
			addVideo(){
				this.$refs.popup.close();
				let time = new Date().getTime();
				
				
				// 
				uni.chooseVideo({
					// sourceType:['album','camera'],
					success: async(res) => {
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
										type:'say',
										from_client_id:this.id,
										// from_client_name:'test',
										to_userid:"all",
										content_type:'5',
										content:data,
										time,
										token:this.token
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
								type:'say',
								from_client_id:this.id,
								// from_client_name:'test',
								to_userid:"all",
								content_type:'5',
								content:data,
								time,
								token:this.token
							}
							let str = JSON.stringify(obj);
							this.socketTask.send({
								data: str,
								success:(res)=>{
									console.log(res)
								}
							})
						}
						
						
						
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
				// 
				// uni.chooseVideo({
				// 	success: async(res) => {
				// 		let arr =  res.tempFilePath.split('.');
				// 		if(arr[1]==='3gp'){
				// 			this.$Toast('视频文件格式无法上传');
				// 			return
				// 		}
				// 		uni.showLoading();
				// 		console.log(res.tempFilePath);
				// 		let data = await this.getRequestMsg(res.tempFilePath);
				// 		console.log(data);
				// 		// uni.hideLoading();
				// 		let obj = {
				// 			type:'say',
				// 			from_client_id:this.id,
				// 			// from_client_name:'test',
				// 			to_userid:"all",
				// 			content_type:'5',
				// 			content:data,
				// 			time,
				// 			token:this.token
				// 		}
				// 		let str = JSON.stringify(obj);
				// 		this.socketTask.send({
				// 			data: str,
				// 			success:(res)=>{
				// 				console.log(res)
				// 			}
				// 		})
				// 		// console.log(res.tempFilePath);
				// 	}
				// })
			},//选择视频
			yaSuo(source,callback){
				videoCompress.compress({source,bitRate:55000,size:2048}, (result) => {
					console.log(result)
					if(result.status==='success'){
						// console.log(result.path);
						callback(result.path);
					}
					
				});
			},
			open(){
				if(!this.fishFlog){
					this.$Toast('该钓场未入驻');
					return;
				}
				this.$refs.popup.open();
				this.managerShow = false;
				this.expressionFlog = false;
			},//打开弹窗
			async getAudio(e){
				let time = new Date().getTime();
				let obj = {
					type:'say',
					from_client_id:this.id,
					// from_client_name:'test',
					to_userid:"all",
					content_type:'4',
					content:e,
					time,
					token:this.token
				}
				let str = JSON.stringify(obj);
				this.socketTask.send({
					data: str,
					success:(res)=>{
						console.log(res);
						this.managerShow = false;
					}
				})
			},//获取音频地址
			change(){
				setTimeout(()=>{
					this.scrollTop = new Date().getTime();
					this.$forceUpdate();
				},1000)
				console.log('111')
				this.managerShow = false;
				this.expressionFlog = false;
			},
			addImg(){
				this.$refs.popup.close();
				this.managerShow = false;
				let time = new Date().getTime();
				uni.chooseImage({
					count:1,
					sizeType:['compressed'],
					sourceType:['album','camera'],
					success: async(res) => {
						console.log(res.tempFilePaths[0]);
						let data = await this.getRequestMsg(res.tempFilePaths[0]);
						let obj = {
							type:'say',
							from_client_id:this.id,
							// from_client_name:'test',
							to_userid:"all",
							content_type:'3',
							content:data,
							time,
							token:this.token
						}
						let str = JSON.stringify(obj);
						this.socketTask.send({
							data: str,
							success:(res)=>{
								console.log(res)
							}
						})
						console.log(data)
					}
				})
			},//添加图片
			setManager(){
				if(!this.fishFlog){
					this.$Toast('该钓场未入驻');
					return;
				}
				this.managerShow = true;
				this.expressionFlog = false;
			},//调出语音
			hideManager(){
				this.managerShow = false;
				this.expressionFlog = false;
			},
			choose(item, index) {
				this.ind = index;
				this.managerShow = false;
				this.expressionFlog = false;
				// if(item.title==='垂钓'){
				// 	uni.navigateTo({
				// 		url:`./fishing?roomId=${this.roomId}`
				// 	})
				// 	return;
				// }
				if (item.url) {
					uni.navigateTo({
						url: `${item.url}?roomId=${this.roomId}`
					})
				}
			},
			goTo(item){
				this.managerShow = false;
				this.expressionFlog = false;
				if(item.title==='圈子'){
					uni.navigateTo({
						url:`friendList/firendCircle/firendCircle?id=${this.roomId}`
					})
					return
				}
				
				if (item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
			},
			send() {
				if(!this.fishFlog){
					this.$Toast('该钓场未入驻');
					return;
				}
				if(!this.token){
					uni.reLaunch({
						url:'../login/login'
					})
					return;
				}
				this.expressionFlog = false;
				this.managerShow = false;
				
				let time = new Date().getTime();
				let obj = {
					type:'say',
					from_client_id:this.id,
					// from_client_name:'test',
					to_userid:"all",
					content_type:'1',
					content:this.inp,
					time,
					token:this.token
				}
				let str = JSON.stringify(obj);
				this.socketTask.send({
					data: str,
					success:(res)=>{
						this.inp = '';
					}
				})
			},
			// 服务端发来消息时
			onmessage(e) {
				var data = JSON.parse(e.data);
				// console.log(data)
				switch (data['type']) {
					// 服务端ping客户端
					case 'ping':
					    this.socketTask.send({
					    	data:`{'type':'pong','token':${this.token}}`
					    })
						break;
					case 'groupmsg':
					   break;
					case 'login':
					console.log(data,'==========')
					// this.name = data.client_name;
					this.id = data.client_id;
					getApp().globalData.onlineList = data.client_list;
					// client_id
					   break;
					case 'say':
					// console.log(data.to_client_id,this.id,this.id===data.to_client_id);
					
					   if(data.content_type==='2'){
						   this.expressionList.forEach((val,ind)=>{
							   if(val.val===data.content){
								   data.expressionUrl = val.url;
							   }
						   })
					   }
					   
					    if(data.content_type==='5'){
							 data.videoImg = data.content.slice(0,data.content.length-3)+'jpg';
						}
						data.name = data.from_client_name;
						// data.name = data.username;
						console.log(this.name,data.name)
						this.msgList.push(data);
						console.log(this.msgList)
						this.$forceUpdate();
						this.$nextTick(()=>{
							this.scrollTop=new Date().getTime();
						})
						break;
					case 'error':
					    this.$Toast(data.content)
					   break; 
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.name{
		font-size: 26rpx;
	}
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
	.videoImg{
		width: 300rpx;
		height: 300rpx;
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
	.expression_icon{
		image{
			width: 45rpx;
		}
	}
	.expression{
		width: 100%;
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		padding: 40rpx 40rpx;
		// justify-content: center;
		flex-wrap: wrap;
		.item{
			width: 20%;
			margin-bottom: 15rpx;
			text-align: center;
			image{
				width: 50rpx;
				margin: 0 auto;
			}
		}
	}
	.video{
		width: 100%;
		// height: 500rpx;
		background: black;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.video_view{
			width: 750rpx;
			// height: 600rpx;
			// background: red;
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
		}
		video{
			width: 750rpx;
			// height: 500rpx;
		}
	}
	.top_hr{
		width: 100%;
		height: 160rpx;
		padding-bottom: 0;
	}
	.pox{
		width: 100%;
		background: white;
		box-sizing: border-box;
		padding: 0rpx 0;
		view{
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
			.icon{
				display: flex;
				flex-direction: row;
				align-items: center;
				// margin-bottom: 15rpx;
			}
			.msg{
				display: flex;
				flex-direction: row;
				align-self: flex-start;
				margin-left: 60rpx;
				.text {
					background: #FAFAFA;
					border-radius: 8rpx;
					margin-left: 25rpx;
					display: flex;
					flex-direction: row;
					align-self: flex-start;
					image{
						width: 250rpx;
					}
				}
			}
			.rox{
				display: flex;
				flex-direction: row-reverse;
				flex-direction: column;
				
			}
			.time{
				text-align: center;
				font-size: 27rpx;
				color: #333333;
			}
			
		}

		.reserve {
			display: flex;
			// flex-direction: row-reverse;
			flex-direction: column;
			// align-items: center;
			.rox{
				display: flex;
				flex-direction: row-reverse;
				flex-direction: column;
				// align-items: center;
			}
			

			.msg {
				display: flex;
				flex-direction: row-reverse !important;
				align-self: flex-end !important;
				margin-right: 60rpx;
				margin-left: 0;
				.text {
					// background: #FAFAFA;
					background: #41C2FF;
					color: white !important;
					border-radius: 8rpx;
					margin-right: 25rpx;
				}
			}

			.icon {
				display: flex;
				flex-direction: row-reverse;
				align-items: center;
				.name{
					font-size: 26rpx;
				}
				image {
					width: 80rpx;
					height: 80rpx;
					margin-left: 15rpx;
					// margin-bottom: 15rpx;
				}
			}
		}

		.reserve,
		.item {
			// display: flex;
			// flex-direction: row;
			// align-items: center;
			.icon {
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 15rpx;
					// margin-bottom: 15rpx;
				}
			}

			.msg {
				height: 70% !important;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				// text-align: right;
				
				.video_test{
					width: 60rpx;
					height: 60rpx;
					border: 1px solid #FAFAFA;
					background: url(../../static/club/bofang.png) no-repeat 45% 45%;
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
					// width: 70%;
					font-size: 24rpx;
					color: #333333;
					box-sizing: border-box;
					padding: 12rpx 15rpx;
					display: flex;
					flex-direction: row;
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
		bottom: 0;
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
</style>
