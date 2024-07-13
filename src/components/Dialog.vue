<script setup>
const props = defineProps({
    id: { type: String, required: false, default: "dialog_id" }
    , type: { type: String, required: false, default: "alert" }
    , message: { type: String, required: false, default: "Message" }
    , onConfirm: { type: Function, required: false, default: () => { alert("Please define your function!") } }
})

let titleSpan;
if (props.type === "confirmation") titleSpan = "bg-primary";
else if (props.type === "warning") titleSpan = "bg-danger";
else if (props.type === "alert") titleSpan = "bg-warning";
else titleSpan = "bg-dark";

</script>

<template>
    <div :id="id" class="modal fade bg-dark bg-opacity-75" data-bs-backdrop="static" data-bs-keyboard="false"
        tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span :class="'placeholder px-3 p-3 rounded me-2 ' + titleSpan"></span>
                    <h5 class="modal-title text-uppercase">{{ type }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">{{ message }}</div>
                <div class="modal-footer">
                    <button v-if="type === 'alert'" type="button" class="btn btn-sm btn-warning px-4"
                        data-bs-dismiss="modal">
                        <span class="bi-sun">&nbsp;UNDERSTOOD</span>
                    </button>
                    <button v-else type="button" class="btn btn-sm btn-secondary px-4 " data-bs-dismiss="modal">
                        <span class="bi-x-lg">&nbsp;CLOSE</span>
                    </button>
                    <button v-if="type === 'confirmation'" type="button" class="btn btn-sm btn-primary px-4 "
                        @click="onConfirm()">
                        <span class="bi-check-circle">&nbsp;OK</span>
                    </button>
                    <button v-else-if="type === 'warning'" type="button" class="btn btn-sm btn-danger px-4 "
                        @click="onConfirm()">
                        <span class="bi-check-circle">&nbsp;&nbsp;OF COURSE</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>