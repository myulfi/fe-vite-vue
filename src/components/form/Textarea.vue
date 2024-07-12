<script setup>
const props = defineProps({
    label: String
    , name: String
    , rows: [Number, String]
    , type: String
    , value: String
    , onChange: Function
    , placeholder: String
    , className: String
    , error: String
})
</script>

<template>
    <div :class="'form-group mb-3' + className">
        <label class="form-label fw-bold">{{ label }}</label>
        <textarea className="form-control" :name="name" :rows="rows" :value="value" @change="onChange($event)"
            :placeholder="placeholder"></textarea>
        <small v-if="error" class="text-danger mt-1 px-1">{{ error }}</small>
    </div>
</template>