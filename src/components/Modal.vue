<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    id: { type: String, required: false, default: "modal_id" }
    , size: { type: String, required: false, default: "xl" }
    , title: { type: String, required: false, default: "Form" }
    , buttonArray: Array
    // , children
})
</script>

<template>
    <div :id="id" class="modal fade bg-dark bg-opacity-75" data-bs-backdrop="static" data-bs-keyboard="false"
        tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div :class="'modal-dialog modal-' + size">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-uppercase">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <!-- {{ children }} -->
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary m-1" data-bs-dismiss="modal">
                        <span class="bi-x-lg">&nbsp;Close</span>
                    </button>
                    <!-- {buttonArray} -->
                </div>
            </div>
        </div>
    </div>
</template>