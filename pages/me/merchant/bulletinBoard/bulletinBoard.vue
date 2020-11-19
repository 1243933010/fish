<template>
	<view>
		<view class="top_hr" style="padding: 0;"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="公告栏" :leftIcon="true" />
		</view>
		
		<!-- :style="{height:Height+'px'}" -->
		<view class="box" :style="{height:Height+'px'}">
			<!-- :style="{height:Height-20+'px'}" -->
			<textarea  placeholder="设置" :style="{height:Height-20+'px'}" v-model="obj.ground_intro" maxlength="-1" />
			<!-- <editor id="editor" v-model="obj.ground_intro" class="ql-container" :placeholder="placeholder" @ready="onEditorReady"></editor> -->
		</view>
		 
		<view class="btn" @click="btn"><text>确定</text></view>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	export default {
		components:{headers},
		data() {
			return {
				token:'',
				Height:'',
				obj:{},
				fishground_id:'',
				placeholder: '开始输入...'
			};
		},
		mounted() {
			let {token} = uni.getStorageSync('userinfo');
			this.token = token;
			uni.getSystemInfo({
				success: (data) => {
					this.Height = data.screenHeight-190;
					// console.log(data.screenHeight);
				}
			})
			this.getUserInfo();
		},
		methods:{
			 onEditorReady() {
			                uni.createSelectorQuery().select('#editor').context((res) => {
			                    this.editorCtx = res.context
			                }).exec()
			  },
			async getUserInfo(){
				let obj = {token:this.token};
				let res = await this.$Get('/api/user/Getuserinfo',obj);
				if(res.data.code===1){
					let fishid = res.data.data.fishid;
					this.obj.fishground_id = fishid;
					this.fishground_id = fishid;
					let obj1 = {fishground_id:fishid};
					let data = await this.$Post('/api/Ground/GroundListinfo',obj1);
					console.log(data)
					if(data.data.code===1){
						console.log(data.data.data)
						this.obj = data.data.data;
					}
				}
			},//获取拥有渔场得数据
			async btn(){
				this.obj.fishground_id = this.fishground_id;
				this.obj.token = this.token;
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
		padding: 40rpx 20rpx;
		margin-bottom: 40rpx;
		textarea{
			width: 100%;
			border: 1px solid #333333;
			font-size: 26rpx;
			box-sizing: border-box;
			padding: 20rpx;
			border-radius: 10rpx;
		}
	}
	.btn{
		width: 80%;
		margin: 0 auto;
		background: #3EC2FF;
		font-size: 26rpx;
		color: white;
		padding: 20rpx 0;
		border-radius: 10rpx;
		text-align: center;
	}
</style>
