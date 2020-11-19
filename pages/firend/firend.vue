<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="好友列表" rightText="添加" @rightClick="rightClick" />
		</view>


		<view class="firendList">
			<view class="new_firend" @click="notice">
				<view class="icon">
					<image src="../../static/club/new_friend.png" mode="widthFix"></image>
					<text>新的好友</text>
				</view>
				<text class="num" :class="[noticeNum>0?'active':'']">{{noticeNum}}</text>
			</view>
			<view class="firend_box">
				<view class="item" v-for="(item,index) in firendList" :key="index" >
					<view class="user"  @click="goroom(item)">
						<image v-if="item.avatar" @click.stop="goRoom(item)" :src="item.avatar" mode=""></image>
						<image v-if="!item.avatar" src="../../static/logo.png" mode="widthFix"></image>
						<text class="username">{{item.username}}</text>
						<view class="status">
							<text v-if="item.online==='1'">（在线）</text>
							<text v-if="item.online==='0'">（离线）</text>
							<text v-if="item.unreadmsg_num!=='0'">（{{item.unreadmsg_num}}条未读）</text>
						</view>
					</view>

				</view>
			</view>
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
				token: '',
				userinfo: {},
				firendList: [],
				noticeNum: 0,
				time: null,
				offset: 1,
				socketTask:null
			};
		},
		onReachBottom() {
			console.log('111')
			this.getFirendList();
		},
		async onShow() {
			console.log('show')
			this.offset = 1;
			// if(!this.socketTask){
				this.SocketTask();
			// }
			let {
				token
			} = uni.getStorageSync('userinfo');
			this.token = token;
			console.log(token)
			if (!token) {
				uni.reLaunch({
					url: '../login/login'
				});
			}
			let userinfo = uni.getStorageSync('userinfo');
			if (userinfo) {
				this.userinfo = userinfo;
				console.log(userinfo)
				this.getFirendList();
				this.userNotice();
			}
		},
		onLoad() {
			
			let {
				token
			} = uni.getStorageSync('userinfo');
			this.token = token;
			console.log(token)
			if (!token) {
				uni.reLaunch({
					url: '../login/login'
				});
				return
			}
			// this.SocketTask();
		},
		onUnload() {
			console.log('onUnload')
			// this.socketTask = null;
			// console.log('1111')
			// clearInterval(this.time);
			// this.time = null;
			// console.log(this.time);
		},
		onHide() {
			console.log('onHide')
			// this.socketTask.close({
			// 	code:1000
			// })
			// this.socketTask = null;
			// console.log('hide')
			// clearInterval(this.time);
			// this.time = null;
			// console.log(this.time);
		},
		methods: {
			SocketTask(){
				console.log(getApp().globalData.socketTask)
				getApp().globalData.socketTask = uni.connectSocket({
					url: 'ws://47.95.39.75:9715',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						var login_data = {
							"type": "login",
							'token': this.token,
							join_type: 'onechat'
						};
						console.log(res,this.socketTask,login_data)
						setTimeout(() => {
							console.log(this.socketTask)
							getApp().globalData.socketTask.send({
								data: JSON.stringify(login_data)
							});
				
							getApp().globalData.socketTask.onMessage((data) => {
								this.onmessage(data);
							})
						}, 500)
					},
					fail: (err) => {
				
					}
				});
			},
			rightClick() {
				// this.$refs.popup.open();
				uni.navigateTo({
					url: '../club/friendList/addFirend'
				})
			}, //添加好友
			async getFirendList() {
				let obj = {
					token: this.userinfo.token,
					offset: 1,
					limit: 1000
				}
				let res = await this.$Post('/api/Userfriend/firendlist', obj);
				console.log(res);
				if (res.data.code === 1) {
						this.firendList = res.data.data.list;
						this.$forceUpdate();
					    this.offset++;
					
					let arr = 0;
					res.data.data.list.forEach((val, ind) => {
						arr += val.unreadmsg_num * 1
					})
					console.log(arr)
					if (arr > 0) {
						uni.showTabBarRedDot({
							 index: 2
						})
					} else {
						uni.hideTabBarRedDot({
							 index: 2
						})
					}
				}
				// uni.hideLoading();
			}, //好友列表
			async userNotice() {
				let obj = {
					token: this.userinfo.token,
					offset: 1,
					limit: 1000
				}
				let res = await this.$Post('/api/Userfriend/usernotice', obj);
				let num = 0;
				if (res.data.code === 1) {
					if (res.data.data.list.length > 0) {
						res.data.data.list.forEach((val, ind) => {
							if (val.status === '1') {
								num++;
							}
						})
					}
					this.noticeNum = num;
				}
			}, //好友请求数量
			notice() {
				uni.navigateTo({
					url: '../club/friendList/noticeList'
				})
			}, //申请页面
			goRoom(item) {
				
				uni.navigateTo({
					url:`../club/friendList/firendPage?data=${JSON.stringify(item)}`
				})
				// uni.navigateTo({
				// 	url: `../club/friendList/firendRoom?data=${JSON.stringify(item)}`
				// })
				console.log(item)
			}, //好友一对一聊天
			goroom(item){
				console.log('111')
				uni.setStorageSync('beforeUrl',`/pages/club/friendList/firendRoom?data=${JSON.stringify(item)}`);
				uni.navigateTo({
					url:`../club/friendList/firendRoom?data=${JSON.stringify(item)}`
				})
			},
			async onmessage(e) {
				var data = JSON.parse(e.data);
				// console.log(data['type'])
				switch (data['type']) {
					// 服务端ping客户端
					case 'ping':
					// console.log(getApp().globalData)
						try{
							getApp().globalData.socketTask.send({
								// data: `{'type':'pong','token':${getApp().globalData.token}}`
								data: `{'type':'pong','token':${this.token}}`
							})
						}catch(e){
							console.log(e)
							//TODO handle the exception
						}
						break;
					case 'groupmsg':
						break;
					case 'login':
						this.name = data.client_name;
						this.id = data.client_id;
						// client_id
						break;
					case 'say':
						console.log(data,'-------');
						let name = data.from_client_name;
						this.firendList.forEach( async(val,ind)=>{
							if(val.username===name){
								val.unreadmsg_num=(val.unreadmsg_num*1)+1;
								uni.setTabBarBadge({
								  index: 2,
								  text: 'message'
								})
							}
							console.log(val)
						})
						
						this.$forceUpdate();
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-tabbar__reddot{
		width: 10rpx !important;
		height: 10rpx !important;
	}
	.active {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: red;
		border-radius: 50%;
		color: white;
	}

	.top_hr {
		width: 100%;
		height: 160rpx;
	}

	.firendList {
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 0rpx;

		.new_firend {
			box-sizing: border-box;
			padding: 0 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 4px solid #F0F0F0;
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;

			.icon {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 30rpx;
				color: #343434;

				image {
					width: 80rpx;
					margin-right: 15rpx;
				}
			}
		}

		.firend_box {
			width: 100%;

			.item {
				width: 100%;
				margin: 15rpx auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 3px solid #F0F0F0;
				box-sizing: border-box;
				padding: 20rpx 20rpx;

				.user {
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 30rpx;

					image {
						width: 75rpx;
						height: 75rpx;
						border-radius: 50%;
						margin-right: 15rpx;
					}
					.username{
						width: 150rpx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.status {
						font-size: 26rpx;
						color: #9A9A9A;
					}
				}
			}
		}
	}
</style>
