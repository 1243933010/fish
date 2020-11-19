<template>
	<view>
		<view style="width: 100%;height: 160rpx;"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="现场服务" :leftIcon="true" />
		</view>
		
		
		<view class="box">
			<view class="item" v-for="(item,index) in list" :key="index" @click="setMobile(item)">
				<image :src="item.icon" mode="widthFix"></image>
				<text>{{item.title}}</text>
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
				list:[
					{icon:'../../static/club/guanliyuan.png',title:'呼叫管理员',url:'114'},
					{icon:'../../static/club/shop.png',title:'便利购物',url:'115'},
					{icon:'../../static/club/waimai.png',title:'外卖送餐',url:'116'},
				]
			};
		},
		onLoad(e) {
			this.roomId = e.roomId;
			this.getFishDetail(e.roomId);
			console.log(e)
		},
		methods:{
			setMobile(item){
				// #ifdef APP-PLUS
				if(!item.url){
					this.$Toast('钓场暂未设置该电话');
				}else{
					uni.makePhoneCall({
						phoneNumber:item.url
					})
				}
				// #endif
			},
			async getFishDetail(fishground_id){
				let obj =  {fishground_id};
				let res = await this.$Post('/api/Ground/GroundListinfo',obj);
				if(res.data.code===1){
					console.log(res.data.data)
					this.list[0].url = res.data.data.ground_phone;
					this.list[1].url = res.data.data.shop_phone;
					this.list[2].url = res.data.data.food_phone;
					this.$forceUpdate();
				}
				// console.log(res)
			},//获取钓场详情
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding-top: 150rpx;
		.item{
			width: 80%;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			font-size: 32rpx;
			background: #6ACFFF;
			border-radius: 10rpx;
			margin: 30rpx auto;
			padding: 15rpx 0;
			image{
				width: 35rpx;
				margin-right: 15rpx;
			}
		}
	}
</style>
