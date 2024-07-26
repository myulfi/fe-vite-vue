<script setup>
import Filter from './Filter.vue';

const props = defineProps({
    label: String
    , icon: { type: String, required: false, default: "bi-search" }
    , name: String
    , value: String
    , map: Array
    , onChange: Function
    , placeholder: String
    , class: { type: String, required: false, default: "col-xs-12" }
    , delay: { type: Number, required: false, default: 1 }
})
</script>

<template>
    <Filter :label="label" :icon="icon" :class="props.class" :delay="delay">
        <select class="form-select" :name="name" :value="value" @change="onChange($event)">
            <option value="">{{ placeholder }}</option>
            <option v-for="(object, index) in map" :key="index" :value="object.key">{{ object.value }}
            </option>
        </select>
    </Filter>
</template>