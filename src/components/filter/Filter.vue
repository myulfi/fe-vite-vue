<script setup>
const props = defineProps({
    label: String
    , icon: { type: String, required: false, default: "bi-search" }
    , class: { type: String, required: false, default: "col-xs-12" }
    , delay: { type: Number, required: false, default: 1 }
})
</script>

<template>
    <div :class="props.class + ' fade-in-delay-' + props.delay + ' mb-4'">
        <div class="card border-0 rounded shadow-sm">
            <div class="card-body">
                <div class="col-xs-12">
                    <h5 class="card-title"><span :class="icon">&nbsp;{{ label }}</span></h5>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.fade-in-delay-1 {
    animation: fadeInAnimation ease 1000ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.fade-in-delay-2 {
    animation: fadeInAnimation ease 1500ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.fade-in-delay-3 {
    animation: fadeInAnimation ease 2000ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.fade-in-delay-4 {
    animation: fadeInAnimation ease 2500ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
    0% {
        transform: translateY(100%);
        opacity: 0;
    }

    100% {
        transform: translateY(0%);
        opacity: 1;
    }
}
</style>