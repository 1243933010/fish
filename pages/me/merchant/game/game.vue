<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;">
			<headers title="比赛列表" :leftIcon="true" rightText="添加正赛" @rightClick="rightClick"/>
		</view>
		
		<view style="font-size: 26rpx;" v-if="gameList.length===0">暂无数据</view>
		<view class="game_list">
			<view class="item" v-for="(item,index) in gameList" :key="index" @click.stop="seeDetail(item)">
				<view class="top">
					<view class="top_text"><text>活动标题:{{item.activity_name}}</text></view>
					<view class="">
						<text>状态:
						<text v-if="item.status==='1'">待发布</text>
						<text v-if="item.status==='2'">已发布</text>
						<text v-if="item.status==='3'">比赛中</text>
						<text v-if="item.status==='4'">结束中</text>
						<text v-if="item.status==='5'">统计完成</text>
						<text v-if="item.status==='6'">异常</text>
						</text>
					</view>
				</view>
				<!-- <view class="con"><text><text class="con_text">活动内容:</text> {{item.activity_intro}}</text></view> -->
				
				<view class="bottom">
					<view class="">
						<text>
							<text class="con_text">比赛类型:</text>
					     <text v-if="item.activity_type==='1'">团体</text>
						 <text v-if="item.activity_type==='2'">掐鱼</text>
					  </text>
					</view>
					<view class=""><text><text class="con_text">比赛时间:</text> {{item.pt_starttime}}</text></view>
				</view>
				<!-- <view class=""
				 v-if="item.status==='1'||item.status==='2'"
				 @click.stop="edit(item)"><text>编辑</text></view> -->
				<!-- <view class="" 
				 v-if="item.status==='1'||item.status==='2'||item.status==='3'" 
				 @click.stop="updateFish(item)"><text>更新状态</text></view> -->
			</view>
		</view>
		
		
		
		<!-- <uni-popup type="center" ref="popup">
			<view class="popup">
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
			</view>
		</uni-popup> -->
		
		<!-- 比赛开始时间 -->
			<!-- <w-picker
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
			></w-picker> -->
			
			<!-- 比赛结束时间 -->
				<!-- <w-picker
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
				></w-picker> -->
				<!-- 比赛开始时间 -->
					<!-- <w-picker
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
					></w-picker> -->
					<!-- 比赛结束时间 -->
						<!-- <w-picker
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
						></w-picker> -->
					
					<!-- 选择状态 -->
					
					<!-- <w-picker
						:visible.sync="selectorVisible"
						mode="selector"
						value="已发布"
						default-type="name"
						:default-props="defaultProps"
						:options="selectorList"
						@confirm="selectConfirm($event,'selector')"
						ref="selector" 
					></w-picker> -->
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import popup from '@/components/uni-popup/uni-popup.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{headers,wPicker},
		data() {
			return {
				token:'',
				fishid:'',
				gameList:[],
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
					activity_type:'1'
				},
				status:false,
				startVisible:false,
				endVisible:false,
				fishVisible:false,
				fishEndVisible:false,
				selectorVisible:false,
				orderId:null,
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
				]
			};
		},
		onShow() {
			let {token} = uni.getStorageSync('userinfo');
			// console.log(token)
			this.token = token;
			this.getGameList();
			this.getUserInfo();
		},
		methods:{
			async getUserInfo(){
				let obj = {token:this.token};
				let res = await this.$Get('/api/user/Getuserinfo',obj);
				if(res.data.code===1){
					this.fishid = res.data.data.fishid;
					// console.log(res.data)
				}
			},//获取个人信息
			async getGameList(){
				let obj = {token:this.token,fishground_id:this.fishid,activity_type:'1',offset:1,limit:20};
				let res = await this.$Post('/api/Groundactivity/UserActivityList',obj);
				if(res.data.code===1){
					this.gameList = res.data.data.list;
				}
				// console.log(res)
			},//获取添加得比赛列表
			rightClick(){
				// this.orderId = null;
				// this.val={
				// 	token:this.token,
				// 	activity_name:'',
				// 	activity_intro:'',
				// 	signup_starttime:'',
				// 	signup_stoptime:'',
				// 	pt_starttime:'',
				// 	pt_number:'',
				// 	lowpt_number:'',
				// 	registery_fee:'',
				// 	phone_num:'',
				// 	publish_now:'',
				// 	room_pwd:'',
				// 	fishground_id:this.fishid,
				// 	activity_type:'1',
				// 	pt_stoptime:''
				// },
				// this.$refs.popup.open();
				uni.navigateTo({
					url:'./addGame'
				})
			},//添加正赛
			// Switch(e){
			// 	this.status = e.detail.value;
			// },//切换
			// start(){
			// 	this.startVisible = true;
			// },//弹出开始时间选择弹窗
			// startConfirm(e){
			// 	console.log(e);
			// 	this.val.signup_starttime = e.value;
			// },//选择开始时间
			// end(){
			// 	this.endVisible = true;
			// },//弹出结束时间选择弹窗
			// endConfirm(e){
			// 	// console.log(e);
			// 	this.val.signup_stoptime = e.value;
			// },//选择结束时间
			// fishing(){
			// 	this.fishVisible = true;
			// },//弹出比赛时间
			// fishConfirm(e){
			// 	// console.log(e);
			// 	this.val.pt_starttime = e.value;
			// },//比赛开始时间选择
			// fishingEnd(){
			// 	this.fishEndVisible = true;
			// },//弹出比赛结束时间
			// fishEndConfirm(e){
			// 	this.val.pt_stoptime = e.value;
			// },//比赛结束时间选择
			// async submit(){
			// 	this.status?this.val.publish_now = '2':this.val.publish_now = '1';
			// 	if(!this.orderId){
			// 		let res = await this.$Post('/api/Groundactivity/AddFishGroupActivity',this.val);
			// 		this.$Toast(res.data.msg);
			// 		if(res.data.code===1){
			// 			this.getGameList();
			// 			this.$refs.popup.close();
						
			// 		}
			// 	}else{
			// 		let data = await this.$Post('/api/Groundactivity/EditFishGroupActivity',this.val);
			// 		this.$Toast(data.data.msg);
			// 		if(data.data.code===1){
			// 			this.getGameList();
			// 			this.$refs.popup.close();
			// 		}
			// 	}
				
			// 	// console.log(res);
			// },//添加按钮
			// edit(item){
			// 	this.orderId = item.id;
			// 	let {activity_name,
			// 	activity_intro,
			// 	signup_starttime,
			// 	signup_stoptime,
			// 	pt_starttime,
			// 	pt_number,
			// 	lowpt_number,
			// 	registery_fee,
			// 	phone_num,
			// 	publish_now,
			// 	room_pwd,
			// 	fishground_id,
			// 	activity_type,
			// 	pt_stoptime
			// 	} = item;
			// 	this.val={
			// 		token:this.token,
			// 		activityid:item.fishid,
			// 		activity_name,
			// 		activity_intro,
			// 		signup_starttime,
			// 		signup_stoptime,
			// 		pt_starttime,
			// 		pt_number,
			// 		lowpt_number,
			// 		registery_fee,
			// 		phone_num,
			// 		publish_now,
			// 		room_pwd,
			// 		fishground_id,
			// 		activity_type,
			// 		pt_stoptime
			// 	}
			// 	this.$refs.popup.open();
			// 	console.log(item);
			// },//编辑
			// updateFish(item){
			// 	this.updateId = item.id;
			// 	this.selectorVisible = true;
			// 	console.log(item)
			// },//更新赛事状态
			// selectConfirm(e){
			// 	 let obj = {token:this.token,activityid:this.updateId,status:e.value};
			// 	// console.log(e.value,this.updateId);
			// 	uni.showModal({
			// 		content:'确定要修改此活动得状态吗？',
			// 		success: async(data) => {
			// 			if(data.confirm){
			// 				let res = await this.$Post('/api/Groundactivity/StartActivity',obj);
			// 				console.log(res);
			// 				this.$Toast(res.data.msg);
			// 				if(res.data.code===1){
			// 					this.getGameList();
			// 				}
			// 			}
			// 		}
			// 	})
			// },//选择对应id得状态
			seeDetail(item){
				console.log(item)
				uni.navigateTo({
					url:`./gameDetail/gameDetail?id=${item.id}`
				})
				
			},//去详情页面
		}
	}
</script>

<style lang="scss" scoped>
	.game_list{
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		.item{
			margin-bottom: 20rpx;
			background: #F5F9FC;
			box-sizing: border-box;
			padding: 30rpx;
			border-radius: 15rpx;
			.top{
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #333333;
				font-size: 26rpx;
				font-weight: 600;
				margin-bottom: 15rpx;
				.top_text{
					width: 70%;
				}
			}
			.con{
				font-size: 26rpx;
				margin-bottom: 20rpx;
				.con_text{
					font-weight: 600;
				}
			}
			.bottom{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				.con_text{
					font-weight: 600;
				}
			}
		}
	}
.popup{
		width: 700rpx;
		max-height: 900rpx;
		overflow-y: scroll;
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
