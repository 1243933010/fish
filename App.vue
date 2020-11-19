
<script>
	export default {
		onLaunch() {
			 let data =  uni.getStorageSync('beforeUrl');
			 console.log(data)
			 if(data){
				uni.navigateTo({
					url:data
				}) 
			 }
			// #ifdef APP-PLUS
			   plus.push.addEventListener('click',function(msg) {  
			                setTimeout(() => {  
			          //           uni.showModal({  
			          //                 title: '提示',  
			          //                 content: `点击数据：${msg}`,  
			          //                 success: function (res) {  
			          //                     // 用户点击确定  
			          //                     if (res.confirm) {  
											  // console.log(msg.content);
			          //                         plus.push.clear();  
											  // // 移除 所有消息  
			          //                     } else if (res.cancel) {  
			          //                         // 用户点击取消  
			          //                     }  
			          //               }  
			          //           });  
			                }, 100);  
			            },false);  
			// 监听在线消息事件     要带透传数据，才会响应 receive事件  
			            plus.push.addEventListener('receive',function(msg) {  
			                    setTimeout(() => {  
			         //                uni.showModal({  
			         //                    title: '提示',  
			         //                    content: `透传数据：${msg}`,  
			         //                    success: function (res) {  
			         //                        if (res.confirm) {  
												// console.log(msg.content)
			         //                             // 用户点击确定  
			         //                        } else if (res.cancel) {  
			         //                            // 用户点击取消  
			         //                        }  
			         //                      }  
			         //                });  
			                    }, 100);  
			                },  
			                false  
			            );
			// #endif
			
			
			// #ifdef APP-PLUS  
			 plus.screen.lockOrientation("portrait-primary");  //锁定竖屏
			// plus.runtime.openURL('https://www.baidu.com')  //打开浏览器
			let cid;
			plus.push.getClientInfoAsync((info) => {
				cid = info.clientid;
				getApp().globalData.clientid = cid;
			}, err => {}); //获取当前手机得cid

			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				// console.log(plus.runtime.appid)
				console.log(widgetInfo.version); //获取应用版本名称
				uni.getSystemInfo({
					success: async (data) => {
						let os_type = '';
						data.platform === 'android' ? os_type = '1' : os_type = '2';
						let obj = {
							version: widgetInfo.version,
							os_type
						}
						console.log(obj)
						let res = await this.$Post('/api/version/version', obj);
						console.log(res);
						if (res.data.code === 1) {
							if (res.data.data.newversion) { //新的版本
								uni.showModal({
									content: '检测到新版本，是否更新？',
									success: (status) => {
										if (status.confirm) {
											// console.log('88888');
											if (res.data.data.enforce === '1') {
												plus.runtime.openURL(res.data.data.file); //确定为强制更新
											} else {
												uni.showLoading();
												var uploadTask =uni.downloadFile({
													url: res.data.data.file,
													success: (downloadResult) => {
														if (downloadResult.statusCode === 200) {
															plus.runtime.install(downloadResult.tempFilePath, {
																force: true
															}, function() {
																console.log('更新成功')
																plus.nativeUI.toast('更新成功');
																plus.runtime.restart();
																uni.hideLoading();
															}, function(e) {
																console.log('更新失败')
																plus.nativeUI.toast('更新失败');
																uni.hideLoading();
															});
														}
													}
												});
												// console.log(uploadTask)
												// uploadTask.onProgressUpdate((len)=>{
												// 	// plus.nativeUI.showWaiting(len.progress);
												// 	// uni.showLoading();
													
												// 	console.log(len.progress)
												// })
											}
										} else if (status.cancel) {
											if (res.data.data.enforce === '1') {
												plus.runtime.quit();
											}
										}
									}
								})
							}
						}
						// console.log(res)

					}
				})

			});


			//      const _self = this;  
			//      const _handlePush = function(message) {  
			//          // TODO  
			// this.$Toast(JSON.stringify(message))
			//      };  
			//      plus.push.addEventListener('click', _handlePush);  
			//      plus.push.addEventListener('receive', _handlePush);  
			// #endif  
		},
		onShow: async function() {
			let {token} = uni.getStorageSync('userinfo');
			// console.log(token)
			if(token){
				let obj = {token,offset:1,limit:100};
				let arr = 0;
				let res  =await this.$Post('/api/Userfriend/firendlist',obj);
				if(res.data.code===1){
					res.data.data.list.forEach((val,ind)=>{
						arr+=val.unreadmsg_num*1
					})
					// console.log(arr)
					if(arr>0){
						uni.showTabBarRedDot({
							 index: 2
						})
					}
				}
				
			}
			// uni.setTabBarBadge({
			//   index: 0,
			//   text: ''
			// })
			
		},
		onHide: function() {
			console.log('App Hide')
		},

		globalData: {
			city: '深圳', //定位城市名字
			loginStatus: false, //登录状态(未使用)
			token: '3e5ac48f-fc89-4282-9b81-d1ea8cb9514d', //全局token(未使用)
			socketTask:null,//全局ws(未使用)
			onlineList: null, //当前在线的沙龙成员列表
			fishground_id: 4, //绑定的渔场id(成为商户才可使用)
			clientid: '', //手机cid
			editAddress: null, //编辑渔场选择得经纬度
			videoMsg:{},//暂时保存观看得视频信息
			shareVideoMsg:{},//分享视频页面暂时保存得信息
			beforeAddress:{type:'',url:''},//上次所在得房间
		}
	}
</script>

<style>
	/*每个页面公共css */
	.top_hr {
		width: 100%;
		height: 160rpx;
		padding-bottom: 40rpx;
	}

</style>
