<template>
	<view>
		<view style="width: 100%;height: 160rpx;"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="周边渔具店" :leftIcon="true" />
		</view>


		<view class="shop">
			<view class="item" v-for="(item,index) in shopList" :key="index">
				<view class="shop_name">
					<view class="icon">
						<image src="../../../static/club/fishground.png" mode="widthFix"></image>
						<text>{{item.tackshop_name}}</text>
					</view>
					<view class=""><text>{{(item.distance/1000).toFixed(2)}}km</text></view>
				</view>
				<view class="phone"><text>联系方式：{{item.tackshop_phone}}</text></view>
				<view class="address">
					<text class="address_text">地址{{item.area_name}}{{item.ground_address}}</text>
					<view class="location_small">
						<image src="../../../static/club/location_small.png" mode="widthFix"></image>
					    <text class="address_fn" @click="goTo(item)">去这里</text>
					</view>
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
				shopList: [],
				offset:1,
				address:{}
			};
		},
		onLoad(e) {
			let address = JSON.parse(e.obj);
			this.address = address;
			let obj = {
				offset: this.offset,
				limit: 10,
				keyword: '',
				lng: address.longitude,
				lat: address.latitude
			}
			this.getList(obj);
			// console.log(e)
		},
		onReachBottom() {
			let obj = {
				offset: this.offset,
				limit: 10,
				keyword: '',
				lng: this.address.longitude,
				lat: this.address.latitude
			}
			this.getList(obj);
		},
		methods: {
			async getList(obj) {
				uni.showLoading({
					mask:true
				})
				let res = await this.$Post('/api/Ground/FishtackshopList', obj);
				if (res.data.code === 1) {
					if(this.offset===1){
						this.shopList = res.data.data.list;
					}else{
						this.shopList.push(...res.data.data.list);
					}
					this.offset++;
				}
				uni.hideLoading();
				// console.log(res)
			}, //获取周边渔具店列表
			goTo(item) {
				console.log(item);
				let str = item.area_name + item.ground_address;
				this.toMapAPP(item.ground_atitude, item.ground_longitude, str);
			}, //获取详情打开第三方地图
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
	.shop {
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 25rpx;

		.item {
			margin-bottom: 35rpx;
			border-bottom: 1px solid #F0F0F0;
			padding: 20rpx 0;
			.shop_name {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #343434;
				font-size: 30rpx;
				font-weight: 600;
				margin-bottom: 20rpx;
				.icon{
					display: flex;
					flex-direction: row;
					align-items: center;
					image{
						width: 45rpx;
						margin-right: 10rpx;
					}
				}
			}
			.phone{
				color: #343434;
				font-size: 26rpx;
				margin-bottom: 15rpx;
			}
			.address {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				.address_text{
					width: 70%;
					color: #343434;
					font-size: 26rpx;
				}
				.location_small{
					display: flex;
					flex-direction: row;
					align-items: center;
					image{
						width: 30rpx;
						margin-right: 15rpx;
					}
					text{
						background: #6ACFFF;
						color: white;
						font-size: 20rpx;
						box-sizing: border-box;
						padding: 8rpx 20rpx;
						border-radius: 8rpx;
					}
				}
			}
		}
	}
</style>
