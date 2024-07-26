<script setup>
const props = defineProps({
    label: String
    , name: String
    , type: String
    , value: [String, Number]
    , onChange: Function
    , placeholder: String
    , class: String
    , error: String
})
</script>

<template>
    <div :class="'form-group mb-3 ' + props.class + ''">
        <label class="form-label fw-bold">{{ label }}</label>
        <input class="form-control" :name="name" :type="type" :value="value" @change="onChange($event)"
            :placeholder="placeholder" />
        <small v-if="error" class="text-danger mt-1 px-1">{{ error }}</small>
    </div>
</template>