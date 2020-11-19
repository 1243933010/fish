<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="提现" :leftIcon="true" />
		</view>
		
		<view class="bk">
			<view class="text">
				<text class="num">￥{{userMoney}}</text>
				<text class="label">账户余额(元)</text>
			</view>
		</view>
		
		<view class="form">
			<view class="inp">
				<view class="title">
					<text>提现金额</text>
					<input type="text" v-model="obj.money" placeholder="请输入转账金额"/>
				</view>
			</view>
			<view class="inp">
				<view class="title">
					<text>提现账户</text>
					<input type="text" v-model="obj.account" placeholder="请输入提现账户"/>
				</view>
			</view>
			<view class="inp">
				<view class="title">
					<text>账户名</text>
					<input type="text" v-model="obj.username" placeholder="请输入账户名"/>
				</view>
			</view>
			 <view class="inp">
				 <radio-group @change="radioChange">
					 <label class="radio" v-for="(item,index) in checkList" :key="index">
					 	<radio :value="item.value"  :checked="checkIndex===index"  style="transform:scale(0.7)"/>{{item.label}}
					 </label>
				 </radio-group>
            </view>
			<view class="inp"  v-show="flog">
				<view class="title">
					<text>银行名称</text>
					<input type="text" v-model="obj.withdraw_name" placeholder="请输入银行名称"/>
				</view>
			</view>
			<!-- <view class="inp" style="margin-bottom: 100rpx;">
				<view class="title">
					<text>支付密码</text>
					<input type="text" value="" placeholder="请输入支付密码"/>
				</view>
			</view> -->
			<view class="btn" @click="withDraw">
				<text>提现</text>
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
				Height:'',
				userMoney:'',
				userinfo:{},
				checkList:[
					{label:'银行卡',value:'bank'},
					// {label:'微信',value:'weixin'},
					// {label:'支付宝',value:'alipay'}
				],
				checkIndex:0,
				flog:true,
				obj:{
					money:'',
					account:'',
					username:'',
					type:'',
					withdraw_name:''
				}
			};
		},
		created() {
			uni.getSystemInfo({
				success: (data) => {
					this.Height = data.windowHeight-80-110-125-110;
				}
			})
				this.userinfo = uni.getStorageSync('userinfo');
			this.getUserInfo();
		},
		methods:{
			async getUserInfo(){
				let obj = {token:this.userinfo.token};
				let res = await this.$Get('/api/user/Getuserinfo',obj);
				if(res.data.code===1){
					this.userMoney = res.data.data.money;
					// if(res.data.data.is_merchant==='1'){getApp().globalData.fishground_id=res.data.data.fishid};
				}
			},//获取个人信息
			radioChange(e){
				this.checkList.forEach((val,ind)=>{
					if(e.detail.value===val.value){
						this.flog = ind===0;
						this.checkIndex = ind;
					}
				})
			},//根据选择的支付方式判断
			async withDraw(){
				this.obj.type = this.checkList[this.checkIndex].value;
				let res = await this.$Post('/api/User/AddWithdrawalAmount',this.obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					let obj = {num:this.obj.money,type:this.checkList[this.checkIndex].value};
					uni.setStorageSync('withDrawStatus',obj);
					setTimeout(()=>{
						uni.redirectTo({
							url:`./status`
						})
					},500)
				}
				// console.log(res)
			},//提现
		}
	}
</script>

<style lang="scss" scoped>
.bk{
		width: 95%;
		height: 220rpx;
		margin: 20rpx auto;
		background: url(../../../static/me/bg.png) no-repeat;
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.text{
			display: flex;
			flex-direction: column;
			align-items: center;
			.num{
				font-size: 48rpx;
				color: #FFD200;
				margin-bottom: 10rpx;
			}
			.label{
				color: white;
				font-size: 26rpx;
			}
		}
	}
	.form{
		width: 90%;
		margin: 0 auto;
		.inp{
			margin-bottom: 25rpx;
			.title{
				color: #009DFF;
				font-size: 26rpx;
			}
			input{
				font-size: 24rpx;
				color: #343434;
				border-bottom: 1px solid #F0F0F0;
				padding: 25rpx 0 15rpx 0;
			}
		}
		.btn{
			width: 80%;
			margin: 100rpx auto;
			text-align: center;
			background: #6AD0FF;
			color: white;
			font-size: 26rpx;
			border-radius: 7rpx;
			padding: 20rpx 0;
		}
	}
</style>
