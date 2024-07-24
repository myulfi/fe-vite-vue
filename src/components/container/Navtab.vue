<script setup>
const props = defineProps({
    tabArray: { type: Array, required: false, default: [] }
    , initialActiveTab: { type: Number, required: false, default: 0 }
})
</script>

<template>
    <div>
        <ul class="nav nav-tabs" role="presentation">
            <li v-for="(tab, index) in tabArray" :key="index" class="nav-item">
                <a :class="'nav-link ' + (index === initialActiveTab ? 'active' : null)" data-bs-toggle="tab"
                    :href="'#tab_menu' + index">{{ tab.label }}</a>
            </li>
        </ul>
        <div class="tab-content mt-4">
            <div v-for="(tab, index) in tabArray" :key="index"
                :class="'tab-pane container ' + (index === initialActiveTab ? 'active' : 'fade')"
                :id="'tab_menu' + index">{{ tab.component() }}
            </div>
        </div>
    </div>
</template>