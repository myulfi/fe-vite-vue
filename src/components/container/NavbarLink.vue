<script setup>
const props = defineProps({
    data: { type: Array, required: false, default: [] }
    , level: { type: Number, required: false, default: 0 }
})
</script>

<template>
    <ul :class="level === 0 ? 'navbar-nav me-auto mb-2 mb-lg-0' : 'dropdown-menu'">
        <li v-for="(datum, index) in data" :key="index"
            :class="level < 1 ? ('nav-item ' + (datum.children?.length > 0 ? 'dropdown' : null)) : datum.children?.length > 0 ? 'dropdown-submenu' : null">
            <router-link v-if="datum.children === undefined || datum.children?.length === 0" :to="{ path: datum.path }"
                :class="level === 0 ? 'nav-link' : 'dropdown-item'">
                <i :class="datum.icon"></i>&nbsp;{{ datum.name }}
            </router-link>
            <a v-if="datum.children?.length > 0"
                :class="(level === 0 ? 'nav-link' : 'dropdown-item') + ' dropdown-toggle'"
                :role="level === 0 ? 'button' : null" data-bs-toggle="dropdown" aria-expanded="false">
                <i :class="datum.icon"></i>&nbsp;{{ datum.name }}
            </a>
            <NavbarLink v-if="datum.children?.length > 0" :data="datum.children" :level="level + 1" />
        </li>
    </ul>
</template>

<style>
.dropdown-submenu {
    position: relative;
}

.dropdown-menu>.dropdown-submenu:hover>.dropdown-menu {
    display: block;
}

.dropdown-menu>.dropdown-submenu>.dropdown-menu {
    top: 0;
    left: 100%;
    margin-top: -1px;
}

/* Ensure proper display on mobile */
@media (max-width: 768px) {
    .dropdown-submenu>.dropdown-menu {
        left: 0;
        top: 100%;
        position: static;
    }

    .dropdown-menu>.dropdown-submenu>.dropdown-menu {
        top: 0;
        margin-top: -1px;
        margin-left: 15px;
        margin-right: 15px;
    }
}
</style>