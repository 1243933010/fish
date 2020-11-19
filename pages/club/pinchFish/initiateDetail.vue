<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="发起比赛" :leftIcon="true" />
		</view>
		
		
		<view class="popup">
			<view class="form">
				<view class="inp">
					<text>活动标题:</text>
					<input type="text" value=""  v-model="val.activity_name"/>
				</view>
				<view class="inp">
					<text>活动内容:</text>
					<textarea style="height: 400rpx;" maxlength="-1" v-model="val.activity_intro" placeholder="输入内容" />
					<!-- <input type="text" value=""  v-model="val.activity_intro"/> -->
				</view>
				<view class="inp" @click="start">
					<text>报名开始时间:</text>
					<input type="text" disabled  v-model="val.signup_starttime"/>
				</view>
				<view class="inp" @click="end">
					<text>报名结束时间:</text>
					<input type="text" disabled  v-model="val.signup_stoptime"/>
				</view>
				<view class="inp" @click="fishing">
					<text>比赛开始时间:</text>
					<input type="text" disabled  v-model="val.pt_starttime"/>
				</view>
				<view class="inp" @click="fishingEnd">
					<text>比赛结束时间:</text>
					<input type="text" disabled  v-model="val.pt_stoptime"/>
				</view>
				<view class="inp">
					<text>比赛人数:</text>
					<input type="number" value=""  v-model="val.pt_number"/>
				</view>
				<view class="inp">
					<text>最低参赛人数:</text>
					<input type="number" value=""  v-model="val.lowpt_number"/>
				</view>
				<!-- <view class="inp">
					<text>报名费用:</text>
					<input type="number"   v-model="val.registery_fee"/>
				</view> -->
				<view class="inp">
					<text>联系人电话:</text>
					<input type="number" value=""  v-model="val.phone_num"/>
				</view>
				<view class="switch">
					<text>是否立刻发布:</text>
					<switch style="transform:scale(0.7)" :checked="status" @change="Switch" />
				</view>
				<view class="inp">
					<text>比赛授权密码:</text>
					<input type="number" value=""  v-model="val.room_pwd"/>
				</view>
				<view class="btn" @click="submit">
					<text>确定发起</text>
				</view>
			</view>
		</view>
		
		
		
		<!-- 比赛开始时间 -->
			<w-picker
				:visible.sync="startVisible"
				mode="date" 
				startYear="2017" 
				endYear="2029"
				:value="nowTime"
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
					:value="nowTime"
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
						:value="nowTime"
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
							:value="nowTime"
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
					activity_type:'2'
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
				],
				nowTime:''
			};
		},
		onLoad(e) {
			let {token} = uni.getStorageSync('userinfo');
			this.val.token = token;
			this.val.fishground_id = e.roomId;
			this.id = e.roomId;
			this.token = token;
			console.log(e);
			// this.getList();
		},
		onShow() {
			// this.getList();
			this.nowTime =  this.format(new Date());
			// console.log(res)
		},
		methods:{
			fnTime(time) {
			     let timestamp2 = Date.parse(new Date(time));
				 return timestamp2
			},
			
			format(Date){
				var Y = Date.getFullYear();
				var M = Date.getMonth() + 1;
					M = M < 10 ? '0' + M : M;// 不够两位补充0
				var D = Date.getDate();
					D = D < 10 ? '0' + D : D;
				var H = Date.getHours();
					H = H < 10 ? '0' + H : H;
				var Mi = Date.getMinutes();
					Mi = Mi < 10 ? '0' + Mi : Mi;
				var S = Date.getSeconds();
					S = S < 10 ? '0' + S : S;
					return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
			},
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
				console.log(this.fnTime(e.value)-this.fnTime(this.val.signup_starttime))
				if(this.fnTime(e.value)<=this.fnTime(this.val.signup_starttime)){
					this.$Toast('不能短于报名开始时间');
					return;
				}
				// console.log(e);
				this.val.signup_stoptime = e.value;
			},//选择结束时间
			fishing(){
				this.fishVisible = true;
			},//弹出比赛时间
			fishConfirm(e){
				// console.log(e);
				if(this.fnTime(e.value)<=this.fnTime(this.val.signup_stoptime)){
					this.$Toast('不能短于报名结束时间');
					return;
				}
				this.val.pt_starttime = e.value;
			},//比赛开始时间选择
			fishingEnd(){
				this.fishEndVisible = true;
			},//弹出比赛结束时间
			fishEndConfirm(e){
				if(this.fnTime(e.value)<=this.fnTime(this.val.pt_starttime)){
					this.$Toast('不能短于比赛开始时间');
					return;
				}
				this.val.pt_stoptime = e.value;
			},//比赛结束时间选择
			async submit(){
				if(this.val.activity_name===''||this.val.activity_name.length>20){
					this.$Toast('请输入20字以内的个人赛名称');
					return
				}
				// console.log(this.val.pt_number,this.val.lowpt_number)
				if(this.val.pt_number*1<this.val.lowpt_number*1){
					this.$Toast('最低人数不能多于比赛人数');
					return;
				}
				if(!this.val.lowpt_number){
					this.$Toast('最低人数不能为空');
					return;
				}
				this.status?this.val.publish_now = '2':this.val.publish_now = '1';
				
					let res = await this.$Post('/api/Groundactivity/AddFishGroupActivity',this.val);
					this.$Toast(res.data.msg);
					if(res.data.code===1){
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},500)
						
					}
				
				
				// console.log(res);
			},//添加按钮
		}
	}
</script>

<style lang="scss" scoped>
.popup{
	
		width: 700rpx;
		margin: 0 auto;
		// max-height: 900rpx;
		overflow-y: scroll;
		background: white;
		border-radius: 15rpx;
		box-sizing: border-box;
		padding: 0rpx 15rpx;
		.inp{
			display: flex;
			flex-direction: column;
			// align-items: center;
			margin-bottom: 15rpx;
			// height: 80rpx;
			text{
				// width: 30%;
				font-size: 26rpx;
				margin-bottom: 15rpx;
			}
			input{
				width: 100%;
				height: 80rpx;
				border: 1px solid #333333;
				box-sizing: border-box;
				border-radius: 10rpx;
				padding: 0rpx 0;
				text-indent: 15rpx;
				margin-bottom: 20rpx;
			}
			textarea{
				width: 100%;
				height: 150rpx;
				border: 1px solid #333333;
				box-sizing: border-box;
				border-radius: 10rpx;
				padding: 0rpx 0;
				text-indent: 15rpx;
			}
		}
		.switch{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			font-size: 26rpx;
		}
		.btn{
			width: 80%;
			background: #51D1F5;
			margin: 40rpx auto;
			border-radius: 10rpx;
			text-align: center;
			color: white;
			padding: 20rpx 0;
		}
	}
</style>
