<script setup>

//import ref and onMounted
import { ref, onMounted } from 'vue';
import Table from '../../components/Table.vue';
import { CommonConstants } from '../../constants/CommonConstants.vue';
import { formatDate } from '../../function/DateHelper.vue';

//import api
import { api, apiRequest } from '../../api';
import Modal from '../../components/Modal.vue';
import Input from '../../components/form/Input.vue';
import Textarea from '../../components/form/Textarea.vue';
import Select from '../../components/form/Select.vue';
import Radio from '../../components/form/Radio.vue';
import Dialog from '../../components/Dialog.vue';
import Toast from '../../components/Toast.vue';
import SelectFilter from '../../components/filter/SelectFilter.vue';
import DateFilter from '../../components/filter/DateFilter.vue';
import RangeFilter from '../../components/filter/RangeFilter.vue';
import Label from '../../components/form/Label.vue';
import SelectMultiple from '../../components/form/SelectMultiple.vue';

const exampleTemplateInitial = {
    name: ''
    , description: ''
    , value: 0
    //, valueMultiple: []
    , amount: 0
    , date: ''
    , activeFlag: null
    , version: 0
};

const exampleTemplateStateModal = ref(CommonConstants.MODAL_IS_ENTRY)

const exampleTemplateFilterTableTableInitial = {
    value: 0,
    date: "",
    range: 0,
};

const exampleTemplateFilterTable = ref(exampleTemplateFilterTableTableInitial);

const onExampleTemplateFilterTableChange = (e) => {
    const { name, value } = e.target;
    exampleTemplateFilterTable.value = { ...exampleTemplateFilterTable.value, [name]: value };
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
const exampleTemplateAttributeTable = ref();
const exampleTemplateDataTotalTable = ref(0);
const exampleTemplateTableLoadingFlag = ref(false);

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

const selectValueMap = [
    { "key": 1, "value": "Satu" },
    { "key": 2, "value": "Dua" },
    { "key": 3, "value": "Tiga" },
    { "key": 4, "value": "Empat" },
    { "key": 5, "value": "Lima" },
    { "key": 6, "value": "Enam" },
    { "key": 7, "value": "Tujuh" },
    { "key": 8, "value": "Delapan" },
    { "key": 9, "value": "Sembilan" },
    { "key": 10, "value": "Sepuluh" },
];
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
        , class: "text-nowrap"
        , orderable: true
        , minDevice: CommonConstants.MOBILE
    }
    , {
        data: "description"
        , name: "Description"
        , class: "text-nowrap"
        , minDevice: CommonConstants.TABLET
    }
    , {
        data: "value"
        , name: "Value"
        , class: "text-nowrap"
        , width: 10
        , minDevice: CommonConstants.TABLET
    }
    , {
        data: "date"
        , name: "Date"
        , class: "text-nowrap"
        , width: 10
        , minDevice: CommonConstants.DESKTOP
    }
    , {
        data: "createdBy"
        , name: "Created By"
        , class: "text-nowrap"
        , width: 10
        , minDevice: CommonConstants.DESKTOP
    }
    , {
        data: "createdDate"
        , name: "Created Date"
        , class: "text-nowrap"
        , width: 15
        , orderable: true
        , minDevice: CommonConstants.DESKTOP
    }
    , {
        data: "id"
        , name: "Option"
        , class: "text-center"
        , render: function (data) {
            return [
                {
                    label: "View"
                    , onClick: () => viewExampleTemplate(data)
                    , class: "btn-primary"
                    , icon: "bi-list-ul"
                    , loadingFlag: exampleTemplateOptionColumnTable.value[data]?.viewedButtonFlag
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

const exampleTemplateOrder = [[5, "desc"]];

const toast = ref({});
const dialog = ref({});
var toastObject;
var dialogObject;
var modalObject;

onMounted(() => {
    // getExampleTemplate();
    toastObject = new bootstrap.Toast(document.getElementById("toast_id"), "data-bs-animation-delay");
    dialogObject = new bootstrap.Modal(document.getElementById("dialog_id"), { backdrop: false, keyboard: true, focus: true });
    modalObject = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
});

const getExampleTemplate = async (options) => {
    exampleTemplateTableLoadingFlag.value = true;

    try {
        const params = {
            "start": (options.page - 1) * options.length,
            "length": options.length,
            "search": options.search,
            "orderColumn": options.order.length > 1 ? options.order[0] : null,
            "orderDir": options.order.length > 1 ? options.order[1] : null,
            "value": exampleTemplateFilterTable.value.value,
            "date": exampleTemplateFilterTable.value.date,
            "range": exampleTemplateFilterTable.value.range,
        }

        exampleTemplateAttributeTable.value = options;

        const response = await apiRequest(CommonConstants.METHOD_IS_GET, "/test/example-template.json", params)
        const json = response.data;
        exampleTemplateArray.value = json.data;
        exampleTemplateDataTotalTable.value = json.recordsTotal;
        exampleTemplateOptionColumnTable.value = json.data.reduce(function (map, obj) {
            //map[obj.id] = obj.name;
            map[obj.id] = { "viewedButtonFlag": false, "deletedButtonFlag": false };
            return map;
        }, {});
    } catch (error) {
        toast.value = { type: "failed", message: error.response.data.message ?? error.message };
        toastObject.show();
    } finally {
        exampleTemplateTableLoadingFlag.value = false;
    }
}

const viewExampleTemplate = async (id) => {
    exampleTemplateForm.value = exampleTemplateInitial;
    if (id !== undefined) {
        exampleTemplateStateModal.value = CommonConstants.MODAL_IS_VIEW
        exampleTemplateOptionColumnTable.value = { ...exampleTemplateOptionColumnTable, [id]: { viewedButtonFlag: true } };

        try {
            const response = await apiRequest(CommonConstants.METHOD_IS_GET, `/test/${id}/example-template.json`)
            const exampleTemplate = response.data.data;
            exampleTemplateForm.value = {
                id: exampleTemplate.id
                , name: exampleTemplate.name
                , description: exampleTemplate.description
                , value: exampleTemplate.value
                , amount: exampleTemplate.amount
                , date: exampleTemplate.date
                , activeFlag: exampleTemplate.activeFlag
                , version: exampleTemplate.version
            };

            exampleTemplateEntryTitleModal.value = "View";
            exampleTemplateEntryButtonModal.value[0] = {
                ...exampleTemplateEntryButtonModal.value[0]
                , label: "Edit"
                , onClick: () => entryExampleTemplate(true)
                , icon: "bi-pencil"
                , loadingFlag: false
            };
            modalObject.show();
        } catch (error) {
            toast.value = { type: "failed", message: error.message };
            toastObject.show();
        } finally {
            exampleTemplateOptionColumnTable.value = { ...exampleTemplateOptionColumnTable, [id]: { viewedButtonFlag: false } };
        }
    }
}

const entryExampleTemplate = (haveContentFlag) => {
    exampleTemplateStateModal.value = CommonConstants.MODAL_IS_ENTRY
    exampleTemplateFormError.value = [];
    if (haveContentFlag) {
        exampleTemplateEntryTitleModal.value = "Edit";
        exampleTemplateEntryButtonModal.value[0] = {
            ...exampleTemplateEntryButtonModal.value[0]
            , label: "Update"
            , onClick: () => confirmStoreExampleTemplate()
            , icon: "bi-arrow-repeat"
            , loadingFlag: false
        };
    } else {
        exampleTemplateForm.value = exampleTemplateInitial;
        exampleTemplateEntryTitleModal.value = "Add";
        exampleTemplateEntryButtonModal.value[0] = {
            ...exampleTemplateEntryButtonModal.value[0]
            , label: "Save"
            , onClick: () => confirmStoreExampleTemplate()
            , icon: "bi-bookmark"
            , loadingFlag: false
        };
        modalObject.show();
    }
}

const confirmStoreExampleTemplate = () => {
    if (exampleTemplateValidate(exampleTemplateForm.value)) {
        dialog.value = {
            message: exampleTemplateForm.value.id === undefined ? "Are you sure to create?" : "Are you sure to update?"
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

        try {
            const json = await apiRequest(
                exampleTemplateForm.value.id === undefined ? CommonConstants.METHOD_IS_POST : CommonConstants.METHOD_IS_PATCH
                , exampleTemplateForm.value.id === undefined ? '/test/example-template.json' : `/test/${exampleTemplateForm.value.id}/example-template.json`
                , JSON.stringify(exampleTemplateForm.value)
            )

            if (json.data.status === "success") {
                getExampleTemplate(exampleTemplateAttributeTable.value);
                bootstrap.Modal.getInstance(document.getElementById('modal_id')).hide();
            }
            toast.value = { type: json.data.status, message: json.data.message };
        } catch (error) {
            toast.value = { type: "failed", message: error.response.data.message ?? error.message };
            exampleTemplateFormError.value = error.response.data;
        } finally {
            toastObject.show();
            exampleTemplateEntryButtonModal.value[0] = {
                ...exampleTemplateEntryButtonModal.value[0]
                , loadingFlag: false
            };
        }
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

    try {
        const json = await apiRequest(CommonConstants.METHOD_IS_DELETE, `/test/${id !== undefined ? id : exampleTemplateCheckBoxTableArray.join("")}/example-template.json`)
        if (json.data.status === "success") {
            getExampleTemplate(exampleTemplateAttributeTable.value);
            if (id === undefined) {
                exampleTemplateCheckBoxTableArray.value = [];
            }
        }
        toast.value = { type: json.data.status, message: json.data.message };
    } catch (error) {
        toast.value = { type: "failed", message: error.response.data.message ?? error.message };
    } finally {
        if (id !== undefined) {
            exampleTemplateOptionColumnTable.value = { ...exampleTemplateOptionColumnTable, [id]: { deletedButtonFlag: false } };
        } else {
            exampleTemplateBulkOptionLoadingFlag.value = false;
        }
        toastObject.show();
    }
}

</script>

<template>
    <div class="container mt-4 mb-4">
        <Modal id="modal_id" size="md" :title="exampleTemplateEntryTitleModal"
            :buttonArray="exampleTemplateEntryButtonModal">
            <template v-if="CommonConstants.MODAL_IS_ENTRY == exampleTemplateStateModal">
                <Input label="Name" type="text" name="name" :value="exampleTemplateForm.name"
                    :onChange="onExampleTemplateFormChange" placeholder="Please input name"
                    class="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.name" />
                <Textarea label="Description" name="description" rows="3" :value="exampleTemplateForm.description"
                    :onChange="onExampleTemplateFormChange" placeholder="Please input description"
                    class="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.description"></Textarea>
                <Select label="Value" name="value" :map="selectValueMap" :value="exampleTemplateForm.value"
                    :onChange="onExampleTemplateFormChange" placeholder="Please select value"
                    class="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.value"></Select>
                <!-- <SelectMultiple label="Value" name="multipleValue" :map="selectValueMap"
                    :valueMultiple="exampleTemplateForm.valueMultiple" :liveSearch="true" :actionBox="true" :dataSize=5
                    :onChange="onExampleTemplateFormChange" placeholder="Please select value"
                    class="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.value" /> -->
                <Input label="Amount" type="number" name="amount" :value="exampleTemplateForm.amount"
                    :onChange="onExampleTemplateFormChange" placeholder="Please input amount"
                    class="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.amount" />
                <Input label="Date" type="date" name="date"
                    :value="formatDate(new Date(exampleTemplateForm.date), 'yyyy-MM-dd')"
                    :onChange="onExampleTemplateFormChange" placeholder="Please input date"
                    class="col-md-6 col-sm-6 col-xs-12" :error="exampleTemplateFormError.date" />
                <Radio label="Active Flag" name="activeFlag" :value="exampleTemplateForm.activeFlag" :map="yesNoMap"
                    :onChange="onExampleTemplateFormChange" class="col-md-6 col-sm-6 col-xs-12"
                    :error="exampleTemplateFormError.activeFlag" />
            </template>
            <template v-else-if="CommonConstants.MODAL_IS_VIEW == exampleTemplateStateModal">
                <Label text="Name" :value="exampleTemplateForm.name" class="col-md-6 col-sm-6 col-xs-12"></Label>
                <Label text="Description" :value="exampleTemplateForm.description"
                    class="col-md-6 col-sm-6 col-xs-12"></Label>
                <Label text="Value" :value="exampleTemplateForm.value" class="col-md-6 col-sm-6 col-xs-12"></Label>
                <Label text="Amount" :value="exampleTemplateForm.amount" class="col-md-6 col-sm-6 col-xs-12"></Label>
                <Label text="Date" :value="formatDate(new Date(exampleTemplateForm.date), 'yyyy-MM-dd')"
                    class="col-md-6 col-sm-6 col-xs-12"></Label>
                <Label text="Active Flag" :value="exampleTemplateForm.activeFlag"
                    class="col-md-6 col-sm-6 col-xs-12"></Label>
            </template>
        </Modal>
        <Dialog id="dialog_id" :type="dialog.type" :message="dialog.message" :onConfirm="dialog.onConfirm"></Dialog>
        <Toast id="toast_id" :type="toast.type" :message="toast.message" />
        <div class="row">
            <h3><span class="bi-puzzle">&nbsp;Example</span></h3>
        </div>
        <div class="row">
            <SelectFilter label="Value" name="value" :map="selectValueMap"
                :value="exampleTemplateFilterTable.value.value" :onChange="onExampleTemplateFilterTableChange"
                placeholder="All" :delay="1" class="col-md-4 col-sm-6 col-xs-12" />
            <DateFilter label="Date" name="date" :value="exampleTemplateFilterTable.date"
                :onChange="onExampleTemplateFilterTableChange" :delay="2" class="col-md-4 col-sm-6 col-xs-12" />
            <RangeFilter label="Range" name="range" :value="exampleTemplateFilterTable.range"
                :onChange="onExampleTemplateFilterTableChange" :delay="3" class="col-md-4 col-sm-6 col-xs-12" />
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <Table labelNewButton="New" :onNewButtonClick="entryExampleTemplate"
                            :bulkOptionLoadingFlag="exampleTemplateBulkOptionLoadingFlag"
                            :bulkOptionArray="exampleTemplateBulkOptionDropdown" :dataArray="exampleTemplateArray"
                            :columns="exampleTemplateColumns" :order="exampleTemplateOrder"
                            :checkBoxArray="exampleTemplateCheckBoxTableArray"
                            :onCheckBox="exampleTemplateCheckBoxTableArray => { exampleTemplateCheckBoxTableArray.value = [...exampleTemplateCheckBoxTableArray]; }"
                            :dataTotal="exampleTemplateDataTotalTable" :filter="exampleTemplateFilterTable"
                            :onRender="(page, length, search, order) => getExampleTemplate({ page: page, length: length, search: search, order: order })"
                            :loadingFlag="exampleTemplateTableLoadingFlag">
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>