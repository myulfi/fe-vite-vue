<script setup>
const props = defineProps({
    label: String
    , class: String
    , icon: String
    , loadingFlag: Boolean
    , onClick: Function
})
</script>

<template>
    <button :class="'btn btn-sm ' + props.class + ' rounded-sm shadow border-0 m-1'" :disabled="loadingFlag"
        @click="onClick()">
        <span :class="loadingFlag ? 'spinner-grow spinner-grow-sm mx-2' : null" role="status" aria-hidden="true" />
        <span :class="icon">&nbsp;{{ label }}</span>
    </button>
</template>