<script setup>

//import ref and onMounted
import { ref, onMounted } from 'vue';
import Table from '../../components/Table.vue';

//import api
import api from '../../api';

//define state
const exampleTemplateList = ref([]);
const exampleTemplateDataTotalTable = ref(0);

const getExampleTemplate = async (page = 1, length = 5, search = "", orderColumn = 1, orderDir = "asc") => {
    await api.get(`/test/example-template.json?start=${(page - 1) * length}&length=${length}&search%5Bvalue%5D=${search}`)
        .then(response => {
            const json = response.data;
            exampleTemplateList.value = json.data;
            exampleTemplateDataTotalTable.value = json.recordsTotal;
        });
}

onMounted(() => {
    getExampleTemplate();
});

const deleteExampleTemplate = async (id) => {
    await api.delete(
        `/test/${id}/example-template.json`
        , null
        , { headers: { 'Content-Type': 'application/json' } }
    )
        .then(function (json) {
            if (json.data.status === "success") {
                getExampleTemplate();
            }
        });
}

</script>

<template>
    <div class="container mt-4 mb-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <Table labelNewButton="New" :data="exampleTemplateList"
                            :dataTotal="exampleTemplateDataTotalTable" :onRender="getExampleTemplate">
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>