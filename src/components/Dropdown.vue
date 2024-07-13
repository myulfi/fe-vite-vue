<script setup>
const props = defineProps({
    label: { type: String, required: false, default: "Button" }
    , icon: { type: String, required: false, default: "bi-caret-right" }
    , onClick: {
        type: Function, required: false, default: () => { alert("Please define your function!") }
    }
});
</script>

<template>
    <a class="dropdown-item" @click="onClick()" role="button">
        <span :class="icon">&nbsp;{{ label }}</span>
    </a>
</template>