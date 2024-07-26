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
        <div class="py-1">
            <div v-for="(object, index) in map" :key="index" class="form-check form-check-inline">
                <input class="form-check-input" :name="name" type="radio" :value="object.key"
                    :checked="parseInt(value) === object.key" @change="onChange($event)" />
                <label class="form-check-label">{{ object.value }}</label>
            </div>
        </div>
        <small v-if="error" class="text-danger mt-1 px-1">{{ error }}</small>
    </div>
</template>