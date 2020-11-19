<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="鱼票订单" :leftIcon="true" />
		</view>
		<view class="tab_hr"></view>
		<!-- <view class="tab">
			<view 
			class="item" 
			v-for="(item,index) in tabList" 
			:key="index" 
			@click="check(item,index)"
			:class="[ind===index?'active':'']">
				<text>{{item.name}}</text>
			</view>
		</view> -->
		<view class="select_all">
			<view class="select" @click="onSelect">
				<text>{{status}}</text>
				<image src="../../../../static/me/xiala.png" mode="widthFix"></image>
			</view>
		</view>
		<view style="font-size: 26rpx;" v-if="list.length===0">暂无数据</view>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index" @click="goTo(item)">
				<view class="top">
					<text class="name">{{item.ground_name}}</text>
					<view class="status">
						<text class="font">状态：</text>
					<text v-if="item.ticket_status==='0'" style="color: #999999;">无效</text>
					<text v-if="item.ticket_status==='1'" style="color: #FF0000;">待支付</text>
					<text v-if="item.ticket_status==='2'" style="color: #6ACFFF;">已支付</text>
					<text v-if="item.ticket_status==='3'" style="color: #00BC5D;">正在使用</text>
					<text v-if="item.ticket_status==='4'" style="color: #999999;">已使用</text>
					<text v-if="item.ticket_status==='5'" style="color: #999999;">已删除</text>
					</view>
				</view>
				<view class="flex">
					<text>单号：{{item.ordersn}}</text>
					<text>鱼票价格：{{item.ticket_price}}</text>
				</view>
				<view class="flex">
					<text>鱼票名称：{{item.ticket_name}}</text>
				</view>
				<view class="flex">
					<text>时间：{{item.create_time}}</text>
				</view>
				<!-- <view class="" @click.stop="start(item)" v-if="item.ticket_status==='1'"><text class="jishi">开始计时</text></view> -->
			</view>
		</view>
		
		
		
		
		
		<w-picker
			:visible.sync="selectorVisible"
			mode="selector"
			value=""
			default-type="name"
			:default-props="defaultProps"
			:options="selectorList"
			@confirm="onConfirm($event,'selector')"
			ref="selector" 
		></w-picker>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue'
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{headers,popup,wPicker},
		data() {
			return {
				token:'',
				// 	状态0:无效,1:有效,2=待支付,3=正在使用,4=已使用,all=全部
				// tabList:[
				// 	{status:'all',name:'全部'},
				// 	{status:'2',name:'待支付'},
				// 	{status:'1',name:'已支付'},
				// 	{status:'3',name:'正在使用'},
				// 	{status:'4',name:'已使用'},
				// 	{status:'0',name:'无效'}
				// ],
				list:[],
				// ind:0,
				offset:1,
				selectorList:[
					{
						name:"全部",
						id:"all"
					},{
						name:"待支付",
						id:1
					},
					{
						name:"已支付",
						id:2
					},
					{
						name:"正在使用",
						id:3
					},
					{
						name:"已使用",
						id:4
					},
					{
						name:"无效",
						id:0
					}
				],
				selectorVisible:false,
				defaultProps:{
					label:"name",
					value:"id"
				},
				status:'全部',
				value:'all'
			};
		},
		mounted() {
			this.token = uni.getStorageSync('userinfo').token;
			
		},
		onShow() {
			let obj = {token:this.token,offset:this.offset,limit:10,ticket_status:'all'};
			this.getMsg(obj);
		},
		onReachBottom() {
			this.offset++;
			let obj = {token:this.token,offset:this.offset,limit:10,ticket_status:this.value};
			this.getMsg(obj);
		},
		methods:{
			goTo(item){
				uni.navigateTo({
					url:`./detail?orderId=${item.id}`
				})
				console.log(item)
			},
			async onConfirm(e){
				console.log(e)
				this.status = e.result;
				this.value = e.value;
				this.offset = 1;
				this.list = [];
				let obj = {token:this.token,offset:this.offset,limit:10,ticket_status:e.value};
				this.getMsg(obj);
			},//下拉框
			onSelect(){
				this.selectorVisible = true;
			},//打开下拉框
			async start(item){
				let obj = {token:this.token,id:item.id};
				let res = await this.$Post('/api/Groundticket/ConfirmStoreTicket',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.list=[];
					setTimeout(()=>{
						let obj = {token:this.token,offset:this.offset,limit:20,ticket_status:this.value};
						this.getMsg(obj);
					},500)
				}
				console.log(item)
			},
			// check(item,index){
			// 	this.ind = index;
			// 	this.offset = 1;
			// 	this.list = [];
			// 	let obj = {token:this.token,offset:this.offset,limit:20,ticket_status:item.status};
			// 	this.getMsg(obj);
			// },
			async getMsg(obj){
				uni.showLoading({
					mask:true
				});
				let res = await this.$Post('/api/Groundticket/StoreTicketList',obj);
				
				if(res.data.code===1){
					if(this.offset===1){
						this.list = res.data.data.list;
					}else{
						this.list.push(...res.data.data.list);
					}
					
				}
				uni.hideLoading();
				// console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select_all{
		width: 100%;
		background: white;
		position: fixed;
		top: 160rpx;
		padding-top: 30rpx;
		.select{
			width: 700rpx;
			border: 1px solid #333333;
			border-radius: 8rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding: 15rpx 20rpx;
			margin-left: 25rpx;
			font-size: 26rpx;
			background: white;
			image{
				width: 40rpx;
			}
		}
	}
	.active{
		color: red;
	}
	.tab_hr{
		width: 100%;
		height: 100rpx;
	}
	.tab{
		width: 100%;
		height: 100rpx;
		position: fixed;
		top: 160rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 15rpx 20rpx;
		font-size: 27rpx;
	}
	.list{
		width: 90%;
		margin: 0 auto;
		.item{
			background: #CBEEFF;
			border-radius: 10rpx;
			margin-bottom: 25rpx;
			box-sizing: border-box;
			padding: 20rpx;
			.top{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 15rpx;
				.name{
					font-size: 30rpx;
					font-weight: 600;
				}
				.status{
					font-size: 26rpx;
					.font{
						font-weight: 600;
					}
				}
			}
			.flex{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				margin-bottom: 15rpx;
			}
			.jishi{
				background: #3DC1FF;
				font-size: 26rpx;
				color: white;
				box-sizing: border-box;
				padding: 5rpx 15rpx;
				border-radius: 10rpx;
			}
		}
	}
</style>
