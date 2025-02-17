<script setup lang="ts">
import { type Ref, ref, inject, onMounted } from 'vue';

const props = defineProps<{name: string}>();
const tabIndex = ref<number | undefined>(undefined);
const activeTab = inject('activeTab') as number;

const addTab = inject('addTab') as (tabName: string, indexRef: Ref<number | undefined>) => void;

onMounted(() => {
    console.log("!!")
    addTab(props.name, tabIndex)
});

</script>

<template>
    <slot v-if="tabIndex === activeTab"></slot>
</template>
