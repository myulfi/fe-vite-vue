<script setup>
import Filter from './Filter.vue';

const props = defineProps({
    label: String
    , icon: { type: String, required: false, default: "bi-search" }
    , name: String
    , min: { type: Number, required: false, default: 0 }
    , max: { type: Number, required: false, default: 100 }
    , value: Number
    , onChange: Function
    , class: { type: String, required: false, default: "col-xs-12" }
    , delay: { type: Number, required: false, default: 1 }
})
</script>

<template>
    <Filter :label="label + ' (' + value + ')'" :icon="icon" :class="props.class" :delay="delay">
        <input class="my-1 form-range" :name="name" type="range" :min="min" :max="max" :value="value"
            @change="onChange($event)" />
    </Filter>
</template>