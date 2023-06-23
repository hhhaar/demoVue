<template>
	<!--Layout-->
	<top/>
	<left @click-event="goPage"/>
	<contents/>
</template>

<script scope>
import { defineComponent } from 'vue';
import top from '@/components/layout/top.vue';
import left from '@/components/layout/left.vue';
import contents from '@/components/layout/contents.vue';
import $ from 'jquery';

export default defineComponent({
	components: {
    	top,left,contents
 	},
	setup() { },
	mounted() { },
	methods: {
		// 페이지 이동
		goPage(_path) {
			this.$router.push(_path);
		}
	}
});
</script>

<style>
@import "@/static/css/w3.css";
@import "@/static/css/googlefont.css";

html,body,h1,h2,h3,h4,h5 {font-family: "Raleway", sans-serif}
html, body {
    height: calc(100vh - 35px);
    margin: 0px;
    line-height:1;
    position: relative;
}
</style>