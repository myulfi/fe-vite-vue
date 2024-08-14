<script setup>
const props = defineProps({
    data: { type: Array, required: false, default: [] }
    , level: { type: Number, required: false, default: 0 }
})
</script>

<template>
    <ul :class="level === 0 ? 'navbar-nav me-auto mb-2 mb-lg-0' : 'dropdown-menu'">
        <li v-for="(datum, index) in data" :key="index"
            :class="'nav-item ' + (datum.children?.length > 0 ? 'dropdown' : null)">
            <router-link v-if="datum.children?.length === 0" :to="{ path: datum.path }"
                :class="level === 0 ? 'nav-link' : 'dropdown-item'">
                <i :class="datum.icon"></i>&nbsp;{{ datum.name }}
            </router-link>
            <a v-if="datum.children?.length > 0"
                :class="(level === 0 ? 'nav-link' : 'dropdown-item') + ' dropdown-toggle'" id="navbarDropdown"
                :role="level === 0 ? 'button' : null" data-bs-toggle="dropdown" aria-expanded="false">
                <i :class="datum.icon"></i>&nbsp;{{ datum.name }}
            </a>
            <NavbarLink v-if="datum.children?.length > 0" :data="datum.children" :level="level + 1" />
        </li>
    </ul>
</template>