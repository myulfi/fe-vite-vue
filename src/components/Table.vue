<script setup>
import { ref } from 'vue'

const props = defineProps({
    labelNewButton: String
    , data: Array
    , dataTotal: Number
    , limitPaginationButton: { type: Number, required: false, default: 7 }
    , onRender: Function
})

const search = ref("");
const currentPage = ref(1);
const sizePage = ref(5);

const pagesCount = Math.ceil(dataTotal / sizePage.value);
const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
const lengthArray = [5, 10, 25, 50, 100];

function onPageChange(page, length, search) {
    currentPage.value = page;
    sizePage.value = length;
    props.onRender(page, length, search);
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
            <div class="float-sm-start d-grid d-sm-flex mb-2">
                <button class="btn btn-md btn-primary rounded border-0 shadow-sm" type="button" onClick="">
                    <span class="bi-plus-circle">&nbsp;{{ labelNewButton }}</span>
                </button>
            </div>
        </div>
        <div class="clearfix">
            <div class="float-sm-start mb-2">
                Show&nbsp;
                <select className="p-1" v-model="sizePage"
                    @change="onPageChange(currentPage, $event.target.value, search)">
                    <option v-for="(length, index) in lengthArray" :key="index" :value="length">{{ length }}</option>
                </select>
                &nbsp;entires
            </div>
            <div class="float-sm-end d-grid d-sm-flex mb-2">
                <input type="text" v-model="search" placeholder="Search" className="form-control form-control-sm"
                    @keydown.enter="onPageChange(1, sizePage, search)" />
            </div>
        </div>
    </div>
    <div class="table-responsive">
        <table className="table table-bordered table-hover my-1 align-middle">
            <thead className="border border-bottom-0">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Value</th>
                    <th scope="col">Date</th>
                    <th scope="col">Created By</th>
                    <th scope="col">Created Date</th>
                    <th scope="col" style="width:15%">Option</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length == 0">
                    <td colspan="4" class="text-center">
                        <div class="alert alert-danger mb-0">
                            Data Belum Tersedia!
                        </div>
                    </td>
                </tr>
                <tr v-else v-for="(datum, index) in data" :key="index">
                    <td>{{ datum.name }}</td>
                    <td>{{ datum.description }}</td>
                    <td>{{ datum.value }}</td>
                    <td>{{ datum.date }}</td>
                    <td>{{ datum.createdBy }}</td>
                    <td>{{ datum.createdDate }}</td>
                    <td class="text-center">
                        <!-- <router-link :to="{ name: 'posts.edit', params:{id: post.id} }" class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</router-link> -->
                        <!-- <button @click.prevent="deleteExampleTemplate(exampleTemplate.id)"
                            class="btn btn-sm btn-danger rounded-sm shadow border-0">DELETE</button> -->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div>
        <div class="float-sm-start d-grid d-sm-flex mt-2">
            Showing
            {{ ((currentPage - 1) * sizePage + 1) > dataTotal ? "0" : ((currentPage - 1) * sizePage) + 1 }}
            to
            {{ currentPage * sizePage > dataTotal ? dataTotal : currentPage * sizePage }}
            of {{ dataTotal }} entries
        </div>
        <div class="float-sm-end d-grid d-sm-flex mt-2">
            <ul class="pagination">
                <li class="page-item d-none d-sm-block">
                    <a v-if="currentPage === 1" className="page-link disabled">Previous</a>
                    <a v-else className="page-link" @click="onPageChange(currentPage - 1, sizePage, search)"
                        role="button">
                        Previous
                    </a>
                </li>
                <li v-for="(page, index) in paginationButton(currentPage, pages.length, limitPaginationButton)"
                    :key="index">
                    <a v-if="page === currentPage || page === '...'" className="page-link">{{ page }}</a>
                    <a v-else className="page-link" @click="onPageChange(page, sizePage, search)" role="button">
                        {{ page }}
                    </a>
                </li>
                <li className="page-item d-none d-sm-block">
                    <a v-if="currentPage === pages.length" className="page-link disabled">Next</a>
                    <a v-else className="page-link" @click="onPageChange(currentPage + 1, sizePage, search)"
                        role="button">
                        Next
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
