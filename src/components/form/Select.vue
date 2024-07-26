<script setup>
const props = defineProps({
    label: String
    , name: String
    , value: [String, Number]
    , map: Array
    , onChange: Function
    , placeholder: String
    , class: String
    , error: String
})
</script>

<template>
    <div :class="'form-group mb-3 ' + props.class">
        <label class="form-label fw-bold">{{ label }}</label>
        <select class="form-select" :name="name" :value="value" @change="onChange($event)">
            <option value="">{{ placeholder }}</option>
            <option v-for="(object, index) in map" :key="index" :value="object.key">{{ object.value }}</option>
        </select>
        <small v-if="error" class="text-danger mt-1 px-1">{{ error }}</small>
    </div>
</template>