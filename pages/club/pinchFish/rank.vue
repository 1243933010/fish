<template>
	<view class="box" :style="{height:Height+'px'}">
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="排行榜" :leftIcon="true" />
		</view>
		
		
		<view class="img_top">
			<image class="yu" src="../../../static/club/yu.png" mode="widthFix"></image>
			<text>今日排行榜</text>
			<image src="../../../static/club/jiangzhang.png" mode="widthFix"></image>
		</view>
		
		<view class="bang">
			<view class="top">
				<image src="../../../static/club/yinhao.png" mode="widthFix"></image>
				<text>你与大神的差距有多少？快快来围观~</text>
				<image src="../../../static/club/yinhao2.png" mode="widthFix"></image>
				<image class="yinying" src="../../../static/club/yinying.png" mode="widthFix"></image>
			</view>
			<view class="content">
				<view class="" v-if="rankList.length===0"><text>暂无数据</text></view>
				<view class="item" v-for="(item,index) in rankList" :key="index" :style="{'border-bottom':index===rankList.length-1?'none':'auto'}">
					<view class="left">
						<view class="index">
							<image v-if="index===0" src="../../../static/club/one.png" mode="widthFix"></image>
							<image v-if="index===1" src="../../../static/club/two.png" mode="widthFix"></image>
							<image v-if="index===2" src="../../../static/club/three.png" mode="widthFix"></image>
						    <text v-if="index>2">{{index+1}}</text>
						</view>
						<view class="name">
							<image :src="item.avatar" mode=""></image>
							<text>{{item.nicename}}</text>
						</view>
					</view>
					<view class="right">
						<text>{{item.grades}}</text>
					</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components:{headers,popup},
		data() {
			return {
				id:'',
				rankList:[],
				Height:0
			};
		},
		onLoad(e) {
			console.log(e)
			this.id = e.id;
			this.getRank();
			uni.getSystemInfo({
				success: (data) => {
					this.Height = data.windowHeight;
				}
			})
		},
		methods:{
			async getRank(){
				let obj = {activityid:this.id,offset:1,limit:50};
				let res = await this.$Post('/api/Groundactivity/ActivityGradesList',obj);
				if(res.data.code===1){
					this.rankList = res.data.data.list;
				}
				console.log(res);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		background: #43B9F3 ;
	}
	.img_top{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 60rpx;
		color: white;
		padding-left: 30rpx;
		margin-bottom: 40rpx;
		position: relative;
		image{
			width: 60rpx;
		}
		text{
			margin-right: 20rpx;
		}
		.yu{
			width: 120rpx;
			margin-right: 25rpx;
		}
	}

	.bang{
		width: 90%;
		margin: 0 auto;
		.top{
			width: 100%;
			background: #0081FB;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 30rpx 0;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			position: relative;
			.yinying{
				position: absolute;
				width: 100%;
				bottom: -20rpx;
				z-index: 100;
			}
			text{
				font-size: 30rpx;
				color: white;
				margin: 0 20rpx;
				font-weight: 600;
			}
			image{
				width: 40rpx;
			}
		}
		.content{
			width: 92%;
			height: 700rpx;
			overflow-y: scroll;
			margin: 0 auto;
			background: #ECF5FF;
			box-sizing: border-box;
			padding: 20rpx 15rpx;
			position: relative;
			.item{
				border-bottom: 1px solid #D1E0F0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 15rpx 0;
				margin-bottom: 15rpx;
				.left{
					display: flex;
					flex-direction: row;
					align-items: center;
					.index{
						width: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						image{
							width: 50rpx;
						}
						font-size: 36rpx;
						color: #2797FF;
						margin-right: 20rpx;
					}
					.name{
						display: flex;
						flex-direction: row;
						align-items: center;
						font-size: 30rpx;
						image{
							width: 80rpx;
							height: 80rpx;
							border-radius: 50%;
							margin-right: 15rpx;
						}
					}
				}
				.right{
					color: #FFBB17;
					font-size: 30rpx;
				}
			}
		}
	}
	.rank{
		width: 100%;
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.user{
				display: flex;
				flex-direction: row;
				align-items: center;
				image{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			}
		}
	}
</style>
