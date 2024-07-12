<script setup>

//import ref and onMounted
import { ref, onMounted } from 'vue';
import Table from '../../components/Table.vue';

//import api
import api from '../../api';
import Modal from '../../components/Modal.vue';
import Input from '../../components/form/Input.vue';
import Textarea from '../../components/form/Textarea.vue';
import Select from '../../components/form/Select.vue';
import Radio from '../../components/form/Radio.vue';


const exampleTemplateInitial = {
    name: ''
    , description: ''
    , value: 0
    , amount: 0
    , date: ''
    , activeFlag: null
};

const exampleTemplateArray = ref([]);
const exampleTemplateDataTotalTable = ref(0);
const exampleTemplateOptionColumnTable = ref([]);
const exampleTemplateEntryModal = ref({
    title: ""
    , submitLabel: ""
    , submitClass: ""
    , submitIcon: ""
    , submitLoadingFlag: false
});

const exampleTemplateForm = ref(exampleTemplateInitial);
const exampleTemplateFormError = ref([]);

const onExampleTemplateFormChange = (e) => {
    const { name, value } = e.target;
    exampleTemplateForm.value = { ...exampleTemplateForm.value, [name]: value };
    console.log(JSON.stringify(exampleTemplateForm.value))
};

const selectValueMap = [{ "key": 1, "value": "Satu" }, { "key": 2, "value": "Dua" }, { "key": 3, "value": "Tiga" }, { "key": 4, "value": "Empat" }];
const yesNoMap = [{ "key": 1, "value": "Yes" }, { "key": 0, "value": "No" }];

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
            return [
                {
                    label: "Edit"
                    , onClick: () => entryExampleTemplate(data)
                    , class: "btn-primary"
                    , icon: "bi-pencil"
                    , loadingFlag: exampleTemplateOptionColumnTable.value[data]?.updatedButtonFlag
                }
                , {
                    label: "Delete"
                    , onClick: () => confirmDeleteExampleTemplate(data)
                    , class: "btn-danger"
                    , icon: "bi-trash"
                    , loadingFlag: exampleTemplateOptionColumnTable.value[data]?.deletedButtonFlag
                }
            ]
        }
    }
];
const exampleTemplateModalButton = [
    {
        label: exampleTemplateEntryModal.submitLabel
        , onClick: () => confirmDeleteExampleTemplate()
        , class: "btn-primary"
        , icon: exampleTemplateEntryModal.submitIcon
        , loadingFlag: exampleTemplateEntryModal.submitLoadingFlag
    }
];
{/* <Button
    label={exampleTemplateEntryModal.submitLabel}
    onClick={() => confirmStoreExampleTemplate()}
    className="btn-primary"
    icon={exampleTemplateEntryModal.submitIcon}
    loadingFlag={exampleTemplateEntryModal.submitLoadingFlag}
/> */}

const getExampleTemplate = async (page = 1, length = 5, search = "", orderColumn = 1, orderDir = "asc") => {
    await api.get(`/test/example-template.json?start=${(page - 1) * length}&length=${length}&search%5Bvalue%5D=${search}`)
        .then(response => {
            const json = response.data;
            exampleTemplateArray.value = json.data;
            exampleTemplateDataTotalTable.value = json.recordsTotal;

            exampleTemplateOptionColumnTable.value = json.data.reduce(function (map, obj) {
                //map[obj.id] = obj.name;
                map[obj.id] = { "updatedButtonFlag": false, "deletedButtonFlag": false };
                return map;
            }, {});
        })
}

var modalObject;

onMounted(() => {
    getExampleTemplate();
});

const entryExampleTemplate = async (id) => {
    // setExampleTemplateForm(exampleTemplateInitial);
    // setExampleTemplateFormError([]);
    if (id !== undefined) {
        exampleTemplateOptionColumnTable.value = { ...exampleTemplateOptionColumnTable, [id]: { updatedButtonFlag: true } };
        await api.get(`/test/${id}/example-template.json`)
            .then(response => {
                const exampleTemplate = response.data.data;
                exampleTemplateForm.value = {
                    id: exampleTemplate.id
                    , name: exampleTemplate.name
                    , description: exampleTemplate.description
                    , value: exampleTemplate.value
                    , amount: exampleTemplate.amount
                    , date: exampleTemplate.date
                    , activeFlag: exampleTemplate.activeFlag
                };
            })
            .catch(function (error) {

            })
            .finally(() => {
                exampleTemplateOptionColumnTable.value = { ...exampleTemplateOptionColumnTable, [id]: { updatedButtonFlag: false } };
                exampleTemplateEntryModal.value = {
                    ...exampleTemplateEntryModal
                    , title: "Edit"
                    , submitLabel: "Update"
                    , submitIcon: "bi-arrow-repeat"
                    , submitLoadingFlag: false
                };
            });
    } else {
        exampleTemplateEntryModal.value = {
            ...exampleTemplateEntryModal
            , title: "Add"
            , submitLabel: "Save"
            , submitIcon: "bi-bookmark"
            , submitLoadingFlag: false
        };
    }

    modalObject = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
    modalObject.show();
}

const confirmDeleteExampleTemplate = (id) => {
    console.log(id);
}

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
        <Modal id="modal_id" size="md" :title="exampleTemplateEntryModal.title"
            :buttonArray="exampleTemplateModalButton">
            <Input label="Name" type="text" name="name" :value="exampleTemplateForm.name"
                :onChange="onExampleTemplateFormChange" placeholder="Please input name"
                className="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.name" />
            <Textarea label="Description" name="description" rows="3" :value="exampleTemplateForm.description"
                :onChange="onExampleTemplateFormChange" placeholder="Please input description"
                className="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.description"></Textarea>
            <Select label="Value" name="value" :map="selectValueMap" :value="exampleTemplateForm.value"
                :onChange="onExampleTemplateFormChange" placeholder="Please select value"
                className="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.value"></Select>
            <Input label="Amount" type="number" name="amount" :value="exampleTemplateForm.amount"
                :onChange="onExampleTemplateFormChange" placeholder="Please input amount"
                className="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.amount" />
            <Input label="Date" type="date" name="date" :value="exampleTemplateForm.date"
                :onChange="onExampleTemplateFormChange" placeholder="Please input date"
                className="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.date" />
            <Radio label="Active Flag" name="activeFlag" :value="exampleTemplateForm.activeFlag" :map="yesNoMap"
                :onChange="onExampleTemplateFormChange" className="col-md-6 col-sm-6 col-xs-12"
                :error="exampleTemplateFormError.activeFlag" />

        </Modal>
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <Table labelNewButton="New" :onNewButtonClick="entryExampleTemplate"
                            :dataArray="exampleTemplateArray" :columns="exampleTemplateColumns"
                            :dataTotal="exampleTemplateDataTotalTable" :onRender="getExampleTemplate">
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>