import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const id = localStorage.getItem('id');

if (token) {
  store.commit('setBearer', token);
  store.commit('setConnected', true);
  store.commit('setId', id);
  store.commit('setRole', role);
}
app.use(vue3GoogleLogin, {
  clientId: '<YOUR_CLIENT_ID>.apps.googleusercontent.com',
});

app.use(router);
app.use(store);
app.mount('#app')
