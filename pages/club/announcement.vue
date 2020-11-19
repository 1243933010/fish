<template>
	<view>
		<view style="width: 100%;height: 160rpx;"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="公告" :leftIcon="true" />
		</view>
		
		
		<view class="msg">
			<text>{{ground_intro}}</text>
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
				roomId:'',
				ground_intro:''
			};
		},
		onLoad(e) {
			this.roomId = e.roomId;
			this.getText();
		},
		methods:{
			async getText(){
				let obj = {fishground_id:this.roomId};
				let res = await this.$Post('/api/Ground/GroundListinfo',obj);
				if(res.data.code===1){
					this.ground_intro = res.data.data.ground_intro;
				}
				console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.msg{
		box-sizing: border-box;
		padding: 40rpx 20rpx;
	}
</style>
