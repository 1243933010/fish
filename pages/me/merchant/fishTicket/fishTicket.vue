<template>
	<view>
		<view class="top_hr" style="padding-bottom: 0;"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="鱼票列表" :leftIcon="true" rightText="添加鱼票" @rightClick="rightClick"/>
		</view>
		
		
		<!-- <view class="tabTab">
			<view class="item" 
			v-for="(item,index) in tabList" 
			:class="tabInd===index?'active':''" 
			:key="index"
			@click="setIndex(index)">
				<text>{{item}}</text>
			</view>
		</view> -->
		<!-- <view class="history">
			<text>赠送用户鱼票记录</text>
		</view> -->
		
			<view class="fish_ticket_list" v-if="fishTicketList.length>0">
				<view class="item" v-for="(item,index) in fishTicketList" :key="index">
					<view class="name"><text>鱼票名称:{{item.ticket_name}}</text></view>
					<view class="status">
						<view class=""><text>鱼票价格:{{item.ticket_price}}元</text></view>
						<view class=""><text>鱼票时限:{{item.ticket_times}}小时</text></view>
						<view class="">
							<text>鱼票状态：</text>
							<text v-if="item.ticket_status==='1'" style="color: green;">可购买</text>
							<text v-if="item.ticket_status==='0'" style="color: red;">不可购买</text>
						</view>
					</view>
					<view class="intro">
						<text ><text class="intro_text">备注:</text>{{item.ticket_intro}}</text>
					</view>
					<view class="fn">
						<view  class="" @click="Edit(item)">编辑鱼票</view>
						<view class="" @click="Delete(item)">删除鱼票</view>
					</view>
					<!-- <view class="">赠送鱼票</view> -->
				</view>
			</view>
			<view class="" v-if="fishTicketList.length===0"><text>暂无鱼票</text></view>
		
		
		
		<!-- 增加鱼票 -->
		<uni-popup type="center" ref="popup">
			<view class="box">
				<view class="close">
					<image @click="close" src="../../../../static/me/guanbi.png" mode="widthFix"></image>
				</view>
				<view class="title">
					<text>添加鱼票</text>
				</view>
				<view class="inp">
					<text>名称</text>
					<input type="text" value="" v-model="ticket_name" placeholder="鱼票名称"/>
				</view>
				<view class="inp">
					<text>价格</text>
					<input type="text" value="" v-model="ticket_price" placeholder="鱼票价格"/>
				</view>
				<view class="inp">
					<text>时限</text>
					<input type="number" value="" v-model="ticket_times" placeholder="有效时长小时"/>
				</view>
				<view class="inp">
					<text>备注</text>
					<textarea  v-model="ticket_intro" placeholder="鱼票介绍" />
					<!-- <input type="text" value="" v-model="ticket_intro" placeholder="鱼票介绍"/> -->
				</view>
				<view class="inp switch">
					<text>状态:{{addStatus}}</text>
					<switch style="transform:scale(0.7)" checked="true"  @change="swicth" />
				</view>
				<view class="btn" @click="addFishTicket"><text>确定</text></view>
			</view>
		</uni-popup>
		
		<!-- 编辑鱼票弹窗 -->
		<uni-popup type="center" ref="editPopup">
			<view class="box">
				<view class="close">
					<image @click="editClose" src="../../../../static/me/guanbi.png" mode="widthFix"></image>
				</view>
				<view class="title">
					<text>添加鱼票</text>
				</view>
				<view class="inp">
					<text>名称</text>
					<input type="text" value="" v-model="edit.ticket_name" placeholder="鱼票名称"/>
				</view>
				<view class="inp">
					<text>价格</text>
					<input type="text" value="" v-model="edit.ticket_price" placeholder="鱼票价格"/>
				</view>
				<view class="inp">
					<text>时限</text>
					<input type="text" value="" v-model="edit.ticket_times" placeholder="有效时长小时"/>
				</view>
				<view class="inp">
					<text>备注</text>
					<textarea  v-model="edit.ticket_intro" placeholder="鱼票介绍" />
					<!-- <input type="text" value="" v-model="edit.ticket_intro" placeholder="鱼票介绍"/> -->
				</view>
				<view class="inp switch">
					<text>状态:{{editStatus}}</text>
					<switch checked="true" style="transform:scale(0.7)" :checked="edit.status" @change="editSwicth" />
				</view>
				<view class="btn"  @click="editFishTicket"><text>确定</text></view>
			</view>
		</uni-popup>
		
	   <uni-popup type="center" ref="giveFishPopup">
		   <view class="give_fish box">
		   	
		   </view>
	   </uni-popup>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components:{headers,popup},
		data() {
			return {
				// tabList:['我的鱼票','赠送记录'],
				// tabInd:0,
				fishTicketList:[],
				ticket_name:'',
				ticket_price:'',
				ticket_times:'',
				ticket_intro:'',
				defaultType:true,
				edit:{
					id:'',
					ticket_name:'',
					ticket_price:'',
					ticket_times:'',
					ticket_intro:'',
					status:''
				},
				addStatus:'可购买',
				editStatus:''
			};
		},
		onShow() {
			this.getFishTicketList();
		},
		methods:{
			// setIndex(index){
			// 	this.tabInd  = index;
			// },//设置tab
			editClose(){
				this.$refs.editPopup.close();
			},//关闭弹窗
			close(){
				this.$refs.popup.close();
			},//关闭弹窗
			rightClick(){
				this.$refs.popup.open();
			},
			async getFishTicketList(){
				let obj = {fishground_id:getApp().globalData.fishground_id};
				let res = await this.$Post('/api/Groundticket/ListGroundticket',obj);
				if(res.data.code===1){
					this.fishTicketList = res.data.data;
				}
				// console.log(res)
			},//获取绑定渔场的鱼票列表
			swicth(e){
				if(e.detail.value){
					this.addStatus = '可购买'
				}else{
					this.addStatus = '不可购买'
				}
				this.defaultType = e.detail.value;
			},//单选
			async addFishTicket(){
				if(this.ticket_name===''||this.ticket_name.length>20){
					this.$Toast('请输入20字以内的鱼票名称');
					return
				}
				let {token} = uni.getStorageSync('userinfo');
				let ticket_status = 1;
				if(!this.defaultType){ticket_status=0};
				let obj = {
					token,
					ticket_status,
					ticket_name:this.ticket_name,
					ticket_price:this.ticket_price,
					ticket_times:this.ticket_times,
					ticket_intro:this.ticket_intro
				}
				let res = await this.$Post('/api/Groundticket/AddGroundticket',obj);
				this.$Toast(res.data.msg);
				console.log(res)
				if(res.data.code===1){
					this.getFishTicketList();
					this.$refs.popup.close();
				}
			},//增加鱼票
			Edit(item){
				this.edit.id = item.id;
				this.edit.ticket_name = item.ticket_name;
				this.edit.ticket_price = item.ticket_price;
				this.edit.ticket_times = item.ticket_times;
				this.edit.ticket_intro = item.ticket_intro;
				this.edit.status = true;
				if(item.ticket_status==='0'){
					this.edit.status = false;
					this.editStatus = '不可购买';
				}else{
					this.editStatus = '可购买';
				}
				this.$refs.editPopup.open();
				// console.log(item)
			},
			editSwicth(e){
				if(e.detail.value){
					this.editStatus = '可购买';
				}else{
					this.editStatus = '不可购买';
				}
					this.edit.status = e.detail.value;
			},//编辑状态改变
			async editFishTicket(){
				if(this.ticket_name===''||this.ticket_name.length>20){
					this.$Toast('请输入20字以内的鱼票名称');
					return
				}
				let {token} = uni.getStorageSync('userinfo');
				let ticket_status = 1;
				if(!this.edit.status){ticket_status=0};
				let obj = {
					token,
					ticket_status,
					ticket_name:this.edit.ticket_name,
					ticket_price:this.edit.ticket_price,
					ticket_times:this.edit.ticket_times,
					ticket_intro:this.edit.ticket_intro,
					ticketid:this.edit.id
				}
				let res = await this.$Post('/api/Groundticket/EditGroundticket',obj);
				this.$Toast(res.data.msg);
				// console.log(res)
				if(res.data.code===1){
					this.getFishTicketList();
					this.$refs.editPopup.close();
				}
			},//编辑确定按钮
			async Delete(item){
				uni.showModal({
					content:'确定要删除该鱼票吗？',
					success:async (res)=>{
						if(res.confirm){
							let {token} = uni.getStorageSync('userinfo');
							let obj = {
								token,
								ticketid:item.id
							}
							let data = await this.$Post('/api/Groundticket/DelGroundticket',obj);
							this.$Toast(data.data.msg);
							if(data.data.code===1){
								this.getFishTicketList();
							}
						}
					}
				})
			},//删除鱼票
		}
	}
</script>

<style lang="scss" scoped>
	.tabTab{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		margin-bottom: 20rpx;
		.item{
			width: 50%;
			height: 100%;
			text-align: center;
			background: #FAFAFA;
			color: #999999;
			font-size: 26rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.active{
		background: #00ACFF !important;
		color: white !important;
	}
	.fish_ticket_list{
		width: 95%;
		margin:  30rpx auto;
		.item{
			background: #CBEEFF;
			margin-bottom: 20rpx;
			border-radius: 15rpx;
			box-sizing: border-box;
			padding: 20rpx;
			.name{
				font-size: 30rpx;
				color: #333333;
				margin-bottom: 15rpx;
			}
			.status{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
				view{
					display: flex;
					flex-direction: row;
					align-items: center;
					color: #333333;
					font-size: 26rpx;
				}
			}
			.intro{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 30rpx;
				text{
					font-size: 26rpx;
				}
				.intro_text{
					color: #333333;
					font-size: 26rpx;
					font-weight: 600;
				}
			}
			.fn{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				view{
					background: #69CFFF;
					color: white;
					font-size: 26rpx;
					border-radius: 10rpx;
					box-sizing: border-box;
					padding: 10rpx 20rpx;
				}
			}
		}
	}
	.box{
		width: 700rpx;
		background: white;
		border-radius: 15rpx;
		box-sizing: border-box;
		padding: 50rpx 25rpx;
		.close{
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			margin-bottom: 10rpx;
			image{
				width: 30rpx;
				margin-right: 15rpx;
			}
		}
		.title{
			width: 100%;
			border-bottom: 1px solid #CBCBCB;
			text-align: center;
			padding-bottom: 25rpx;
			margin-bottom: 25rpx;
		}
		.inp{
			width: 100%;
			display: flex;
			flex-direction: column;
			// align-items: center;
			margin-bottom: 20rpx;
			text{
				margin-right: 20rpx;
				margin-bottom: 10rpx;
			}
			input{
				width: 100%;
				font-size: 26rpx;
				border-radius: 10rpx;
				padding: 18rpx 0;
				border: 1px solid #333333;
				text-indent: 15rpx;
			}
			textarea{
				width: 100%;
				height: 200rpx;
				font-size: 26rpx;
				border-radius: 10rpx;
				padding: 18rpx 0;
				border: 1px solid #333333;
				text-indent: 15rpx;
			}
		}
		.switch{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
		.btn{
			width: 80%;
			margin: 0 auto;
			background: #007AFF;
			border-radius: 15rpx;
			font-size: 30rpx;
			padding: 15rpx 0;
			text-align: center;
			color: white;
		}
	}
</style>
