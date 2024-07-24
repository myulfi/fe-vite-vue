<script setup>
import Filter from './Filter.vue';

const props = defineProps({
    label: String
    , icon: { type: String, required: false, default: "bi-search" }
    , name: String
    , value: String
    , onChange: Function
    , placeholder: String
    , class: { type: String, required: false, default: "col-xs-12" }
    , delay: { type: Number, required: false, default: 1 }
})
</script>

<template>
    <Filter :label="label" :icon="icon" :class="class" :delay="delay">
        <input class="form-control" :name="name" type="date" :value="value" @change="onChange($event)"
            :placeholder="placeholder" />
    </Filter>
</template>