<script setup>
import { ref } from 'vue';
import logo from '../assets/vue.svg'
import { apiRequest } from '../api';
import { CommonConstants } from '../constants/CommonConstants.vue';

const loginInitial = {
    username: ''
    , password: ''
};

const loginForm = ref(loginInitial);
const loginFormError = ref("");
const loginLoadingFlag = ref(false);

const onLoginFormChange = (e) => {
    const { name, value } = e.target
    loginForm.value = { ...loginForm.value, [name]: value }
    loginFormError.value = null
};

const loginValidate = (data) => {
    let error = null;
    if (!data.username.trim() || data.username.trim().length === 0) error = 'Username is required';
    else if (!data.password.trim() || data.password.trim().length === 0) error = 'Password is required';
    loginFormError.value = error;
    return error == null;
};

const doLogin = async (e) => {
    e.preventDefault()
    if (loginValidate(loginForm.value)) {
        loginLoadingFlag.value = true;

        try {
            const response = await apiRequest(
                CommonConstants.METHOD_IS_POST,
                '/generate-token.json',
                JSON.stringify({
                    username: btoa(unescape(encodeURIComponent(
                        btoa(unescape(encodeURIComponent(
                            btoa(unescape(encodeURIComponent(
                                loginForm.value.username
                            )))
                        )))
                    )))
                    , password: btoa(unescape(encodeURIComponent(
                        btoa(unescape(encodeURIComponent(
                            btoa(unescape(encodeURIComponent(
                                btoa(unescape(encodeURIComponent(
                                    loginForm.value.password
                                )))
                            )))
                        )))
                    )))
                })
            )

            if (response.data.status === "success") {
                localStorage.setItem("accessToken", response.data.data.token);
                window.location.reload(false);
            } else {
                loginFormError.value = response.data.message;
            }
        } catch (error) {
            loginFormError.value = error;
        } finally {
            loginLoadingFlag.value = false;
        }
    }
}
</script>

<template>
    <main class="form-signin text-center">
        <form>
            <img class="mb-4" :src="logo" alt="" width="72" height="57" />
            <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

            <div class="form-floating">
                <input type="username" class="form-control" id="floatingInput" name="username"
                    :value="loginForm.username" :onChange="onLoginFormChange" placeholder=" " />
                <label htmlFor="floatingInput">Username</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" name="password"
                    :value="loginForm.password" :onChange="onLoginFormChange" placeholder=" " />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <button type="submit" class="w-100 btn btn-lg btn-primary" :disabled="loginLoadingFlag"
                @click="(e) => doLogin(e)">
                <span :class="loginLoadingFlag ? 'spinner-grow spinner-grow-sm mx-2' : null" role="status"
                    aria-hidden="true"></span>
                <span class="bi-arrow-right-square">&nbsp;&nbsp;Login</span>
            </button>
            <div v-if="loginFormError" class="form-floating mt-3 text-danger">{{ loginFormError }}</div>
            <p class="mt-5 mb-3 text-muted">&copy; 2024</p>
        </form>
    </main>
</template>

<style>
.form-signin {
    height: 100%;
    width: 100%;
    max-width: 330px;
    /* padding: 15px; */
    margin: auto;
    padding-top: 60px;
    padding-bottom: 60px;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

@media (min-width: 768px) {
    .bd-placeholder-img-lg {
        font-size: 3.5rem;
    }
}
</style>