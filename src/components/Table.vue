<script setup>
import { computed, ref } from 'vue'
import Dropdown from './Dropdown.vue';

const props = defineProps({
    labelNewButton: String
    , onNewButtonClick: { type: Function, required: false, default: () => { alert("Please define your function!") } }
    , bulkOptionLoadingFlag: { type: Boolean, required: false, default: false }
    , bulkOptionArray: Array
    , dataArray: { type: Array, required: false, default: [] }
    , columns: Array
    , checkBoxArray: Array
    , onCheckBox: { type: Function, required: false, default: () => { alert("Please define your function!") } }
    , dataTotal: { type: Number, required: false, default: 0 }
    , limitPaginationButton: { type: Number, required: false, default: 7 }
    , onRender: Function
});

const checkBoxStateArray = computed(() => {
    return props.dataArray.map(function (obj) {
        return obj['id'];
    })
});

const search = ref("");
const currentPage = ref(1);
const sizePage = ref(5);

const pages = computed(() => {
    return Array.from({ length: Math.ceil(props.dataTotal / sizePage.value) }, (_, i) => i + 1);
});
const lengthArray = [5, 10, 25, 50, 100];

function onPageChange(page, length, search) {
    currentPage.value = page;
    sizePage.value = length;
    props.onRender(page, length, search);
}

const onCheckBoxAll = event => {
    props.dataArray.forEach(function (dataArray) {
        if (event.target.checked) {
            if (props.checkBoxArray.includes(dataArray.id) === false) {
                props.checkBoxArray.push(dataArray.id);
            }
        } else {
            if (props.checkBoxArray.includes(dataArray.id)) {
                props.checkBoxArray.splice(props.checkBoxArray.indexOf(dataArray.id), 1)
            }
        }
    });

    props.onCheckBox(props.checkBoxArray);
};

const onCheckBoxSingle = (id) => {
    if (props.checkBoxArray.includes(id)) {
        props.checkBoxArray.splice(props.checkBoxArray.indexOf(id), 1)
    } else {
        props.checkBoxArray.push(id);
    }

    props.onCheckBox(props.checkBoxArray);
};

const paginationRange = (len, start) => {
    var end;

    if (start === undefined) {
        start = 1;
        end = len;
    } else {
        end = start;
        start = len;
    }

    var out = [];
    for (var i = start; i <= end; i++) { out.push(i); }
    return out;
}

const paginationButton = (currentPage, pageAmount, limitButton) => {
    const halfLimitButon = Math.floor(limitButton / 2);
    var buttonArray;
    if (pageAmount <= limitButton) {
        buttonArray = paginationRange(1, pageAmount);
    } else if (currentPage <= halfLimitButon) {
        buttonArray = paginationRange(1, limitButton);
        buttonArray[limitButton - 2] = "...";
        buttonArray[limitButton - 1] = pageAmount;
    } else if (currentPage >= pageAmount - halfLimitButon) {
        buttonArray = paginationRange(pageAmount - limitButton + 1, pageAmount);
        buttonArray[0] = 1;
        buttonArray[1] = "...";
    } else {
        buttonArray = paginationRange(currentPage - halfLimitButon, currentPage + halfLimitButon);
        buttonArray[0] = 1;
        buttonArray[1] = "...";
        buttonArray[limitButton - 2] = "...";
        buttonArray[limitButton - 1] = pageAmount;
    }

    return buttonArray;
}
</script>

<template>
    <div>
        <div class="clearfix">
            <div v-if="labelNewButton !== undefined" class="float-sm-start d-grid d-sm-flex mb-2">
                <button class="btn btn-md btn-primary rounded border-0 shadow-sm" type="button"
                    @click="onNewButtonClick()">
                    <span class="bi-plus-circle">&nbsp;{{ labelNewButton }}</span>
                </button>
            </div>
            <div v-if="bulkOptionArray !== undefined" class="float-sm-end d-grid d-sm-flex mb-2">
                <div class="btn-group">
                    <button class="btn btn-outline-dark shadow-sm dropdown-toggle" :disabled="bulkOptionLoadingFlag"
                        data-bs-toggle="dropdown">
                        <span :class="bulkOptionLoadingFlag ? 'spinner-border spinner-border-sm mx-2' : null"
                            role="status" aria-hidden="true"></span>
                        <span class="bi-stack">&nbsp;{{ checkBoxArray?.length > 0 ? '(' + checkBoxArray?.length + ')' :
                            null }}Bulk Option</span>
                    </button>
                    <div class="dropdown-menu">
                        <Dropdown v-for="(bulkOption, index) in bulkOptionArray" :key="index" :label="bulkOption.label"
                            :icon="bulkOption.icon" :onClick="bulkOption.onClick"></Dropdown>
                    </div>
                </div>
            </div>
        </div>
        <div class="clearfix">
            <div class="float-sm-start mb-2">Show&nbsp;<select class="p-1" v-model="sizePage"
                    @change="onPageChange(1, $event.target.value, search)">
                    <option v-for="(length, index) in lengthArray" :key="index" :value="length">{{ length }}</option>
                </select>&nbsp;entires
            </div>
            <div class="float-sm-end d-grid d-sm-flex mb-2">
                <input autoFocus type="text" v-model="search" placeholder="Search" class="form-control form-control-sm"
                    @keydown.enter="onPageChange(1, sizePage, search)" />
            </div>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table table-bordered table-hover my-1 align-middle">
            <thead class="border border-bottom-0">
                <tr>
                    <th v-if="checkBoxArray !== undefined" scope="col" class="text-center">
                        <input type="checkbox" id="checkall"
                            :checked="checkBoxStateArray.length > 0 && checkBoxStateArray.every(id => new Set(checkBoxArray).has(id))"
                            @change="onCheckBoxAll" />
                    </th>
                    <th v-for="(column, index) in columns" :key="index" scope="col" :class="column.class"
                        :width="column.width + '%'">{{ column.name }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="dataArray.length === 0">
                    <td :colspan="columns.length + (checkBoxArray != undefined ? 1 : 0)" class="text-center">
                        Data not founded.
                    </td>
                </tr>
                <tr v-else v-for="(datum, index) in dataArray" :key="index">
                    <td v-if="checkBoxArray != undefined" class="text-center">
                        <input type="checkbox" :checked="checkBoxArray.indexOf(datum.id) >= 0"
                            @change="onCheckBoxSingle(datum.id)" />
                    </td>
                    <td v-for="(column, index) in columns" :key="index" :class="column.class">
                        <div v-if="typeof column.render === 'function'">
                            <button v-for="(object, index) in column.render(datum[column.data])" :key="index"
                                :class="'btn btn-sm ' + object.class + ' rounded-sm shadow border-0 m-1'"
                                :disabled="object.loadingFlag" @click="object.onClick">
                                <span :class="object.loadingFlag ? 'spinner-grow spinner-grow-sm mx-2' : null"
                                    role="status" aria-hidden="true"></span>
                                <span :class="object.icon">&nbsp;{{ object.label }}</span>
                            </button>
                        </div>
                        <div v-else>
                            {{ datum[column.data] }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="dataTotal > 0">
        <div class="float-sm-start d-grid d-sm-flex mt-2">
            Showing
            {{ ((currentPage - 1) * sizePage + 1) > dataTotal ? "0" : ((currentPage - 1) * sizePage) + 1 }}
            to
            {{ currentPage * sizePage > dataTotal ? dataTotal : currentPage * sizePage }}
            of {{ dataTotal }} entries
        </div>
        <div class="float-sm-end d-grid d-sm-flex mt-2">
            <ul v-if="pages.length > 1" class="pagination">
                <li class="page-item d-none d-sm-block">
                    <a v-if="currentPage === 1" class="page-link disabled">Previous</a>
                    <a v-else class="page-link" @click="onPageChange(currentPage - 1, sizePage, search)" role="button">
                        Previous
                    </a>
                </li>
                <li v-for="(page, index) in paginationButton(currentPage, pages.length, limitPaginationButton)"
                    :key="index" :class="page === currentPage ? 'page-item active' : 'page-item'">
                    <a v-if="page === currentPage || page === '...'" class="page-link">{{ page }}</a>
                    <a v-else class="page-link" @click="onPageChange(page, sizePage, search)" role="button">
                        {{ page }}
                    </a>
                </li>
                <li class="page-item d-none d-sm-block">
                    <a v-if="currentPage === pages.length" class="page-link disabled">Next</a>
                    <a v-else class="page-link" @click="onPageChange(currentPage + 1, sizePage, search)" role="button">
                        Next
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
