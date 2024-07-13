<script setup>
const props = defineProps({
    id: { type: String, required: false, default: "toast_id" }
    , type: { type: String, required: false, default: "success" }
    , message: { type: String, required: false, default: "Message" }
})
</script>

<template>
    <div class="toast-container position-fixed p-3 top-0 end-0">
        <div :id="id"
            :class="'toast align-items-center text-white bg-' + (props.type === 'success' ? 'success' : 'danger') + ' border-0'"
            role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    {{ message }}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>