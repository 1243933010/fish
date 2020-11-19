<template>
	<view>
		<view class="top_hr" ></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="现场服务" :leftIcon="true" />
		</view>
		
		<view class="box">
			<view class="inp">
				<!-- <text>电话</text> -->
				<input type="text" placeholder="设置管理员电话" v-model="obj.ground_phone"/>
			</view>
			<view class="inp">
				<!-- <text>电话</text> -->
				<input type="text" value="" placeholder="设置购物电话" v-model="obj.shop_phone" />
			</view>
			<view class="inp">
				<!-- <text>电话</text> -->
				<input type="text" value="" placeholder="设置外卖电话" v-model="obj.food_phone" />
			</view>
			<view class="btn" @click="btn">
				<text>确定修改</text>
			</view>
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	export default {
		components:{headers},
		data() {
			return {
				token:"",
				obj:{},
				fishId:""
			};
		},
		mounted() {
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			this.getUserInfo();
			// this.getFishDetail();
		},
		methods:{
			async getUserInfo(){
				let obj = {token:this.token};
				let res = await this.$Get('/api/user/Getuserinfo',obj);
				if(res.data.code===1){
					this.fishId = res.data.data.fishid;
					this.getFishDetail(res.data.data.fishid);
				}
				console.log(res);
			},
			async getFishDetail(fishground_id){
				let obj =  {fishground_id};
				let res = await this.$Post('/api/Ground/GroundListinfo',obj);
				if(res.data.code===1){
					this.obj = res.data.data;
					// console.log(res)
				}
				// console.log(res)
			},//获取钓场详情s
			async btn(){
				// this.obj.ground_images = this.uploadImgList.join(',');
				this.obj.token = this.token;
				this.obj.fishground_id = this.fishId;
				let res = await this.$Post('/api/Ground/EditGround',this.obj);
				this.$Toast(res.data.msg);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		width: 100%;
		box-sizing: border-box;
		padding: 0 20rpx;
		.inp{
			display: flex;
			flex-direction: column;
			margin-bottom: 30rpx;
			text{
				font-size: 30rpx;
				margin-bottom: 15rpx;
			}
			input{
				width: 100%;
				border: 1px solid #333333;
				border-radius: 10rpx;
				font-size: 26rpx;
				padding: 15rpx 0;
				text-indent: 15rpx;
			}
		}
		.btn{
			width: 80%;
			margin: 0 auto;
			background: #40C2FF;
			text-align: center;
			color: white;
			border-radius: 10rpx;
			padding: 15rpx 0;
		}
	}
</style>
