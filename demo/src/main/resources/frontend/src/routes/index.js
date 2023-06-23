
import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router';
import menuList from "@/common/data/menu"

// let routes = [];
// console.log(1);
// const ml = await menuList.getMenu();
// console.log(ml);

// ml.forEach(e => {
// 	var txt = JSON.stringify(e.URL);

// 	routes.push({
// 			path: e.PATH
// 		, name: e.NAME
// 		, component: () => import(JSON.stringify(txt))
// 	}); 
// });

const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/demo/home.vue')
	},
	{
		path: '/grid01',
		name: 'grid01',
		component: () => import('@/views/demo/grid01.vue')
	},
	{
		path: '/grid02',
		name: 'grid02',
		component: () => import('@/views/demo/grid02.vue')
	},
	{
		path: '/grid03',
		name: 'grid03',
		component: () => import('@/views/demo/grid03.vue')
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes:routes
});
export default router;