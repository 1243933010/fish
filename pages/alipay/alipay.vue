<template>
	<view>
		<web-view :src="'http://47.95.39.75:9706/addons/epay/index/Payordersn?ordersn='+ordersn+'&type=alipay'"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ordersn:''
			};
		},
		onLoad(e) {
			this.ordersn = e.order;
		}
	}
</script>

<style lang="scss">

</style>
