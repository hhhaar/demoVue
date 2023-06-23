import { createApp } from 'vue'
import App from '@/components/main/main.vue'
import routers from '@/routes/index'
import axios from 'axios'
import qs from "qs";

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params);
}

const app = createApp(App);
app.config.globalProperties.$axios = axios;

app.use(routers);
app.mount('#app')
