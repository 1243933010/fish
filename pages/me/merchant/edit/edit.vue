<template>
	<view>
		<view class="top_hr"></view>
		<view style="position: fixed;top: 0;width: 100%;z-index: 100;">
			<headers title="编辑信息" :leftIcon="true" rightText="保存" @rightClick="rightClick"/>
		</view>
		
		
		<view class="form">
			<view class="inp">
				<text>钓场名称</text>
				<input type="text" v-model="obj.ground_name" />
			</view>
			<view class="inp" @click="selectType">
				<text>钓场类型</text>
				<input type="text" disabled v-model="obj.ground_type" />
			</view>
			<view class="inp" @click="chooseCity">
				<text>地区选择</text>
				<input type="text" disabled v-model="obj.area_name" />
			</view>
			<view class="inp" >
				<text>详细地址</text>
				<input type="text"  v-model="obj.ground_address" />
			</view>
			<view class="inp">
				<text>收费规则</text>
				<textarea v-model="obj.charging_rules" placeholder="" maxlength="300" />
				<!-- <input type="text" v-model="obj.charging_rules" /> -->
			</view>
			<!-- <view class="inp">
				<text>钓场简介</text>
				<textarea v-model="obj.ground_intro" placeholder="" maxlength="300" />
			</view> -->
			<view class="image">
				<text class="image_title">钓场图片</text>
				<view class="img_list">
					<view class="item" v-for="(item,index) in imgList" :key="index">
						<image  :src="item" mode="widthFix"></image>
						<!-- <view class="delete"></view> -->
						<image @click="Delete(index)" class="delete" src="../../../../static/club/delete.png" mode="widthFix"></image>
					</view>
					<image @click="addImg" src="../../../../static/club/add.png" mode="widthFix"></image>
				</view>
				
			</view>
			<view class="inp">
				<text>鱼种</text>
				<input type="text" v-model="obj.fish_species" />
			</view>
			<view class="fishList">
				<view class="fish_item" @click="checkFish(item,index)" :class="item.flog?'fish_acitve':''" v-for="(item,index) in fishList" :key="index">
					<text>{{item.name}}</text>
				</view>
				<view class="fish_add" @click="fishAdd">
					<text>添加</text>
				</view>
			</view>
			<view class="inp plda" @click="chooseAddress">
				<view class="address">
					<text>选择位置</text>
					<image src="../../../../static/address.png" mode="widthFix"></image>
				</view>
				<view class="map">
					<text>{{obj.ground_longitude}}</text>
					<text>{{obj.ground_atitude}}</text>
				</view>
			</view>
			<view class="inp">
				<text>状态</text>
				<switch :checked="obj.ground_status==='1'" @change="switchChange"  />
			    <text>{{status}}渔场</text>
			</view>
		</view>
		
		
		
		<uni-popup ref="popup"  type="bottom">
			        <view class="box">
						<scroll-view  scroll-y="true" class="scroll-Y">
			              <view class="province">
			                   		<text class="province_text" 
			                   		v-for="(item,index) in provinceList" 
			                   		:key="index"
									:class="provinceIndex===index?'active':''"
									@click="chooseProvince(item,index)">{{item.areaName}}</text>
			              </view>
						  </scroll-view> 
						  <scroll-view  scroll-y="true" class="scroll-Y">
						  <view class="city">
						       		<text class="city_text" 
						       		v-for="(item,index) in cityList" 
						       		:key="index"
									:class="cityIndex===index?'active':''"
									@click="changeCity(item,index)">{{item.areaName}}</text>
						  </view>
						  </scroll-view>
						    <scroll-view  scroll-y="true" class="scroll-Y">
						  <view class="city area">
						       		<text class="city_text area_text" 
						       		v-for="(item,index) in areaList" 
						       		:key="index"
									:class="areaIndex===index?'active':''"
									@click="changeArea(item,index)">{{item.areaName}}</text>
						  </view>
						  </scroll-view>
			        </view>
		</uni-popup>
		
		
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
	  <uni-popup ref="fish"  type="center">
		  <view class="fish">
		  	<input type="text" placeholder="填写想添加的鱼种" v-model="newFish" />
			<view @click="addFish"><text>确定</text></view>
		  </view>
	  </uni-popup>
	</view>
</template>

<script>
	import headers from '@/components/header.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{headers,uniPopup,wPicker},
		data() {
			return {
				token:'',
				fishid:'',
				fishground_id:'',
				obj:{
					token:'',
					fishground_id:'',
					charging_rules:'',
					ground_type:'',
					// is_setin:'',
					setin_userid:'',
					identity_id:'1',
					city_id:'2',
					area_id:'3',
					ground_name:'',
					ground_images:'',
					ground_intro:'',
					fish_species:'',
					ground_longitude:'',
					ground_atitude:'',
					ground_status:'',
					area_name:''
				},
				address:'北京市-北京城区-东城区',
				identityName:'北京市',
				cityName:'北京城区',
				areaName:'东城区',
				provinceList:[],
				cityList:[],
				areaList:[],
				selectorVisible:false,
				defaultProps:{
					label:"name",
					value:"id"
				},
				selectorList:[
					{
						name:"黑坑",
						id:"1"
					},{
						name:"农家乐",
						id:"2"
					},
					{
						name:"斤塘",
						id:"3"
					},
					{
						name:"湖库",
						id:"4"
					},
					{
						name:"江河",
						id:"5"
					},
					{
						name:"野塘",
						id:"6"
					},
					{
						name:"路亚",
						id:"7"
					}
				],
				imgList:[],
				uploadImgList:[],
				status:'',
				provinceIndex:0,
				cityIndex:0,
				areaIndex:0,
				fishList:[
					{name:'鲫鱼',flog:false},
					{name:'草鱼',flog:false},
					{name:'黑鱼',flog:false}
				],
				userFishArr:[],
				newFish:''
			};
		},
		mounted() {
			let data = uni.getStorageSync('userinfo');
			// let {user_id} = uni.getStorageSync('userinfo')
			this.token = data.token;
			this.obj.token = data.token;
			this.obj.setin_userid = data.user_id;
			this.getUserInfo();
		},
		onUnload() {
			getApp().globalData.editAddress=null;
		},
		onShow() {
			if(getApp().globalData.editAddress){
				let obj = getApp().globalData.editAddress;
				this.obj.ground_longitude = obj.longitude;
				this.obj.ground_atitude = obj.latitude;
				uni.showToast({icon:'none',title:'已更改为选择得经纬度'});
				// {"latitude":22.631416857791766,"longitude":114.07216681597646} 
			}
			console.log(getApp().globalData.editAddress)
		},
		methods:{
			checkFish(item,index){
				// console.log(item.name);
				// console.log(this.obj.fish_species);
				// console.log(this.obj.fish_species.indexOf(item.name))
				let arr = this.obj.fish_species.split(',');
				let fishArr = JSON.parse(JSON.stringify(this.fishList));
				let bool = this.fishFn(item.name);
				console.log(bool)
				if(bool!==false){
					arr.splice(bool,1);
					console.log(arr)
					let str = arr.join(',');
					this.obj.fish_species = str;
					this.fishList[index].flog = false;
					this.$forceUpdate();
				}else{
					if(this.obj.fish_species===''){
						this.obj.fish_species=item.name;
					}else{
						this.obj.fish_species=this.obj.fish_species+`,${item.name}`;
					}
					this.fishList[index].flog = true;
					this.$forceUpdate();
				}
				
			},//选中某个鱼种
			fishFn(name){
				let arr = this.obj.fish_species.split(',');
				let flog = null;
				console.log(name,arr)
				for (let i = 0;i<arr.length;i++) {
					if(arr[i]===name){
						flog= i;
						break;
					}else{
						flog= false;
					}
				}
				return flog;
			},//循环返回数据
			fishAdd(){
				this.$refs.fish.open();
			},//打开添加鱼种弹窗
			addFish(){
				if(!this.newFish){
					this.$Toast('需要输入具体鱼种');
					return
				}
				let obj = {name:this.newFish,flog:false};
				this.fishList.push(obj);
				this.$refs.fish.close();
			},//确认添加鱼种
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
						let arr =  data.data.data.ground_images.split(',');
						if(data.data.data.ground_status==='1'){
							this.status='开启';
						}else{
							this.status = '关闭';
						}
						let fishArr =  data.data.data.fish_species.split(',');
						this.userFishArr = fishArr;
						let newArr = JSON.parse(JSON.stringify(this.fishList));
						fishArr.forEach((val,ind)=>{
							newArr.forEach((v,i)=>{
								if(val===v.name){
									v.flog = true;
								}
							})
						})
						this.fishList = newArr;
						this.imgList = [];
						arr.forEach((val,ind)=>{
							this.imgList.push(this.baseUrl+val);
						})
						this.uploadImgList = arr;
					}
				}
			},//获取拥有渔场得数据
			async chooseCity() {
				// console.log('已点击')
				//默认获取第一项得数据一级后面得数组
				this.temporaryStr = '';
				let res = await this.getProvince();
				this.provinceList = res;
				let cityData =  await this.getCity(this.provinceList[0].areaId)
				this.cityList = cityData;
				let areaData = await this.getArea(this.cityList[0].areaId);
				this.areaList = areaData;
				this.$refs.popup.open();
				this.provinceIndex = 0;
				this.cityIndex = 0;
				this.areaIndex = 0;
				// 打开默认展示北京得名字和id
				this.obj.identity_id= this.provinceList[0].areaId;
				this.identityName = this.provinceList[0].areaName;
				this.obj.city_id = cityData[0].areaId;
				this.cityName = cityData[0].areaName;
			},//打开地区选择弹窗并初始化数据
			getProvince(){
				return new Promise((resolve, reject) => {
					uni.request({
						method: 'POST',
						url: `${this.baseUrl}/api/Index/IndexArea`,
						data: {},
						header:{
							"Content-Type":"application/x-www-form-urlencoded"
						},
						dataType:'json',
						success(res) {
							if (res.data.code === 1) {
								resolve(res.data.data);
							}
						},
						fail(err) {
							reject(err)
						}
					})
				})
			},
			getCity(id){
				return new Promise((resolve, reject) => {
					uni.request({
						method: 'POST',
						url: `${this.baseUrl}/api/Index/IndexArea`,
						data: {id},
						header:{
							"Content-Type":"application/x-www-form-urlencoded"
						},
						dataType:'json',
						success(res) {
							// console.log(res.data.data)
							if (res.data.code === 1) {
								resolve(res.data.data);
							}
						},
						fail(err) {
							reject(err)
						}
					})
				})
			},
			getArea(id){
				return new Promise((resolve, reject) => {
					uni.request({
						method: 'POST',
						url: `${this.baseUrl}/api/Index/IndexArea`,
						data: {id},
						header:{
							"Content-Type":"application/x-www-form-urlencoded"
						},
						dataType:'json',
						success(res) {
							// console.log(res)
							if (res.data.code === 1) {
								resolve(res.data.data);
							}else if(res.data.code===0){
								reject()
							}
				
						},
						fail(err) {
							reject(err)
						}
					})
				})
			},
			async chooseProvince(item){
				this.obj.identity_id = item.areaId;
				this.identityName = item.areaName;
				this.obj.identityName = item.areaName;
				this.obj.identityname = item.areaName;
				let cityData =  await this.getCity(item.areaId)
				console.log(cityData)
				this.cityList = cityData;
				this.obj.city_id = cityData[0].areaId;
				this.cityName = cityData[0].areaName;
				try{
					let areaData = await this.getArea(this.cityList[0].areaId);
					this.areaList = areaData;
					this.temporaryStr = item.areaName;
					this.cityIndex = 0;
					this.areaIndex = 0;
				}catch(e){
					//TODO handle the exception
					this.areaList = [];
					this.temporaryStr = item.areaName;
					this.cityIndex = 0;
					this.areaIndex = 0;
				}
				
			},
			async changeCity(item){
				this.obj.city_id = item.areaId;
				this.cityName = item.areaName;
				console.log(item)
				try{
					let areaData = await this.getArea(item.areaId);
					this.areaName = areaData[0].areaName;
					this.obj.area_id = areaData[0].areaId;
					this.areaList = areaData;
					this.areaIndex = 0;
				}catch(e){
					//TODO handle the exception
					this.areaName = '';
					this.obj.area_id = '';
					this.areaList = [];
					this.areaIndex = 0;
					let arr = item.center.split(',');
					// this.city = this.temporaryStr;
					this.obj.area_name =  `${this.identityName}${this.cityName}`;
					this.latitude = arr[1];
					this.longitude = arr[0];
					this.$refs.popup.close()
					console.log(this.obj)
				}
				
			},
			async changeArea(item){
				console.log(item)
				this.obj.area_id = item.areaId;
				this.areaName = item.areaName;
				this.obj.area_name =  `${this.identityName}${this.cityName}${this.areaName}`;
				let arr = item.center.split(',');
				this.city = this.temporaryStr;
				this.latitude = arr[1];
				this.longitude = arr[0];
				this.$refs.popup.close();
			},
			selectType(){
				this.selectorVisible = true;
			},//打开钓场类型弹窗
			onConfirm(e){
				// console.log(e)
				this.obj.charging_rules = e.result;
			},//选择类型
		   switchChange(e){
			   e.detail.value?this.obj.ground_status='1':this.obj.ground_status='0';
			   e.detail.value?this.status='开启':this.status='关闭';
			   // console.log(this.obj.ground_status)
		   },
		   chooseAddress(){
			   // uni.navigateTo({
			   // 	url:'./searchMap'
			   // })
			   // return
			   getApp().globalData.editAddress = null;
			   let obj = JSON.stringify({ground_atitude:this.obj.ground_atitude,ground_longitude:this.obj.ground_longitude});
			   console.log(obj)
			   uni.navigateTo({
			   	url:`./editMap?addressObj=${obj}`
			   })
		   },
		   Delete(index){
			   uni.showModal({
			   	content:'确定删除该图片吗？',
				success: (status) => {
					if(status.confirm){
						this.imgList.splice(index,1);
						this.uploadImgList.splice(index,1);
						// console.log(this.imgList)
					}
				}
			   })
		   },//删除图片数组得某一项
		   addImg(){
			   uni.chooseImage({
				   count:1,
				   sizeType:['compressed'],
				   sourceType:['album'],
				   success: async(res) => {
					  let data = await this.updateImg(res.tempFilePaths[0]);
					  if(data){
						  this.imgList.push(`${this.baseUrl}${data}`);
						  this.uploadImgList.push(data);
					  }
				   	// console.log(thi)
				   }
			   })
		   },//上传图片
		   updateImg(url){
			   return new Promise((resolve,reject)=>{
				   uni.uploadFile({
				       url: `${this.baseUrl}/api/common/upload`,
				       filePath: url,
				       name: 'file',
				       formData: {
				           'token': this.token
				       },
				       success: (uploadFileRes) => {
				   		// console.log(uploadFileRes)
				   		let data = JSON.parse(uploadFileRes.data);
				   		// console.log(data)
				   		this.$Toast(data.msg);
				   		if(data.code===1){
				   			resolve(data.data.url)
				   		}
				           // console.log(data.data);
				       },
					   fail:(err)=>{
						   reject(err);
					   }
				   });
			   })
		   },//上传接口
		   async rightClick(){
			  this.obj.ground_images = this.uploadImgList.join(',');
			  this.obj.token = this.token;
			  this.obj.fishground_id = this.fishground_id;
			  let res = await this.$Post('/api/Ground/EditGround',this.obj);
			  this.$Toast(res.data.msg);
		   }
		}
	}
</script>

<style lang="scss" scoped>
	.fish{
		width: 700rpx;
		margin: 0 auto;
		background: white;
		box-sizing: border-box;
		padding: 40rpx 20rpx;
		border-radius: 20rpx;
		input{
			width: 90%;
			margin: 40rpx auto;
			border: 1px solid #333333;
			border-radius: 15rpx;
			text-indent: 15rpx;
			padding: 15rpx 0;
		}
		view{
			width: 70%;
			margin: 0 auto;
			background: #007AFF;
			text-align: center;
			font-size: 26rpx;
			color: white;
			text-align: center;
			border-radius: 15rpx;
			box-sizing: border-box;
			padding: 15rpx 0;
		}
	}
	.fish_acitve{
		background: #95B1C1;
		border: none !important;
		color: white !important;
	}
	.active{
		color: red;
	}
	.box{
		width: 750rpx;
		background-color: white;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		/* justify-content: space-between; */
		padding: 30rpx 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	.scroll-Y{
		width: 250rpx;
		height: 300px;
	}
	.province{
		width: 250rpx;
		/* height: 300rpx; */
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		align-items: center;
		margin-right: 0rpx;
		text-align: center;
	}
	.province_text{
		margin-bottom: 40rpx;
		font-size: 30rpx;
	}
	.city{
		width: 250rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		align-items: center;
		margin-right: 0rpx;
		text-align: center;
	}
	.city_text{
		margin-bottom: 40rpx;
		font-size: 30rpx;
	}
	.popup {
		width: 710rpx;
		background-color: white;
		position: fixed;
		bottom: 20rpx;
		margin-left: 20rpx;
		border-radius: 15rpx;
		padding: 20rpx;
	}
	.form{
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 20rpx;
		.inp{
			font-size: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 20rpx;
			text{
				margin-right: 15rpx;
				width: 30%;
			}
			input{
				width: 70%;
				border: 1px solid #808080;
				border-radius: 8rpx;
				padding: 15rpx 0;
				text-indent: 10rpx;
			}
			textarea{
				width: 70%;
				height: 150rpx;
				border: 1px solid #808080;
				border-radius: 8rpx;
				padding: 15rpx 0;
				text-indent: 10rpx;
			}
			view{
				width: 70%;
				overflow-x: scroll;
				white-space: nowrap;
			}
			.address{
				width: 28%;
				display: flex;
				flex-direction: row;
				align-items: center;
				text{
					width: 60%;
				}
				image{
					width: 40rpx;
				}
			}
			
			.img_list{
				width: 70%;
				overflow-x: scroll;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-items: center;
				image{
					width: 80rpx;
					margin-right: 10rpx;
				}
				.item{
					width: 100rpx;
					position: relative;
					display: flex;
					flex-direction: row;
					align-items: center;
					.delete{
						width: 25rpx;
						// height: 60rpx;
						position: absolute;
						top: 0;
						right: -10rpx;
					}
					image{
						width: 100rpx;
						margin-right: 15rpx;
					}
				}
			}
		}
		.plda{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.map{
				width: 68%;
				border: 1px solid #808080;
				padding: 15rpx 0;
				border-radius: 10rpx;
				text-indent: 15rpx;
			}
		}
		.image{
			width: 100%;
			display: flex;
			flex-direction: column;
			.image_title{
				font-size: 27rpx;
			}
			.img_list{
				width: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				flex-wrap: wrap;
				box-sizing: border-box;
				padding: 20rpx 15rpx;
				.item{
					width: 30%;
					display: flex;
					flex-direction: row;
					align-items: center;
					// flex-wrap: wrap;
					position: relative;
					margin-right: 20rpx;
					image{
						width: 100%;
						// height: 150rpx;
					}
					.delete{
						width: 30rpx;
						// height: 60rpx;
						position: absolute;
						top: 0;
						right: -10rpx;
					}
				}
				image{
					width: 30%;
				}
			}
		}
	    .fishList{
			width: 95%;
			margin: 0 auto;
			padding: 10rpx 20rpx;
			display: flex;
			// justify-content: center;
			flex-wrap: wrap;
			align-items: center;
			align-self: flex-start;
			.fish_item{
				width: 140rpx;
				border: 1px solid #95B1C1;
				border-radius: 8rpx;
				margin: 10rpx 10rpx;
				text-align: center;
				padding: 10rpx 0;
				font-size: 24rpx;
				color: #333333;
			}
			.fish_add{
				width: 150rpx;
				border: 1px solid #FF7B33;
				border-radius: 8rpx;
				margin: 10rpx 10rpx;
				text-align: center;
				padding: 10rpx 0;
				font-size: 24rpx;
				color: #FF7B33;
			}
		}
	}
</style>
