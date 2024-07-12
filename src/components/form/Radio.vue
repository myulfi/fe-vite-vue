<script setup>
const props = defineProps({
    label: String
    , name: String
    , value: [String, Number]
    , map: Array
    , onChange: Function
    , placeholder: String
    , className: String
    , error: String
})
</script>

<template>
    <div :class="'form-group mb-3' + className">
        <label class="form-label fw-bold">{{ label }}</label>
        <div v-for="(object, index) in map" :key="index">
            <input :name="name" type="radio" :value="object.key" :checked="parseInt(value) === object.key"
                @change="onChange($event)" />
            &nbsp;{{ object.value }}
        </div>
        <small v-if="error" class="text-danger mt-1 px-1">{{ error }}</small>
    </div>
</template>