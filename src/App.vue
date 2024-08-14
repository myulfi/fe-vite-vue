<script setup>
import Navbar from './components/container/Navbar.vue';
import Footer from './components/container/Footer.vue';
import Login from './views/login.vue';
import { ref, watchEffect } from 'vue';
import { apiRequest } from './api';
import { CommonConstants } from './constants/CommonConstants.vue';

const accessToken = ref(localStorage.getItem("accessToken"));
const menuList = ref([]);

const getMenu = async () => {
  if (accessToken.value !== null) {
    try {
      const response = await apiRequest(CommonConstants.METHOD_IS_GET, "/command/menu.json")
      menuList.value = response.data.data;
    } catch (error) { }
  }
}

watchEffect(() => {
  getMenu();
})

document.title = import.meta.env.VITE_APP_TITLE;
</script>
<template>
  <div v-if="accessToken !== null">
    <Navbar :data="menuList" />
    <router-view></router-view>
    <Footer></Footer>
  </div>
  <div v-else>
    <Login />
  </div>
</template>