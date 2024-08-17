<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Dropdown from './Dropdown.vue';
import { CommonConstants } from '../constants/CommonConstants.vue';

const props = defineProps({
    labelNewButton: String
    , onNewButtonClick: { type: Function, required: false, default: () => { alert("Please define your function!") } }
    , bulkOptionLoadingFlag: { type: Boolean, required: false, default: false }
    , bulkOptionArray: Array
    , dataArray: { type: Array, required: false, default: [] }
    , columns: Array
    , order: { type: Array, required: false, default: [] }
    , checkBoxArray: Array
    , onCheckBox: { type: Function, required: false, default: () => { alert("Please define your function!") } }
    , dataTotal: { type: Number, required: false, default: 0 }
    , initialSizePage: { type: Number, required: false, default: 10 }
    , limitPaginationButton: { type: Number, required: false, default: 7 }
    , filter: Object
    , onRender: Function
    , loadingFlag: { type: Boolean, required: false, default: false }
});

const checkBoxStateArray = computed(() => {
    return props.dataArray.map(function (obj) {
        return obj['id'];
    })
});

const columnShow = props.columns.filter(column => { return column.minDevice !== CommonConstants.NONE; });
const columnHide = props.columns.filter(column => { return column.minDevice !== undefined && column.minDevice !== CommonConstants.MOBILE; });
const columnAlwaysHide = props.columns.filter(column => { return column.minDevice === CommonConstants.NONE; });

const search = ref("");
const currentOrder = ref(props.order);
const orderColumn = ref([]);
const detailRow = ref(props.dataArray.map(() => false));

const currentPage = ref(1);
const sizePage = ref(props.initialSizePage);

const pages = computed(() => {
    return Array.from({ length: Math.ceil(props.dataTotal / sizePage.value) }, (_, i) => i + 1);
});
const lengthArray = [5, 10, 25, 50, 100];

onMounted(() => {
    var array = new Array();
    for (var i = 0; i < columnShow.length; i++) {
        array.push(columnShow[i].orderable ? "bi-three-dots-vertical" : null);
    }

    if (props.order.length > 0) {
        for (var i = 0; i < props.order.length; i++) {
            if ("asc" === props.order[i][1]) {
                array[props.order[i][0]] = "bi-sort-down-alt";
                currentOrder.value = [columnShow[props.order[i][0]]["data"], "asc"];
                props.onRender(currentPage.value, sizePage.value, search.value, [columnShow[props.order[i][0]]["data"], "asc"]);
                break;
            } else if ("desc" === props.order[i][1]) {
                array[props.order[i][0]] = "bi-sort-down";
                currentOrder.value = [columnShow[props.order[i][0]]["data"], "desc"];
                props.onRender(currentPage.value, sizePage.value, search.value, [columnShow[props.order[i][0]]["data"], "desc"]);
                break;
            }
        }
    } else {
        detailRow.value = props.dataArray.map(() => false);
        props.onRender(currentPage.value, sizePage.value, search.value);
    }
    orderColumn.value = array;
})

watch(() => props.filter, () => {
    onPageChange(1, sizePage.value, search.value);
});

function onPageChange(page, length, search) {
    currentPage.value = page;
    sizePage.value = length;
    detailRow.value = props.dataArray.map(() => false);
    props.onRender(page, length, search, currentOrder.value);
}

const onOrderChange = (data, index) => {
    var array = new Array();
    for (var i = 0; i < orderColumn.value.length; i++) {
        if (index === i) {
            detailRow.value = props.dataArray.map(() => false);
            if (orderColumn.value[i] === "bi-sort-down") {
                array.push("bi-sort-down-alt");
                currentOrder.value = [data, "asc"];
                props.onRender(currentPage.value, sizePage.value, search.value, [data, "asc"]);
            } else {
                array.push("bi-sort-down");
                currentOrder.value = [data, "desc"];
                props.onRender(currentPage.value, sizePage.value, search.value, [data, "desc"]);
            }
        } else {
            array.push(orderColumn.value[i] !== null ? "bi-three-dots-vertical" : null);
        }
    }
    orderColumn.value = array;
};

const onCheckBoxAll = () => {
    const currentCheckBoxStateArray = checkBoxStateArray.value.length;
    const currentCheckBoxArray = props.dataArray.filter(datum => props.checkBoxArray.includes(datum.id)).length;
    props.dataArray.forEach(function (dataArray) {
        if (currentCheckBoxStateArray !== currentCheckBoxArray) {
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

const showDetail = (index) => {
    detailRow.value = { ...detailRow.value, [index]: !detailRow.value[index] };
}

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
                    @click="onNewButtonClick(false)">
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
        <div v-if="loadingFlag" class="spinner-border text-primary position-absolute top-50 start-50"></div>
        <table class="table table-bordered table-hover my-1 align-middle">
            <thead class="border border-bottom-0">
                <tr>
                    <th v-if="checkBoxArray !== undefined" scope="col" class="text-center">
                        <span
                            :class="props.dataArray.filter(datum => checkBoxArray.includes(datum.id)).length === 0 ? 'bi-square' : props.dataArray.filter(datum => checkBoxArray.includes(datum.id)).length === checkBoxStateArray.length ? 'bi-plus-square-fill' : 'bi-dash-square-fill'"
                            role="button" @click="onCheckBoxAll"></span>
                    </th>
                    <th v-for="(column, index) in columnShow" :key="index" scope="col"
                        :class="column.class + ' ' + (column.minDevice == CommonConstants.DESKTOP ? 'min-desktop' : column.minDevice == CommonConstants.TABLET ? 'min-tablet' : '')"
                        :width="column.width != null ? column.width + '%' : null">
                        {{ column.name }}
                        <i v-if="orderColumn[index] != null" :class="'float-end ' + orderColumn[index]" role="button"
                            @click="onOrderChange(column.data, index)"></i>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="dataArray.length === 0">
                    <td :colspan="columnShow.length + (checkBoxArray != undefined ? 1 : 0)" class="text-center">
                        Data not founded.
                    </td>
                </tr>
                <template v-else v-for="(datum, indexRow) in dataArray" :key="indexRow">
                    <tr>
                        <td v-if="checkBoxArray != undefined" class="text-center">
                            <span :class="checkBoxArray.indexOf(datum.id) >= 0 ? 'bi-check-square-fill' : 'bi-square'"
                                role="button" @click="onCheckBoxSingle(datum.id)"></span>
                        </td>
                        <td v-for="(column, index) in columnShow" :key="index"
                            :class="column.class + ' ' + (column.minDevice == CommonConstants.DESKTOP ? 'min-desktop' : column.minDevice == CommonConstants.TABLET ? 'min-tablet' : '')">
                            <span v-if="index == 0"
                                :class="(detailRow[indexRow] ? 'bi-dash-circle-fill' : 'bi-plus-circle-fill') + ' text-primary me-2 ' + (columnAlwaysHide.length === 0 ? 'max-desktop' : null)"
                                role="button" @click="showDetail(indexRow)"></span>
                            <button v-if="typeof column.render === 'function'"
                                v-for="(object, index) in column.render(datum[column.data], datum)" :key="index"
                                :class="'btn btn-sm ' + object.class + ' rounded-sm shadow border-0 m-1'"
                                :disabled="object.loadingFlag" @click="object.onClick">
                                <span :class="object.loadingFlag ? 'spinner-grow spinner-grow-sm mx-2' : null"
                                    role="status" aria-hidden="true"></span>
                                <span :class="object.icon">&nbsp;{{ object.label }}</span>
                            </button>
                            <template v-else>
                                {{ datum[column.data] }}
                            </template>
                        </td>
                    </tr>
                    <tr v-if="columnHide.length > 0 && detailRow[indexRow]"
                        :class="columnAlwaysHide.length === 0 ? 'max-desktop' : null">
                        <td :colSpan="columnShow.length + (checkBoxArray != undefined ? 1 : 0)">
                            <div v-for="(column, index) in columnHide" :key="index"
                                :class="'border-bottom mx-2 px-2 py-2 ' + (column.minDevice == CommonConstants.TABLET ? 'max-tablet' : column.minDevice == CommonConstants.DESKTOP ? 'max-desktop' : '')">
                                <label class="fw-bold me-2">{{ column.name }}</label>
                                {{ typeof column.render === 'function' ? column.render(datum[column.data]) :
                                    datum[column.data] }}
                            </div>
                        </td>
                    </tr>
                </template>
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

<style>
@media (max-width: 1240px) {
    .min-tv {
        display: none;
    }
}

@media (max-width: 1024px) {
    .min-desktop {
        display: none;
    }
}

@media (max-width: 768px) {
    .min-tablet {
        display: none;
    }
}

@media (min-width: 1024px) {
    .max-desktop {
        display: none;
    }
}

@media (min-width: 768px) {
    .max-tablet {
        display: none;
    }
}
</style>
