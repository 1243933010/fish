<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="消息" :leftIcon="true" />
		</view>
		
		
		<view class="message">
			<view v-if="list.length===0" style="font-size: 26rpx;">
				<text>暂无更多消息</text>
			</view>
			<view class="item" v-for="(item,index) in list" :key="index">
				<text>{{item.content}}</text>
				<view class="time"><text>{{item.creat_time}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components:{headers,popup},
		data() {
			return {
				token:'',
				list:[],
				offset:1
			};
		},
		mounted() {
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			this.getMsg();
		},
		onReachBottom() {
			this.getMsg();
		},
		methods:{
			async getMsg(){
				let obj = {token:this.token,offset:this.offset,limit:20};
				let res = await this.$Post('/api/Index/IndexNotice',obj);
				if(res.data.code===1){
					if(this.offset===1){
						this.list = res.data.data.list;
					}else{
						this.list.push(...res.data.data.list);
					}
					this.offset++;
				}
				// console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		.item{
			width: 100%;
			border-bottom: 1px solid #f0f0f0;
			box-sizing: border-box;
			padding: 15rpx 0;
			margin-bottom: 15rpx;
			font-size: 26rpx;
			display: flex;
			flex-direction: column;
			text{
				margin-bottom: 15rpx;
			}
			.time{
				// text-align: right;
			}
		}
	}
</style>
