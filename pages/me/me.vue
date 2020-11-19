<template>
	<view>
		<!-- <web-view src="https://apip.weatherdt.com/v2/h5.html?bg=1&md=02345&lc=accu&key=Q8Hruy2FBG"></web-view> -->
	<view class="header">
		<view class="bk_color">
			<view class=""><text>会员中心</text></view>
		</view>
		<view class="user">
			<view class="icon">
				<view class="avatar">
					<image :src="userinfo.avatar" mode=""></image>
				</view>
				<view class="user_msg">
					<view class="login" @click="login" v-if="!userinfo.username">
						<text>登录/</text>
						<text>注册</text> 
					</view>
					<view class="login"  v-if="userinfo.username">
						<text>{{userinfo.username}}</text>
					</view>
					<view class="price">
						<text>金币：{{userinfo.gold}}</text>
					</view>
				</view>
			</view>
			<view class="money" v-if="userinfo.token" @click="goTo('./money/money')">
				<text>账户余额</text>
			</view>
			<view class="setting" >
				<view class="top">
					<view class="message_all">
						<image @click="goMessage" src="../../static/me/massage.png" mode="widthFix"></image>
						<view v-if="messageFlog" class="message_radio"></view>
					</view>
					<image @click="goTo('./setting')" src="../../static/me/setting.png" mode="widthFix"></image>
				</view>
				<view class="bottom">
					<image @click="showCode" src="../../static/me/code.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="userPage">
			<view class="">
				<text>{{imgVideoLen}}</text>
				<text style="color: #B9B9B9;" @click="release">已发布</text>
			</view>
			<view class="">
				<text>{{attentionLen}}</text>
				<text style="color: #B9B9B9;"  @click="attention">关注</text>
			</view>
			<view class="">
				<text>{{fensLen}}</text>
				<text style="color: #B9B9B9;"  @click="fens">粉丝</text>
			</view>
		</view>
	</view>
	
	
	
	<view class="qiandao">
		<view class="top">
			<image src="../../static/me/sign_icon.png" mode="widthFix"></image>
			<view class="msg">
				<view class="num"><text>已连续签到</text><text class="num_text">{{singObj.signnum}}天</text></view>
			    <view class="day"><text>明日签到可获得</text><text class="day_text">{{singObj.glod_sign}}金币</text></view>
			</view>
		</view>
		<view class="box">
			<view class="day_detail">
				<view class="item" v-for="(item,index) in dayList" :key="index">
					<text :class="[item.flog?'active1':'active2']">{{item.title}}</text>
					<view  v-if="!item.flog&&index+1!==dayList.length" class="border"></view>
					<image v-if="item.flog" class="checked" src="../../static/me/sign.png" mode="widthFix"></image>
				    <image class="end" v-if="!item.flog&&index+1===dayList.length" src="../../static/me/reward.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="btn" @click="btn">
				<text>立即签到</text>
				<!-- <view @click="onSdkReady">test1</view> -->
			</view>
		</view>
	</view>
	
	<view class="pox">
		<!-- <view class="item"  @click="goTo('../pay/pay')">
			<image src="../../static/me/daijinquan.png" mode="widthFix"></image>
		    <text>支付方式</text>
		</view> -->
		<!-- <view class="item"  @click="goVoucher">
			<image src="../../static/me/daijinquan.png" mode="widthFix"></image>
		    <text>代金券卡包</text>
		</view> -->
		<view class="item" @click="goTo('../../pagesA/userMoney/userMoney')">
			<image src="../../static/me/yupiao.png" mode="widthFix"></image>
		    <text>俱乐部鱼票卡包</text>
		</view>
		<view class="item"  @click="goTo('./order/order?type=fish')">
			<image src="../../static/me/order.png" mode="widthFix"></image>
		    <text>我的订单</text>
		</view>
		<view class="item" v-if="is_merchant==='1'" @click="goMerchant">
			<image src="../../static/me/order.png" mode="widthFix"></image>
		    <text>商家端入口</text>
		</view>
		<view class="gs"><text class="">深圳市渔乐圈网络科技有限公司</text></view>
	</view>
	
	
	 <uni-popup type="center" ref="code">
		 <view class="erweima_code">
			 <view class="title"><text>回鱼收款二维码</text></view>
		 	<image :src="codeUrl" mode=""></image>
			<view class="sao"><text>扫码付款</text></view>
		 </view>
    </uni-popup>
	
	</view>
</template>

<script>
	import popup from '@/components/uni-popup/uni-popup.vue';
	// import uQRCode from '../../util/uqrcode.js';
	export default {
		comments:{popup},
		data() {
			return {
				token:'',
				dayList:[],
				userinfo:{
					avatar:'../../static/logo.png'
				},
				singObj:{},
				is_merchant:'',
				codeUrl:'',
				imgVideoLen:0,
				offset:1,
				userid:'',
				fensLen:0,
				attentionLen:0,
				messageFlog:false
			};
		},
		mounted() {
			// this.userinfo = uni.getStorageSync('userinfo');
			
		},
		onHide() {
			this.$refs.code.close();
			// uni.navigateTo({
			// 	url:'../../pagesA/userMoney/userMoney'
			// })
		},
		onShow() {
			this.offset = 1;
			this.userinfo = uni.getStorageSync('userinfo');
			this.token = this.userinfo.token;
			this.userid = this.userinfo.user_id;
			// this.getSignCofig();
			this.imgVideoLen = 0;
			this.getUserInfo();
			this.getImgText();
			
			this.getFans();
			this.getAttention();
			this.getMessage();
		},
		
		methods:{
			async getMessage(){
				let res = await this.$Post('/api/Index/IndexNoticeNum',{token:this.token});
				if(res.data.code===1){
					this.messageFlog = true;
				}else{
					this.messageFlog = false;
				}
				console.log(res)
			},
			goVoucher(){
				this.$Toast('暂未开放');
			},//去代金券页面
			release(){
				uni.navigateTo({
					url:'./userPage/release'
				})
			},//去发布页面
			attention(){
				uni.navigateTo({
					url:'./userPage/attention'
				})
			},//去关注页面
			fens(){
				uni.navigateTo({
					url:'./userPage/fens'
				})
			},//去粉丝页面
			goMessage(){
				uni.navigateTo({
					url:'../club/message/message'
				})
			},//去消息页面
			async getUserInfo(){
				let obj = {token:this.userinfo.token};
				let res = await this.$Get('/api/user/Getuserinfo',obj);
				if(res.data.code===1){
					this.is_merchant = res.data.data.is_merchant;
					if(res.data.data.is_merchant==='1'){getApp().globalData.fishground_id=res.data.data.fishid};
					this.userinfo.avatar = res.data.data.avatar;
					this.userinfo.username = res.data.data.username;
					this.userinfo.score = res.data.data.score;
					this.userinfo.gold = res.data.data.gold;
					console.log(res.data.data)
					
					this.getSignCofig();
				}
				// console.log(res);
			},
			login(){
				uni.reLaunch({
					url:'../login/login'
				})
			},//登录
			async getSignCofig(){//获取签到配置
				let res = await this.$Post('/api/Sign/getsigncofig',{});
				if(res.data.code===1){
					this.singObj = res.data.data;
					// this.userinfo.score = res.data.data.totlegold;
					let num =  res.data.data.glodmax_sign*1;
					let arr = [];
					for (let i = 0; i < num; i++) {
						let obj = {title:`${i+1}天`,flog:false};
						arr.push(obj);
					}
					let Num = res.data.data.signnum*1;
					for (let j = 0;j<Num;j++) {
						arr[j].flog = true;
						// console.log(arr[j])
					}
					this.dayList = arr;
					console.log(arr)
				}
				
			},
			goTo(url){
				uni.navigateTo({
					url
				})
			},
			async btn(){
				let token = this.userinfo.token;
				let res = await this.$Post('/api/Sign/signtoday',{token});
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.getSignCofig();
					this.getUserInfo();
				}
			},
			goMerchant(){
				uni.navigateTo({
					url:'./merchant/merchant'
				})
			},//去商家端功能页面
			showCode(){
				this.codeUrl=`http://47.95.39.75:9706/api/User/buildusercode?token=${this.userinfo.token}`;
				console.log(this.codeUrl)
				this.$refs.code.open();
			},//显示二维码用户信息
			async getImgText(){
				let obj = {token:this.token,offset:this.offset,limit:1000,keyword:'',fishground_id:'',userid:this.userid};
			    let res = await this.$Post('/api/Groundcircle/ListGroundcircle',obj);
				if(res.data.code===1){
				// this.imgVideoLen = this.imgVideoLen+res.data.data.list.length;
				// console.log(this.imgVideoLen,res.data.data.list.length);
				let num = this.imgVideoLen+res.data.data.list.length;
				this.getVideoText1(num);
				// this.getVideoText2();
				}
			},
			async getVideoText1(num){
				let obj = {ismy:'2',isrecommend:'',offset:this.offset,limit:1000,keyword:'',fishground_id:'',token:this.token,userid:this.userid};
			    let res = await this.$Post('/api/Groundcircle/ListCircleVideo',obj);
				console.log(res)
				if(res.data.code===1){
				   this.imgVideoLen = num+res.data.data.list.length;
				   console.log(this.imgVideoLen,res.data.data.list.length)
				}
			},
			// async getVideoText2(){
			// 	let obj = {ismy:'1',isrecommend:'',offset:this.offset,limit:1000,keyword:'',fishground_id:'',token:this.token,userid:this.userid};
			//     let res = await this.$Post('/api/Groundcircle/ListCircleVideo',obj);
			// 	console.log(res)
			// 	if(res.data.code===1){
			// 	   this.imgVideoLen = this.imgVideoLen+res.data.data.list.length;
			// 	    console.log(this.imgVideoLen,res.data.data.list.length)
			// 	}
			// },
			async getFans(){
				let obj = {userid:this.userid,offset:this.offset,limit:30};
				let res = await this.$Post('/api/Userfriend/CommFansUserList',obj);
				if(res.data.code ===1){
					this.fensLen =  res.data.data.list.length;
				}
				console.log(res)
			},//获取粉丝列表
			async getAttention(){
				let obj = {userid:this.userid,offset:this.offset,limit:30};
				let res = await this.$Post('/api/Userfriend/CommAttentionUserList',obj);
				if(res.data.code ===1){
					this.attentionLen = res.data.data.list.length;
				}
				// console.log(res)
			},//获取列表
		}
	}
</script>

<style lang="scss" scoped>
	.erweima_code{
		width: 600rpx !important; 
		background: white;
		border-radius: 15rpx;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title{
			font-size: 40rpx;
			color: #FF7C34;
			text-align: center;
			margin-bottom: 25rpx;
		}
		image{
			width: 250rpx !important;
			height: 250rpx !important;
			margin-bottom: 25rpx;
		}
		.sao{
			font-size: 36rpx;
			color: #333333;
			// font-weight: 600;
		}
	}
	.userPage{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #F6F6F6;
		// margin-top: -50rpx;
		box-sizing: border-box;
		padding: 30rpx 80rpx;
		font-size: 26rpx;
		color: #507DFC;
		view{
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
	.money{
		font-size: 24rpx;
		color: white;
		background: rgba(255,255,255,0.3);
		box-sizing: border-box;
		padding: 7rpx 20rpx;
		border-radius: 5rpx;
	}
	.gs{
		width: 100%;
		text-align: center;
		font-size: 27rpx;
		color: #666666;
	}
	.code{
		width: 300rpx;
		margin: 0 auto;
		image{
			width: 100%;
		}
	}
	.active1{
		color: #FF9C36;
	}
	.active2{
		color: #D3D3D3;
	}
	.box{
		margin-bottom: 50rpx;
	}
	.header{
		width: 100%;
		margin-bottom: 40rpx;
		.bk_color{
			width: 100%;
			height: 180rpx;	
			padding-top: 80rpx;
            background: linear-gradient(25deg, #24B9FF 0%, #7FD6FF 100%);
		   view{
			   width: 100%;
			   text-align: center;
			   color: white;
		   }
		}
		.user{
			width: 95%;
			margin-left: 2.5%;
			background: url(../../static/me/mind_bg.png) no-repeat;
			background-size: 100% 100%;
			box-sizing: border-box;
			padding: 35rpx 30rpx;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: -100rpx;
			margin-bottom: 20rpx;
			// z-index: 100;
			position: relative;
			.icon{
				display: flex;
				flex-direction: row;
				align-items: center;
				.avatar{
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					margin-right: 15rpx;
					background: black;
					// display: flex;
					// justify-content: center;
					// align-items: center;
				}
				image{
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
				.user_msg{
					font-size: 30rpx;
					color: white;
					height: 100rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.login{
						width: 180rpx;
						letter-spacing: 3rpx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.price{
						font-size: 25rpx;
						color: #FF9C36;
						background: rgba(255,255,255,0.34);
						box-sizing: border-box;
						padding: 4rpx 10rpx;
						border-radius: 5rpx;
					}
				}
			}
			.setting{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 120rpx;
				.top{
					display: flex;
					flex-direction: row;
					align-items: center;
					.message_all{
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						.message_radio{
							width: 20rpx;
							height: 20rpx;
							background: red;
							border-radius: 50%;
							position: absolute;
							top: -10rpx;
							right: 0;
						}
					}
				}
				.bottom{
					display: flex;
					flex-direction: row-reverse;
					image{
						width: 50rpx;
					}
				}
				image{
					width: 40rpx;
					margin: 0 10rpx;
					vertical-align: middle;
				}
			}
		}
	}
    .qiandao{
		width: 95%;
		margin: 0rpx auto;
		border: 1px solid #F0F0F0;
		box-shadow: 0px 5px 29px 0px rgba(6, 0, 1, 0.12);
		box-sizing: border-box;
		padding: 25rpx;
		border-radius: 10rpx;
		
		.top{
			width: 100%;
			display: flex;
			flex-direction: row;
			margin-bottom: 30rpx;
			image{
				width: 60rpx;
				margin-right: 15rpx;
			}
			.msg{
				display: flex;
				flex-direction: column;
				.num{
					font-size: 30rpx;
					color: #333333;
					.num_text{
						color: #5570FF;
					}
				}
				.day{
					font-size: 20rpx;
					color: #333333;
					.day_text{
						.num_text{
							color: #5570FF;
						}
					}
				}
			}
		}
		.day_detail{
			width: 90%;
			margin: 0 auto;
			display: flex;
			// justify-content: space-between;
			flex-direction: row;
			align-items: center;
			.item{
				width: 100rpx;
				height: 120rpx;
				font-size: 28rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				// margin-right: 45rpx;
				.checked{
					width: 45rpx;
				}
				.end{
					width: 55rpx;
				}
				.border{
					width: 45rpx;
					height: 45rpx;
					border-radius: 50%;
					background: #EEEEEE;
				}
			}
		}
	}
	.btn{
		
		background: linear-gradient(90deg, #FDAF86, #FE6F38);
		border-radius: 38px;
		color: white;
		font-size: 30rpx;
		width: 80%;
		margin: 50rpx auto;
		text-align: center;
		padding: 20rpx 0;
	}
	
	.pox{
		margin-top: 60rpx;
		.item{
			width: 95%;
			margin: 25rpx auto;
			font-size: 32rpx;
			color: #333333;
			background: #F0F0F0;
			border-radius: 10rpx;
			box-sizing: border-box;
			padding: 15rpx 20rpx;
			display: flex;
			align-items: center;
			image{
				width: 40rpx;
				margin-right: 15rpx;
			}
		}
	}
</style>
