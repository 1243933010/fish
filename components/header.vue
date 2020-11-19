<template>
	<view>
		<view class="header">
			<view class="top"></view>
			<view class="box">
				<view class="left" @click="back">
					<image  v-if="leftIcon" src="../static/back.png" mode="widthFix"></image>
					<text>{{leftText}}</text>
				</view>
				<view class="title">
					<text>{{title}}</text>
				</view>
				<view class="right" @click="rightClick">
					<image v-if="rightIcon" :src="rightIcon" mode="widthFix"></image>
					<text>{{rightText}}</text>
					<view v-if="radio" class="radio"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		 components: {uniNavBar},
		 props:{
			 title:{
				 default:'test'
			 },
			 leftIcon:{
				 default:false
			 },
			 leftText:{
				 default:''
			 },
			 rightText:{
				 default:''
			 },
			 rightIcon:{
				  default:''
			 },
			 radio:{
				 default:false
			 }
		 },
		data() {
			return {
				
			};
		},
		mounted() {
			// #ifdef APP-PLUS
			void plus.navigator.setStatusBarStyle("light");
			// #endif
		},
		methods:{
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			rightClick(){
				this.$emit('rightClick')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header{		
		background: linear-gradient(75deg, #24B9FF 0%, #7FD6FF 100%);
		// background: red;
		width: 100%;
		height: 160rpx;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.33);
		z-index: 10000;
		position: relative;
		.top{
			width: 100%;
			height: 44px;
			
		}
		.box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding: 0 40rpx;
			color: white;
			.left{
				width: 30%;
				font-size: 32rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				image{
					width: 45rpx;
					margin-right: 10rpx;
				}
			}
			.title{
				width: 40%;
				text-align: center;
				font-size: 36rpx;
			}
			.right{
				width: 30%;
				font-size: 32rpx;
				display: flex;
				flex-direction: row-reverse;
				align-items: center;
				position: relative;
				.radio{
					position: absolute;
					top: 0;
					right: -10rpx;
					width: 20rpx;
					height: 20rpx;
					background: red;
					border-radius: 50%;
				}
				image{
					width: 45rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
