<template>
	<view>
		<view style="width: 100%;height: 160rpx;"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="申请入驻" :leftIcon="true" />
		</view>
		
		<view class="form">
			<view class="inp">
				<text>姓名：</text>
				<input type="text" value="" v-model="name" placeholder="请输入真实姓名"/>
			</view>
			<view class="inp">
				<text>电话：</text>
				<input type="text" value="" v-model="mobile" placeholder="请输入电话"/>
			</view>
			<view class="inp">
				<text>银行卡名称：</text>
				<input type="text" value="" v-model="bcard_name" placeholder="如建行"/>
			</view>
			<view class="inp">
				<text>卡号：</text>
				<input type="text" value="" v-model="bcard_num" placeholder="请输入银行卡号"/>
			</view>
			<view class="upload">
				<text>上传营业执照图片</text>
				<view class="img">
					<view class="view_img" v-for="(item,index) in imgList">
						<image  @click="seeImg" :src="item" mode="widthFix"></image>
						<image @click="close(item,index)" src="../../../static/club/delete.png" mode="widthFix" class="close"></image>
					</view>
					<image @click="uploadImg" src="../../../static/club/add.png" mode="widthFix"></image>
				</view>
			</view>
			
			<view class="btn" @click="btn">
				<text>提交</text>
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
				name:'',
				mobile:'',
				bcard_name:'',
				bcard_num:'',
				url:'../../../static/club/add.png',
				obj:{},
				token:'',
				id:'',
				imgList:[]
			};
		},
		onLoad(e) {
			let data = uni.getStorageSync('userinfo');
			this.id = e.id;
			if(data){
				this.obj = data;
				this.token = data.token;
			}
			// console.log(data)
			console.log(e)
		},
		methods:{
			async btn(){
				if(!this.name){
					this.$Toast('名字不能为空');
					return
				}
				if(this.mobile.length !==11){
					this.$Toast('手机格式错误');
					return
				}
				if(!this.bcard_name){
					this.$Toast('银行卡名称不能为空');
					return
				}
				if(!this.bcard_num){
					this.$Toast('卡号不能为空');
					return
				}
				if(this.imgList.length===0){
					this.$Toast('请上传执照');
					return
				}
				let obj = {
					token:this.token,
					fishground_id:this.id,
					license_image:this.imgList.join(','),
					contact_username:this.name,
					contact_phone:this.mobile,
					bcard_name:this.bcard_name,
					bcard_num:this.bcard_num
				}
				
				let res = await this.$Post('/api/Ground/Groundsetin',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},500)
				}
				console.log(res)
			},//提交
			uploadImg(){
				uni.chooseImage({
					count:1,
					sizeType:['compressed'],
					sourceType:['album','camera'],
					success: async(res) => {
						console.log(res.tempFilePaths[0]);
						let data = await this.getRequestMsg(res.tempFilePaths[0]);
						this.imgList.push(this.baseUrl+data)
						// this.url = this.baseUrl+data;
						console.log(data)
					}
				})
			},
			getRequestMsg(msg){
				return new Promise((resolve,reject)=>{
					uni.uploadFile({
					            url: `${this.baseUrl}api/common/upload`, 
					            filePath: msg,
					            name: 'file',
								formData: {
								    'token':this.token
								},
					            success: (uploadFileRes) => {
									// console.log(uploadFileRes)
									let msg = JSON.parse(uploadFileRes.data);
									if(msg.code===1){
										resolve(msg.data.url);
									}
					                // console.log(JSON.parse(uploadFileRes.data));
					            },
								fail(err) {
									
									reject(err)
								}
					        });
				})
			},//获取拿到数据发送后的返回数据
			close(item,index){
				this.imgList.splice(index,1);
				this.$forceUpdate();
			},//删除选中的图片
			seeImg(){
				uni.previewImage({
					urls:this.imgList
				})
			}//预览图片
		}
	}
</script>

<style lang="scss" scoped>
	.form{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 20rpx;
		.inp{
			margin-bottom: 25rpx;
			text{
				font-size: 30rpx;
				margin-bottom: 15rpx;
				display: inline-block;
			}
			input{
				width: 100%;
				border: 1px solid #8F8F94;
				padding: 15rpx 0;
				border-radius: 10rpx;
				text-indent: 15rpx;
				font-size: 30rpx;
			}
		}
		.upload{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			text{
				margin-right: 20rpx;
				margin-bottom: 25rpx;
				display: inline-block;
			}
			image{
				width: 180rpx;
			}
			.img{
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.view_img{
					position: relative;
					image{
						width: 200rpx;
						margin-right: 25rpx;
					}
					.close{
						width: 40rpx;
						position: absolute;
						right: -10rpx;
						top: -10rpx;
					}
				}
			}
		}
		.btn{
			width: 80%;
			margin: 20rpx auto;
			background: #3CC1FF;
			font-size: 30rpx;
			color: white;
			padding: 20rpx 0;
			border-radius: 10rpx;
			text-align: center;
		}
	}
</style>
