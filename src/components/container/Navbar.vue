<script setup>
import NavbarLink from './NavbarLink.vue';
import { CommonConstants } from '../../constants/CommonConstants.vue';
import { apiRequest } from '../../api';

const props = defineProps({
    data: { type: Array, required: false, default: [] }
})

const doLogout = async (e) => {
    try {
        await apiRequest(CommonConstants.METHOD_IS_POST, '/remove-token.json')
    } catch (error) {

    } finally {
        localStorage.removeItem("accessToken");
        window.location.reload(false);
    }
}
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm border border-top-0">
        <div class="container">
            <router-link :to="{ path: '/' }" class="navbar-brand">
                <span class="bi-umbrella">&nbsp;FE-VITE</span>
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <NavbarLink :data="data" :level="0" />
                <div class="d-flex">
                    <button class="btn btn-outline-dark" type="button" @click="(e) => doLogout(e)">
                        <span class="bi-arrow-right-square">&nbsp;&nbsp;Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<style>
.dropdown-menu .dropdown-menu {
    margin-left: 0;
    margin-right: 0;
}

.dropdown-menu>.dropdown>.dropdown-menu {
    display: none;
    left: 100%;
    top: 0;
    position: absolute;
}

.dropdown-menu>.dropdown:hover>.dropdown-menu {
    display: block;
}
</style>