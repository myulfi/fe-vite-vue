import { createApp } from 'vue'

//import config router
import router from './router'

//import App component
import App from './App.vue'

//initialize vue
const app = createApp(App)

//use router on vue
app.use(router)

//mount root app element
app.mount('#app')