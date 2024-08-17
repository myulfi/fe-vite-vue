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
        <div>
            <template v-for="(object, index) in map" :key="index">
                <input type="radio" class="btn-check" :name="name" :value="object.key" :id="name + '_' + object.key"
                    :checked="parseInt(value) === object.key" @change="onChange($event)" autoComplete="off" />
                <label class="btn btn-outline-secondary me-1" :for="name + '_' + object.key">{{ object.value }}</label>
            </template>
        </div>
        <small v-if="error" class="text-danger mt-1 px-1">{{ error }}</small>
    </div>
</template>