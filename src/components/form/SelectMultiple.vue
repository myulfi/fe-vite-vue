<script setup>
import { ref } from 'vue';

const props = defineProps({
    label: String
    , name: String
    , valueMultiple: [String, Number]
    , map: Array
    , liveSearch: { type: Boolean, required: false, default: false }
    , actionBox: { type: Boolean, required: false, default: false }
    , dataSize: { type: Number, required: false, default: 5 }
    , onChange: Function
    , placeholder: String
    , class: String
    , error: String
})

const itemList = ref(props.map);
const searchValue = ref("");

const labelValueChange = () => {
    return props.valueMultiple === undefined || props.valueMultiple.length === 0 ? props.placeholder : props.valueMultiple.length > 1 ? `${props.valueMultiple.length} items selected` : props.map.find((object) => { if (object.key === props.valueMultiple[0]) return object }).value;
}

const labelValue = ref(labelValueChange());

const onSelect = (id) => {
    if (props.valueMultiple.includes(id)) {
        props.valueMultiple.splice(props.valueMultiple.indexOf(id), 1)
    } else {
        props.valueMultiple.push(id);
    }

    props.onChange({
        target: {
            name: props.name,
            value: props.valueMultiple,
        }
    })
    labelValue.value = labelValueChange()
}

const onSearchChange = (e) => {
    const { value } = e.target;
    searchValue.value = value
    itemList.value = props.map.filter(item => { if (item.value.toLowerCase().includes(value.toLowerCase())) { return item; } })
}

const selectAll = () => {
    for (let i = 0; i < itemList.value.length; i++) {
        if (props.valueMultiple.includes(itemList.value[i].key) === false) {
            props.valueMultiple.push(itemList.value[i].key)
        }
    }

    props.onChange({
        target: {
            name: props.name,
            value: props.valueMultiple,
        }
    })
    labelValue.value = labelValueChange()
}

const deselectAll = () => {
    for (let i = itemList.value.length - 1; i >= 0; i--) {
        if (props.valueMultiple.includes(itemList.value[i].key)) {
            props.valueMultiple.splice(props.valueMultiple.indexOf(itemList.value[i].key), 1)
        }
    }
    props.onChange({
        target: {
            name: props.name,
            value: props.valueMultiple,
        }
    })
    labelValue.value = labelValueChange()
}
</script>

<template>
    <div :class="'form-group mb-3 ' + props.class">
        <label class="form-label fw-bold">{{ label }}</label>
        <div class="dropdown form-control p-0">
            <button class="btn w-100 text-start" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside"
                aria-expanded="false">
                <div class="d-flex bd-highlight">
                    <div class="flex-grow-1 bd-highlight text-muted">{{ labelValue }}</div>
                    <div class="bd-highlight"><span class="bi-chevron-down"></span></div>
                </div>
            </button>

            <ul class="dropdown-menu">
                <li v-if="liveSearch" class="px-2 py-1">
                    <input class="form-control" :value="searchValue" @keyup="onSearchChange($event)" />
                </li>
                <li v-if="actionBox" class="px-2 py-1">
                    <span class="btn btn-sm btn-outline-secondary col-6" @click="selectAll()">Select&nbsp;All</span>
                    <span class="btn btn-sm btn-outline-secondary col-6" @click="deselectAll()">Deselect&nbsp;All</span>
                </li>
                <li>
                    <!-- @change="onChange($event)" -->
                    <ul class="list-group overflow-auto" :style="{ maxHeight: `${dataSize * 32}px` }">
                        <li v-for="(object, index) in itemList" :key="index" @click="onSelect(object.key)">
                            <div class="dropdown-item d-flex bd-highlight">
                                <div class="flex-grow-1 bd-highlight">{{ object.value }}</div>
                                <div class="bd-highlight">
                                    <span
                                        :class="valueMultiple !== undefined && valueMultiple.indexOf(object.key) >= 0 ? 'bi-check-lg' : null"></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <small v-if="error" class="text-danger mt-1 px-1">{{ error }}</small>
    </div>
</template>