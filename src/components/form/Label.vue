<script setup>
const props = defineProps({
    text: [String]
    , value: [String, Number]
    , class: String
})
</script>

<template>
    <div :class="'form-group mb-3 ' + props.class + ''">
        <label class="form-label fw-bold">{{ text }}</label>
        <label class="col-12">{{ value }}</label>
    </div>
</template>