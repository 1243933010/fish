<template>
	<view>
		<view style="width: 100%;height: 160rpx;"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;" >
			<headers title="环境" :leftIcon="true" />
		</view>
		
		<view class="address">
			<text class="label"><text style="margin-right: 25rpx;">钓场位置: 
			</text> {{address}}</text>
		    <view class="icon">
		    	<image src="../../static/club/location.png" mode="widthFix"></image>
		    	<text @click="toMap">到这里去</text>
		    </view>
		</view>
		
		
		<view class="tian">
			<view class="top">
				<image class="img" src="../../static/club/icon6.png" mode="widthFix"></image>
				<view class="center">
					<view class="num_top">
						<text>{{du}}度</text>
					</view>
					<view class="num_bottom">
						<text>{{obj.low}} / {{obj.high}}</text>
					</view>
				</view>
				<view class="right">
					<text class="right_text" @click="seeAddress">详情</text>
					<view class="right_bottom">
						<image src="../../static/club/icon4.png" mode="widthFix"></image>
					    <text>{{city}}</text>
					</view>
				</view>
			</view>
			<view class="hr"></view>
			<view class="bottom">
				<view class="val">
					<image src="../../static/club/icon5.png" mode="widthFix"></image>
					<text>良</text>
				</view>
				<view class="val">
					<image src="../../static/club/icon3.png" mode="widthFix"></image>
					<text>{{obj.fengxiang}}</text>
				</view>
				<view class="val">
					<image src="../../static/club/icon2.png" mode="widthFix"></image>
					<text>{{obj.type}}</text>
				</view>
				<view class="val">
					<image src="../../static/club/icon1.png" mode="widthFix"></image>
					<text>1012</text>
				</view>
			</view>
		</view>
		
		<view class="zhoubian" @click="goFishShop">
			<text>周边渔具店</text>
			<image src="../../static/club/right_arrow.png" mode="widthFix"></image>
		</view>
		
		<view class="huanjing">
			<view class="title">
				<text>钓场环境</text>
			</view>
			<view class="list">
				<view class="" v-for="(item,index) in imgList" :key="index">
					<image @click="seeImg(index)"   :src="baseUrl+item" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue'
	export default {
		components: {
			headers
		},
		
		data() {
			return {
				obj:{
					
				},
				du:'30',
				city:'',
				roomId:'',
				address:'',
				latitudeAndlongitude:{},
				imgList:[]
			};
		},
		onLoad(e) {
			this.roomId = e.roomId;
			this.getFishDetail(e.roomId);
			this.getWeather();
			// console.log(e)
		},
		methods:{
			seeImg(index){
				let arr = JSON.parse(JSON.stringify( this.imgList));
				let arr1 = [];
				 arr.forEach((val,ind)=>{
					val = this.baseUrl+val;
					arr1.push(val);
				})
				uni.previewImage({
					urls: arr1,
					current:index
				})
			},//查看图片
			async getFishDetail(fishground_id){
				let obj =  {fishground_id};
				let res = await this.$Post('/api/Ground/GroundListinfo',obj);
				if(res.data.code===1){
					this.address = res.data.data.area_name+res.data.data.ground_address;
					this.latitudeAndlongitude.latitude = res.data.data.ground_atitude;
					this.latitudeAndlongitude.longitude = res.data.data.ground_longitude;
					this.ground = res.data.data;
					this.imgList = res.data.data.ground_images.split(',');
					this.getWeather(res.data.data.cityname)
				}
				console.log(res)
			},//获取钓场详情
			getWeather(address){
				// let address = getApp().globalData.city;
				uni.request({
					url:`http://wthrcdn.etouch.cn/weather_mini?city=${address}`,
					success: (res) => {
						console.log(res)
						if(res.data.status===1000){
							this.obj = res.data.data.forecast[0];
							this.du = res.data.data.wendu;
							this.city = res.data.data.city;
						}
						// console.log(res)
					}
				})
			},//获取简略天气情况
			seeAddress(){
				uni.navigateTo({
					url:'./weather'
				})
			},//查看天气界面
			goFishShop(){
				let str = JSON.stringify(this.latitudeAndlongitude);
				uni.navigateTo({
					url:`./fishShop/fishShop?obj=${str}`
				})
			},
			toMap(){
				// console.log(this.ground);
				let ground = this.ground;
				let address = `${ground.area_name}${ground.ground_address}`;
				// console.log(address)
				// console.log(ground.ground_atitude,ground.ground_longitude,address)
				this.toMapAPP(ground.ground_atitude,ground.ground_longitude,address)
				
			},//打开地图
			toMapAPP(latitude, longitude, name) {
				let url = "";
				if (plus.os.name == "Android") { //判断是安卓端
					plus.nativeUI.actionSheet({ //选择菜单
						title: "选择地图应用",
						cancel: "取消",
						buttons: [
						// 	{
						// 	title: "腾讯地图"
						// },
						{
							title: "百度地图"
						}, {
							title: "高德地图"
						}]
					}, function(e) {
						switch (e.index) {
							//下面是拼接url,不同系统以及不同地图都有不同的拼接字段
							// case 1:
							// 	//注意referer=xxx的xxx替换成你在腾讯地图开发平台申请的key
							// 	url = `qqmap://map/geocoder?coord=${latitude},${longitude}&referer=xxx`;
							// 	break;
							case 1:
								url =
									`baidumap://map/marker?location=${latitude},${longitude}&title=${name}&coord_type=gcj02&src=andr.baidu.openAPIdemo`;
								break;
							case 2:
								url =
									`androidamap://viewMap?sourceApplication=appname&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
								break;
							default:
								break;
						}
						if (url != "") {
							url = encodeURI(url);
							//plus.runtime.openURL(url,function(e){})调起手机APP应用
							plus.runtime.openURL(url, function(e) {
								plus.nativeUI.alert("本机未安装指定的地图应用");
							});
						}
					})
				} else {
					// iOS上获取本机是否安装了百度高德地图，需要在manifest里配置
					// 在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加
					//（如urlschemewhitelist:["iosamap","baidumap"]）  
					plus.nativeUI.actionSheet({
						title: "选择地图应用",
						cancel: "取消",
						buttons: [{
							title: "腾讯地图"
						}, {
							title: "百度地图"
						}, {
							title: "高德地图"
						}]
					}, function(e) {
						switch (e.index) {
							case 1:
								url = `qqmap://map/geocoder?coord=${latitude},${longitude}&referer=xxx`;
								break;
							case 2:
								url =
									`baidumap://map/marker?location=${latitude},${longitude}&title=${name}&content=${name}&src=ios.baidu.openAPIdemo&coord_type=gcj02`;
								break;
							case 3:
								url =
									`iosamap://viewMap?sourceApplication=applicationName&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`;
								break;
							default:
								break;
						}
						if (url != "") {
							url = encodeURI(url);
							plus.runtime.openURL(url, function(e) {
								plus.nativeUI.alert("本机未安装指定的地图应用");
							});
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.address{
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		box-sizing: border-box;
		padding: 35rpx 2.5%;
		position: relative;
		line-height: 55rpx;
		// margin-bottom: 30rpx;
		.title{
			color: #333333;
			font-size: 32rpx;
			margin-right: 15rpx;
		}
		.label{
			font-size: 30rpx;
			margin-right: 15rpx;
			white-space: normal;
			// overflow: hidden;
			// word-wrap: break-word;
		}
		.icon{
			display: flex;
			flex-direction: row;
			align-items: center;
			position: absolute;
			bottom: -15rpx;
			left: 15rpx;
			font-size: 30rpx;
			color: white;
			background: #00AD04;
			border-radius: 10rpx;
			box-sizing: border-box;
			padding: 0rpx 15rpx;
			span{
				line-height: 40rpx;
			}
			image{
				width: 25rpx;
				margin-right: 15rpx;
			}
		}
	}
	.tian{
		width: 98%;
		margin: 30rpx auto;
		background: url(../../static/club/bk.png) no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 40rpx 30rpx;
		.top{
			width: 100%;
			height: 100rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 30rpx;
			.img{
				width: 110rpx;
				
				margin-right: 25rpx;
			}
			.center{
				width: 70%;
				height: 100%;
				display: flex;
				flex-direction: column;
				color: white;
				justify-content: space-between;
				.num_top{
					margin-bottom: 20rpx;
				}
				.num_bottom{
					font-size: 28rpx;
				}
			}
			.right{
				width: 30%;
				height: 110%;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				align-items: flex-end;
				.right_text{
					
					background: #4A8CB6;
					box-shadow: 2px 6px 51px 0px rgba(34, 96, 136, 0.3);
					width: 130rpx;
					color: white;
					font-size: 29rpx;
					box-sizing: border-box;
					padding: 5rpx 25rpx;
					border-radius: 7rpx;
					text-align: center;
				}
				.right_bottom{
					display: flex;
					flex-direction: row;
					color: white;
					font-size: 32rpx;
					image{
						width: 32rpx;
						margin-right: 15rpx;
					}
				}
			}
		}
		.hr{
			width: 100%;
			height: 2rpx;
			background: white;
			margin-bottom: 30rpx;
		}
		.bottom{
			display: flex;
			justify-content: center;
			.val{
				display: flex;
				flex-direction: row;
				align-items: center;
				color: white;
				font-size: 30rpx;
				margin: 0 15rpx;
				image{
					width: 30rpx;
					margin-right: 15rpx;
				}
			}
		}
	}
	.zhoubian{
		width: 98%;
		margin: 0 auto;
		background-color: #007EF4;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;
		color: white;
		box-sizing: border-box;
		padding: 15rpx 20rpx;
		border-radius: 7rpx;
		image{
			width: 20rpx;
		}
	}
	
	.huanjing{
		width: 95%;
		margin: 30rpx auto;
		.title{
			width: 100%;
			display: flex;
			flex-direction: row;
			color: #333333;
			font-size: 32rpx;
			margin-bottom: 15rpx;
		}
		.list{
			width: 100%;
			display: flex;
			// flex-direction: row;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			view{
				width: 48%;
				height: 250rpx;
				overflow: hidden;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				
			}
			image{
				width: 100%;
			}
		}
	}
</style>
