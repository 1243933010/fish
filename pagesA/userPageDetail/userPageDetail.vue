<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="收支详情" :leftIcon="true" />
		</view>
		
		
		<view class="pox" >
			<view style="font-size: 26rpx;" v-if="list.length===0"><text>暂无收支数据</text></view>
			<view class="item" v-for="(item,index) in list" :key="index">
				<text>{{item.remark}}</text>
				<text>收支前:{{item.bf_ticketnum}}</text>
				<text>收支后:{{item.af_ticketnum}}</text>
				<text>{{item.create_time}}</text>
			</view>
			<!-- <text>回鱼记录</text> -->
			<!-- <image src="../../static/me/ticket.png" mode=""></image> -->
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
				fishground_id:'',
				token:'',
				list:[],
				offset:1
			};
		},
		onLoad(e) {
			this.fishground_id = e.fishground_id;
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			console.log(this.token)
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods:{
			async getList(){
				uni.showLoading({
					mask:true
				})
				let obj = {token:this.token,offset:this.offset,limit:20,keyword:'',fishground_id:this.fishground_id};
				let res = await this.$Post('/api/Groundticket/TicketUserloglist',obj);
				if(res.data.code===1){
					if(this.offset===1){
						this.list = res.data.data.list;
					}else{
						this.list.push(...res.data.data.list);
					}
					this.offset++;
				}
				uni.hideLoading();
				console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pox{
		width: 95%;
		margin: 0 auto;
		.item{
			display: flex;
			flex-direction: column;
			font-size: 26rpx;
			// color: #333333;
			background: #00ACFF;
			margin-bottom: 20rpx;
			color: white;
			border-radius: 10rpx;
			box-sizing: border-box;
			padding: 15rpx ;
			text{
				margin-bottom: 10rpx;
			}
		}
	}
</style>
