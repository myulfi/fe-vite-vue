<script setup>

//import ref and onMounted
import { ref, onMounted } from 'vue';
import Table from '../../components/Table.vue';

//import api
import api from '../../api';

//define state
const exampleTemplateArray = ref([]);
const exampleTemplateDataTotalTable = ref(0);

const exampleTemplateColumns = [
    {
        data: "name"
        , name: "Name"
        , class: "min-mobile text-nowrap"
    }
    , {
        data: "description"
        , name: "Description"
        , class: "min-tablet text-nowrap"
    }
    , {
        data: "value"
        , name: "Value"
        , class: "min-tablet text-nowrap"
        , width: 10
    }
    , {
        data: "date"
        , name: "Date"
        , class: "min-desktop text-nowrap"
        , width: 10
    }
    , {
        data: "createdBy"
        , name: "Created By"
        , class: "min-desktop text-nowrap"
        , width: 10
    }
    , {
        data: "createdDate"
        , name: "Created Date"
        , class: "min-desktop text-nowrap"
        , width: 10
    }
    , {
        data: "id"
        , name: "Option"
        , class: "text-center"
        , render: function (data) {
            // return (
            //     <>
            //         <Button
            //             label="Edit"
            //             onClick={() => entryExampleTemplate(data)}
            //             className="btn-primary"
            //             icon="bi-pencil"
            //             loadingFlag={exampleTemplateOptionColumnTable[data]?.updatedButtonFlag}
            //         />
            //         <Button
            //             label="Delete"
            //             onClick={() => confirmDeleteExampleTemplate(data)}
            //             className="btn-danger"
            //             icon="bi-trash"
            //             loadingFlag={exampleTemplateOptionColumnTable[data]?.deletedButtonFlag}
            //         />
            //     </>
            // )
        }
    }
]

const getExampleTemplate = async (page = 1, length = 5, search = "", orderColumn = 1, orderDir = "asc") => {
    await api.get(`/test/example-template.json?start=${(page - 1) * length}&length=${length}&search%5Bvalue%5D=${search}`)
        .then(response => {
            const json = response.data;
            exampleTemplateArray.value = json.data;
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
                        <Table labelNewButton="New" :dataArray="exampleTemplateArray" :columns="exampleTemplateColumns"
                            :dataTotal="exampleTemplateDataTotalTable" :onRender="getExampleTemplate">
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>