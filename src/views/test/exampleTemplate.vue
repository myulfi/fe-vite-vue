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
import Dialog from '../../components/Dialog.vue';
import Toast from '../../components/Toast.vue';

const exampleTemplateInitial = {
    name: ''
    , description: ''
    , value: 0
    , amount: 0
    , date: ''
    , activeFlag: null
};

const exampleTemplateBulkOptionLoadingFlag = ref(false);
const exampleTemplateBulkOptionDropdown = ref([
    {
        label: "Delete"
        , icon: "bi-trash"
        , onClick: () => confirmDeleteExampleTemplate()
    }
]);

const exampleTemplateCheckBoxTableArray = ref([]);
const exampleTemplateOptionColumnTable = ref([]);
const exampleTemplateDataTotalTable = ref(0);

const exampleTemplateArray = ref([]);

const exampleTemplateEntryTitleModal = ref("");
const exampleTemplateEntryButtonModal = ref([
    {
        label: ""
        , onClick: () => confirmStoreExampleTemplate()
        , class: "btn-primary"
        , icon: ""
        , loadingFlag: false
    }
]);

const exampleTemplateForm = ref(exampleTemplateInitial);
const exampleTemplateFormError = ref([]);

const onExampleTemplateFormChange = (e) => {
    const { name, value } = e.target;
    exampleTemplateForm.value = { ...exampleTemplateForm.value, [name]: value };
};

const selectValueMap = [{ "key": 1, "value": "Satu" }, { "key": 2, "value": "Dua" }, { "key": 3, "value": "Tiga" }, { "key": 4, "value": "Empat" }];
const yesNoMap = [{ "key": 1, "value": "Yes" }, { "key": 0, "value": "No" }];

const exampleTemplateValidate = (data) => {
    const error = {};
    if (!data.name.trim()) error.name = 'Username is required';
    if (!data.description.trim()) error.description = 'Description is required';
    if (data.value <= 0) error.value = 'Value is required';

    // if (!data.email.trim()) error.email = 'Email is required';
    // else if (!/\S+@\S+\.\S+/.test(data.email)) error.email = 'Email is invalid';
    exampleTemplateFormError.value = error;
    return Object.keys(error).length === 0;
};

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

const toast = ref({});
const dialog = ref({});
var toastObject;
var dialogObject;
var modalObject;

onMounted(() => {
    getExampleTemplate();
    toastObject = new bootstrap.Toast(document.getElementById("toast_id"), "data-bs-animation-delay");
    dialogObject = new bootstrap.Modal(document.getElementById("dialog_id"), { backdrop: false, keyboard: true, focus: true });
    modalObject = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
});

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

const entryExampleTemplate = async (id) => {
    exampleTemplateForm.value = exampleTemplateInitial;
    exampleTemplateFormError.value = [];
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
                toast.value = { type: "failed", message: error };
            })
            .finally(() => {
                exampleTemplateOptionColumnTable.value = { ...exampleTemplateOptionColumnTable, [id]: { updatedButtonFlag: false } };
                exampleTemplateEntryTitleModal.value = "Edit";
                exampleTemplateEntryButtonModal.value[0] = {
                    ...exampleTemplateEntryButtonModal.value[0]
                    , label: "Update"
                    , icon: "bi-arrow-repeat"
                    , loadingFlag: false
                };
            });
    } else {
        exampleTemplateEntryTitleModal.value = "Add";
        exampleTemplateEntryButtonModal.value[0] = {
            ...exampleTemplateEntryButtonModal.value[0]
            , label: "Save"
            , icon: "bi-bookmark"
            , loadingFlag: false
        };
    }

    modalObject.show();
}

const confirmStoreExampleTemplate = () => {
    if (exampleTemplateValidate(exampleTemplateForm.value)) {
        dialog.value = {
            message: "Are you sure to create?"
            , type: "confirmation"
            , onConfirm: (e) => storeExampleTemplate(e)
        };
        dialogObject.show();
    }
}

const storeExampleTemplate = async () => {
    if (exampleTemplateValidate(exampleTemplateForm.value)) {
        dialogObject.hide();
        exampleTemplateEntryButtonModal.value[0] = {
            ...exampleTemplateEntryButtonModal.value[0]
            , loadingFlag: true
        };

        await api.post(
            '/test/example-template.json'
            , JSON.stringify(exampleTemplateForm.value)
            , { headers: { 'Content-Type': 'application/json' } }
        )
            .then((json) => {
                if (json.data.status === "success") {
                    getExampleTemplate();
                }
                toast.value = { type: json.data.status, message: "Submitted successfully" };
            })
            .catch((error) => {
                toast.value = { type: "failed", message: error };
                exampleTemplateFormError.value = error.response.data;
            })
            .finally(() => {
                toastObject.show();
                exampleTemplateEntryButtonModal.value[0] = {
                    ...exampleTemplateEntryButtonModal.value[0]
                    , loadingFlag: false
                };
                bootstrap.Modal.getInstance(document.getElementById('modal_id')).hide();
            });
    }
}

const confirmDeleteExampleTemplate = (id) => {
    if (id !== undefined) {
        dialog.value = {
            message: `Are you sure to delete ${id}?`
            , type: "warning"
            , onConfirm: () => deleteExampleTemplate(id)
        };
    } else {
        if (exampleTemplateCheckBoxTableArray.value.length > 0) {
            dialog.value = {
                message: `Are you sure to delete ${exampleTemplateCheckBoxTableArray.value.length} items(s)?`
                , type: "warning"
                , onConfirm: () => deleteExampleTemplate()
            };
        } else {
            dialog.value = {
                message: "Please tick at least an item"
                , type: "alert"
            };
        }
    }
    dialogObject.show();
}

const deleteExampleTemplate = async (id) => {
    dialogObject.hide();
    if (id !== undefined) {
        exampleTemplateOptionColumnTable.value = { ...exampleTemplateOptionColumnTable, [id]: { deletedButtonFlag: true } };
    } else {
        exampleTemplateBulkOptionLoadingFlag.value = true;
    }

    await api.delete(
        `/test/${id !== undefined ? id : exampleTemplateCheckBoxTableArray.value.join("")}/example-template.json`
        , null
        , { headers: { 'Content-Type': 'application/json' } }
    )
        .then(function (json) {
            if (json.data.status === "success") {
                getExampleTemplate();
                if (id === undefined) {
                    exampleTemplateCheckBoxTableArray.value = [];
                }
            }
            toast.value = { type: json.data.status, message: json.data.message };
        })
        .catch(function (error) {
            toast.value = { type: "failed", message: error };
        })
        .finally(() => {
            if (id !== undefined) {
                exampleTemplateOptionColumnTable.value = { ...exampleTemplateOptionColumnTable, [id]: { deletedButtonFlag: false } };
            } else {
                exampleTemplateBulkOptionLoadingFlag.value = false;
            }
            toastObject.show();
        });
}

</script>

<template>
    <div class="container mt-4 mb-4">
        <Modal id="modal_id" size="md" :title="exampleTemplateEntryTitleModal"
            :buttonArray="exampleTemplateEntryButtonModal">
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
        <Dialog id="dialog_id" :type="dialog.type" :message="dialog.message" :onConfirm="dialog.onConfirm" />
        <Toast id="toast_id" :type="toast.type" :message="toast.message" />
        <div className="row">
            <h3><span className="bi-puzzle">&nbsp;Example</span></h3>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <Table labelNewButton="New" :onNewButtonClick="entryExampleTemplate"
                            :bulkOptionLoadingFlag="exampleTemplateBulkOptionLoadingFlag"
                            :bulkOptionArray="exampleTemplateBulkOptionDropdown" :dataArray="exampleTemplateArray"
                            :columns="exampleTemplateColumns" :checkBoxArray="exampleTemplateCheckBoxTableArray"
                            :onCheckBox="exampleTemplateCheckBoxTableArray => { exampleTemplateCheckBoxTableArray.value = [...exampleTemplateCheckBoxTableArray]; }"
                            :dataTotal="exampleTemplateDataTotalTable" :onRender="getExampleTemplate">
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>