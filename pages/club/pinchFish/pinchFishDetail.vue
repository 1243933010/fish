<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="活动详情" :leftIcon="true" :rightText="rightText" @rightClick="rightClick"/>
		</view>
		
		<view class="detail">
			<view class="top">
				<text>{{Obj.activity_name}}</text>
				<view class="">
					<text>状态:
					<text v-if="Obj.status==='1'">待发布</text>
					<text v-if="Obj.status==='2'">已发布</text>
					<text v-if="Obj.status==='3'">比赛中</text>
					<text v-if="Obj.status==='4'">结束中</text>
					<text v-if="Obj.status==='5'">赛事完成</text>
					<text v-if="Obj.status==='6'">异常</text>
					</text>
				</view>
			</view>
			
			<view class="time"><text><text class="title">报名开始时间</text> :{{Obj.signup_starttime}}</text></view>
			<view class="time"><text><text class="title">报名结束时间</text>:{{Obj.signup_stoptime}}</text></view>
			<view class="time">
				<text><text class="title">比赛时间</text>:{{Obj.pt_starttime}}</text>
				<view class="">
					<text><text class="title">比赛类型</text>:
				     <text v-if="Obj.activity_type==='1'">团体</text>
					 <text v-if="Obj.activity_type==='2'">掐鱼</text>
				  </text>
				</view>
			</view>
			<view class="time"><text><text class="title">比赛结束时间</text>:{{Obj.pt_stoptime}}</text></view>
			<view class="peoplel">
				<text><text class="title">比赛人数</text>:{{Obj.pt_number}}人</text>
				<text><text class="title">最低参赛人数</text>:{{Obj.lowpt_number}}人</text>
			</view>
			<view class="time">
				<!-- <text><text class="title">报名费用</text>:{{Obj.registery_fee}}</text> -->
				<text><text class="title">联系人电话</text>:{{Obj.phone_num}}</text>
			</view>
			
			<view class="content"><text><text class="title">活动内容</text>:{{Obj.activity_intro}}</text></view>
			<view class="fn">
				<view class=""
				v-if="Obj.is_join==='0'&&Obj.userid!==userinfo.user_id&&inFlog">
				<text @click="Enter(Obj)">参与</text>
				</view>
				<view class=""  
				v-if="Obj.status==='4'&&userinfo.user_id===Obj.userid">
				<text @click="updateRank">确认上传成绩</text>
				</view>
				<view class=""
					 v-if="Obj.status==='1'&&userinfo.user_id===Obj.userid"
					 @click.stop="edit(Obj)"><text>编辑</text>
				</view>
					<view class="" 
					 v-if="(Obj.status==='1'||Obj.status==='2'||Obj.status==='3')&&userinfo.user_id===Obj.userid" 
					 @click.stop="updateFish(Obj)"><text>更新状态</text>
				</view>
				<view class=""
					 v-if="Obj.status==='1'&&userinfo.user_id===Obj.userid" 
					 @click.stop="Delete(Obj)"><text>删除活动</text>
				</view>
			</view>
			<!-- </view> -->
			<!-- <view class="fn">
				<view class="" v-if="Obj.status==='4'"><text>查看排行</text></view>
			</view> -->
		</view>
		
		<view class="people">
			<text class="title">已参与人数</text>
			<view class="item" v-for="(item,index) in Obj.userlist" :key="index">
				<view class="item_con">
					<view class="user">
						<image :src="item.avatar" mode=""></image>
						<text style="margin-right: 20rpx;">{{item.username}}</text>
						<text>{{item.userphone}}</text>
					</view>
					<view style="display: flex;flex-direction: row;align-items: center;">
						 <view style="font-size: 26rpx;margin-right: 15rpx;" v-if="Obj.status==='4'||Obj.status==='5'"><text>当前成绩:{{item.grades||'无'}}</text></view>
					<view 
					style="font-size: 26rpx;
					background: #3BC0FF;
					color: white;
					border-radius: 7rpx;
					box-sizing: border-box;
					padding: 5px 15rpx;"
					v-if="Obj.userid===userinfo.id&&Obj.status==='4'"
					 @click="enterRank(item)"><text>输入成绩</text></view>
					</view>
				</view>
				
			</view>
		</view>
		
		<uni-popup type="center" ref="rank">
			<view class="box">
				<view class="inp">
					<text style="font-size: 26rpx;">输入成绩</text>
					<input type="text" value="" v-model="rankNum" />
				</view>
				<view class="btn" @click="rankBtn"><text>确定</text></view>
			</view>
		</uni-popup>
		<!-- 参与 -->
		<uni-popup type="center" ref="participate">
			<view class="box">
				<view class="inp">
					<!-- <text>姓名</text> -->
					<input type="text"  v-model="userName" placeholder="请输入姓名"/>
				</view>
				<view class="inp">
					<!-- <text>手机号</text> -->
					<input type="text" v-model="userPhone" placeholder="请输入手机号" />
				</view>
				<view class="inp" v-if="Obj.activity_type==='2'&&Obj.ispwd==='1'">
					<!-- <text>比赛授权密码</text> -->
					<input type="text" v-model="pwd" placeholder="请输入密码"/>
				</view>
				<view class="btn"  @click="btn">
					<text>确定</text>
				</view>
			</view>
		</uni-popup>
	
	
	<uni-popup type="center" ref="popup">
		<view class="popup">
			<scroll-view scroll-y="true" style="height: 900rpx;">
				<view class="form">
					<view class="inp">
						<text>活动标题</text>
						<input type="text" value=""  v-model="val.activity_name"/>
					</view>
					<view class="inp">
						<text>活动内容</text>
						<input type="text" value=""  v-model="val.activity_intro"/>
					</view>
					<view class="inp" @click="start">
						<text>报名开始时间</text>
						<input type="text" disabled  v-model="val.signup_starttime"/>
					</view>
					<view class="inp" @click="end">
						<text>报名结束时间</text>
						<input type="text" disabled  v-model="val.signup_stoptime"/>
					</view>
					<view class="inp" @click="fishing">
						<text>比赛开始时间</text>
						<input type="text" disabled  v-model="val.pt_starttime"/>
					</view>
					<view class="inp" @click="fishingEnd">
						<text>比赛结束时间</text>
						<input type="text" disabled  v-model="val.pt_stoptime"/>
					</view>
					<view class="inp">
						<text>比赛人数</text>
						<input type="number" value=""  v-model="val.pt_number"/>
					</view>
					<view class="inp">
						<text>最低参赛人数</text>
						<input type="number" value=""  v-model="val.lowpt_number"/>
					</view>
					<view class="inp">
						<text>报名费用</text>
						<input type="number" value=""  v-model="val.registery_fee"/>
					</view>
					<view class="inp">
						<text>联系人电话</text>
						<input type="number" value=""  v-model="val.phone_num"/>
					</view>
					<view class="switch">
						<text>是否立刻发布</text>
						<switch :checked="status" @change="Switch" />
					</view>
					<view class="inp">
						<text>比赛授权密码</text>
						<input type="number" value=""  v-model="val.room_pwd"/>
					</view>
					<view class="btn" @click="submit">
						<text>确定发起</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</uni-popup>
	
	<!-- 比赛开始时间 -->
		<w-picker
			:visible.sync="startVisible"
			mode="date" 
			startYear="2017" 
			endYear="2029"
			value="2020-04-08 16:45:45"
			:current="false"
			fields="second"
			@confirm="startConfirm($event,'date1')"
			:disabled-after="false"
			ref="date1"
		></w-picker>
		
		<!-- 比赛结束时间 -->
			<w-picker
				:visible.sync="endVisible"
				mode="date" 
				startYear="2017" 
				endYear="2029"
				value="2020-04-08 16:45:45"
				:current="false"
				fields="second"
				@confirm="endConfirm($event,'date2')"
				:disabled-after="false"
				ref="date2"
			></w-picker>
			<!-- 比赛开始时间 -->
				<w-picker
					:visible.sync="fishVisible"
					mode="date" 
					startYear="2017" 
					endYear="2029"
					value="2020-04-08 16:45:45"
					:current="false"
					fields="second"
					@confirm="fishConfirm($event,'date3')"
					:disabled-after="false"
					ref="date3"
				></w-picker>
				<!-- 比赛结束时间 -->
					<w-picker
						:visible.sync="fishEndVisible"
						mode="date" 
						startYear="2017" 
						endYear="2029"
						value="2020-04-08 16:45:45"
						:current="false"
						fields="second"
						@confirm="fishEndConfirm($event,'date4')"
						:disabled-after="false"
						ref="date3"
					></w-picker>
				
				<!-- 选择状态 -->
				
				<w-picker
					:visible.sync="selectorVisible"
					mode="selector"
					value="已发布"
					default-type="name"
					:default-props="defaultProps"
					:options="selectorList"
					@confirm="selectConfirm($event,'selector')"
					ref="selector" 
				></w-picker>
				
				<w-picker
					:visible.sync="payVisible"
					mode="selector"
					value=""
					default-type="name"
					:default-props="defaultProps"
					:options="payList"
					@confirm="payConfirm($event,'selector')"
					@cancel="payCancel"
					ref="selector" 
				></w-picker>
	
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{headers,popup,wPicker},
		data() {
			return {
				token:'',
				userinfo:{},
				id:'',
				Obj:{},
				peopleList:[],
				rightText:'',
				orderId:'',
				userName:'',
				userPhone:'',
				pwd:'',
				rankId:'',
				rankNum:'',
				flog:true,
				val:{
					token:'',
					activity_name:'',
					activity_intro:'',
					signup_starttime:'',
					signup_stoptime:'',
					pt_starttime:'',
					pt_stoptime:'',
					pt_number:'',
					lowpt_number:'',
					registery_fee:'',
					phone_num:'',
					publish_now:'',
					room_pwd:'',
					fishground_id:'',
					activity_type:'2'
				},
				status:false,
				startVisible:false,
				endVisible:false,
				fishVisible:false,
				fishEndVisible:false,
				orderId:null,
				selectorVisible:false,
				defaultProps:{
					label:"name",
					value:"id"
				},
				selectorList:[
					{
						name:"已发布",
						id:"2"
					},{
						name:"比赛中",
						id:"3"
					},
					{
						name:"结束比赛",
						id:"4"
					}
				],
				orderSn:'',
				payList:[
					{
						name:"支付宝支付",
						id:"alipay"
					},{
						name:"微信支付",
						id:"wxpay"
					}
				],
				payVisible:false,
				inFlog:false,
				people:false
			};
		},
		onLoad(e) {
			let {token} = uni.getStorageSync('userinfo');
			this.userinfo = uni.getStorageSync('userinfo');
			this.token = token;
			if(e.people){
				this.people  = true;
			}
			console.log(e)
			this.id = e.id;
			// this.getMsg(e.id);
			// this.getPeopleList(e.id);
			
		},
		onShow() {
			this.getMsg(this.id);
		},
		methods:{
			rightClick(){
				uni.navigateTo({
					url:`./rank?id=${this.id}`
				})
			},//点击右上角
			async getMsg(activityid){
				let res = await this.$Post('/api/Groundactivity/FishGroupActivityinfo',{activityid,token:this.token});
				if(res.data.code===1){
					this.Obj = res.data.data;
					// console.log(this.Obj,this.userinfo)
					
					if(this.Obj.status==='2'){
						this.selectorList = [
					            {
									name:"比赛中",
									id:"3"
								},
								{
									name:"结束比赛",
									id:"4"
								}
						]
					}else if(this.Obj.status==='3'){
						this.selectorList = [
								{
									name:"结束比赛",
									id:"4"
								}
						]
					}
					// <text v-if="Obj.status==='1'">待发布</text>
					// <text v-if="Obj.status==='2'">已发布</text>
					// <text v-if="Obj.status==='3'">比赛中</text>
					// <text v-if="Obj.status==='4'">结束中</text>
					// <text v-if="Obj.status==='5'">赛事完成</text>
					// <text v-if="Obj.status==='6'">异常</text>
					// selectorList:[
					// 	{
					// 		name:"已发布",
					// 		id:"2"
					// 	},{
					// 		name:"比赛中",
					// 		id:"3"
					// 	},
					// 	{
					// 		name:"结束比赛",
					// 		id:"4"
					// 	}
					// ],
					
					
					if(this.userinfo.user_id==res.data.data.userid){
						this.flog = false;
					}
					if(this.Obj.status==='5'){this.rightText='排行'}
					if(res.data.data.actuser_num===res.data.data.pt_number){
						console.log('false')
						this.inFlog = false;
						return
					}
					let time1 = new Date(res.data.data.signup_starttime).getTime();
					let time2 = new Date(res.data.data.signup_stoptime).getTime();
					let time3 = new Date().getTime();
					if(this.Obj.status==='2'&&time2>time3&&time3>time1){
						this.inFlog = true;
					}else{
						this.inFlog = false;
					}
				}
				console.log(res)
			},//获取详情
			async getPeopleList(activityid){
				let obj = {activityid,offset:1,limit:20}
				let res = await this.$Post('/api/Groundactivity/ActivityUserList',obj);
				if(res.data.code===1){
					this.peopleList = res.data.data;
				}
				console.log(res)
			},//获取该活动已报名人数
			Enter(item){
				this.orderId = item.id;
				this.rankNum = '';
				console.log(item);
				this.$refs.participate.open();
			},//打开普通用户参与比赛弹窗
			async btn(){
				
				let obj = {token:this.token,
				activityid:this.orderId,
				username:this.userName,
				userphone:this.userPhone,
				room_pwd:this.pwd}
				let res = await this.$Post('/api/Groundactivity/JoinFishGroupActivity',obj);
				console.log(res);
				// this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.orderSn = res.data.data.ordersn;
					this.getMsg(this.id);
					this.getPeopleList(this.id);
					this.$refs.participate.close();
					if(!this.people){
						this.payVisible = true;
					}
				}
			},//确定参与比赛
			payConfirm(e){
				console.log(e);
				if(e.value==='alipay'){
					uni.request({
						method:'GET',
						url:`http://47.95.39.75:9706/addons/epay/index/Payordersn`,
						header: {'content-type': 'application/json;charset=UTF-8'},
						data:{ordersn:this.orderSn,type:'alipay'},
						success: (res) => {
							uni.requestPayment({
								provider:'alipay',
								orderInfo:res.data,
								success: (res)=> {
									this.$Toast('您已购买成功');
									setTimeout(()=>{
										uni.navigateTo({
											url:'../../me/order/order'
										})
									},500)
									console.log('success:' + JSON.stringify(res));
								},
								fail: (err)=> {
									this.$Toast('支付出现错误');
								console.log('fail:' + JSON.stringify(err));
								}
							})
						}
					})
					
				}else if(e.value==='wxpay'){
					
				}
			},
			enterRank(item){
				console.log(item)
				this.rankId = item.userid;
				this.rankNum = '';
				this.$refs.rank.open();
			},//打开输入成绩弹窗
			async rankBtn(){
				let obj = {token:this.token,activityid:this.id,userid:this.rankId,grades:this.rankNum};
				let res = await this.$Post('/api/Groundactivity/UpActivityUserGradesAdmin',obj);
				this.$Toast(res.data.msg);
				if(res.data.code===1){
					this.getMsg(this.id);
					this.$refs.rank.close();
				}
			},//确定输入成绩
			Switch(e){
				this.status = e.detail.value;
			},//切换
			updateRank(){
				let obj = {token:this.token,activityid:this.id,status:5};
				uni.showModal({
					content:'上传全体成绩后无法更改排行，是否继续？',
					success: async(status) => {
						if(status.confirm){
							let res = await this.$Post('/api/Groundactivity/StartActivity',obj);
							this.$Toast(res.data.msg);
							if(res.data.code===1){
								this.getMsg(this.id);
							}
						}
					}
				})
			},//上传成绩
			Switch(e){
				this.status = e.detail.value;
			},//切换
			start(){
				this.startVisible = true;
			},//弹出开始时间选择弹窗
			startConfirm(e){
				console.log(e);
				this.val.signup_starttime = e.value;
			},//选择开始时间
			end(){
				this.endVisible = true;
			},//弹出结束时间选择弹窗
			endConfirm(e){
				// console.log(e);
				this.val.signup_stoptime = e.value;
			},//选择结束时间
			fishing(){
				this.fishVisible = true;
			},//弹出比赛时间
			fishConfirm(e){
				// console.log(e);
				this.val.pt_starttime = e.value;
			},//比赛开始时间选择
			fishingEnd(){
				this.fishEndVisible = true;
			},//弹出比赛结束时间
			fishEndConfirm(e){
				this.val.pt_stoptime = e.value;
			},//比赛结束时间选择
			edit(item){
				let obj = JSON.stringify(item)
				uni.navigateTo({
					url:`./editPinchFish?obj=${obj}`
				})
				return;
				this.orderId = item.id;
				let {activity_name,
				activity_intro,
				signup_starttime,
				signup_stoptime,
				pt_starttime,
				pt_number,
				lowpt_number,
				registery_fee,
				phone_num,
				publish_now,
				room_pwd,
				fishground_id,
				activity_type,
				pt_stoptime
				} = item;
				this.val={
					token:this.token,
					activityid:item.id,
					activity_name,
					activity_intro,
					signup_starttime,
					signup_stoptime,
					pt_starttime,
					pt_number,
					lowpt_number,
					registery_fee,
					phone_num,
					publish_now,
					room_pwd,
					fishground_id,
					activity_type,
					pt_stoptime
				}
				this.$refs.popup.open();
				console.log(item);
			},//编辑
			updateFish(item){
				this.updateId = item.id;
				this.selectorVisible = true;
				console.log(item)
			},//更新赛事状态
			selectConfirm(e){
				 let obj = {token:this.token,activityid:this.updateId,status:e.value};
				// console.log(e.value,this.updateId);
				uni.showModal({
					content:'确定要修改此活动得状态吗？',
					success: async(data) => {
						if(data.confirm){
							let res = await this.$Post('/api/Groundactivity/StartActivity',obj);
							console.log(res);
							this.$Toast(res.data.msg);
							if(res.data.code===1){
								this.getMsg(this.id);
							}
						}
					}
				})
			},//选择对应id得状态
			async submit(){
				this.status?this.val.publish_now = '2':this.val.publish_now = '1';
					let data = await this.$Post('/api/Groundactivity/EditFishGroupActivity',this.val);
					this.$Toast(data.data.msg);
					if(data.data.code===1){
						this.getMsg(this.id);
						this.$refs.popup.close();
					}
				// console.log(res);
			},//添加按钮
			 Delete(obj){
				 let data = {activityid:obj.id,token:this.token};
				 uni.showModal({
				 	content:'确定删除活动吗？',
					success: async(status) => {
						if(status.confirm){
							let res = await this.$Post('/api/Groundactivity/DelFishGroupActivity',data);
						    console.log(res);
							this.$Toast(res.data.msg);
							if(res.data.code===1){
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},500)
							}
						}
					}
				 })
				// console.log(obj);
			},
			payCancel(){
			this.$Toast('您取消支付，可在我的订单里面继续支付');	
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail{
		background: #F5FAFC;
		width: 95%;
		margin: 20rpx auto;
		border-radius: 15rpx;
		box-sizing: border-box;
		padding: 20rpx;
		view{
			font-size: 26rpx;
			color: #333333;
			
		}
		.title{
			font-weight: 600;
		}
		.top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: 600;
			font-size: 26rpx;
			color: #333333;
			margin-bottom: 15rpx;
		}
		.peoplel{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 15rpx;
		}
		.time{
			margin-bottom: 15rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.content{
			margin-bottom: 15rpx;
		}
		.fn{
			display: flex;
			justify-content: space-between;
			align-items: center;
			// margin-top: 15rpx;
			view{
				width: 170rpx;
				background: #3BC0FF;
				align-items: center;
				font-size: 26rpx;
				color: white;
				padding: 10rpx 0;
				text-align: center;
				border-radius: 10rpx;
			}
		}
	}
	.people{
		width: 95%;
		margin: 20rpx auto;
		box-sizing: border-box;
		padding: 20rpx;
		.title{
			font-weight: 600;
			font-size: 26rpx;
			margin-bottom: 15rpx;
			display: inline-block;
		}
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F0F0F0;
			padding: 15rpx 0;
			.item_con{
				display: flex;
				flex-direction: column;
				// justify-content: space-between;
				// align-items: center;
			}
			.user{
				// width: 70%;
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 26rpx;
				image{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}
			}
			input{
				width: 70%;
				border: 1px solid red;
			}
		}
	}
	.box{
		width: 700rpx;
		background: white;
		box-sizing: border-box;
		padding: 40rpx 15rpx;
		border-radius: 15rpx;
		.inp{
			margin-bottom: 20rpx;
			input{
				width: 100%;
				border: 1px solid #f0f0f0;
				font-size: 26rpx;
				padding: 15rpx 0;
				text-indent: 10rpx;
				border-radius: 10rpx;
			}
		}
		.btn{
			width: 80%;
			margin: 0 auto;
			background: #3EC1FF;
			font-size: 30rpx;
			color: white;
			text-align: center;
			border-radius: 10rpx;
			padding: 15rpx 0;
		}
	}
	
	.popup{
		width: 700rpx;
		// max-height: 900rpx;
		// overflow-y: scroll;
		background: white;
		border-radius: 15rpx;
		box-sizing: border-box;
		padding: 50rpx 25rpx;
		.inp{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 15rpx;
			height: 80rpx;
			text{
				width: 40%;
			}
			input{
				width: 60%;
				height: 80%;
				border: 1px solid #333333;
				box-sizing: border-box;
				border-radius: 10rpx;
				padding: 10rpx 0;
				text-indent: 15rpx;
			}
		}
		.switch{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.btn{
			width: 80%;
			background: #007AFF;
			margin: 40rpx auto;
			border-radius: 10rpx;
			text-align: center;
			color: white;
			padding: 10rpx 0;
		}
	}
</style>
