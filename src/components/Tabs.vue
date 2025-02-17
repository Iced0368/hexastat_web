<script setup lang="ts">
import { type Ref, ref, provide } from 'vue';

// 현재 활성화된 탭을 추적
const activeTab = ref(0);
const tabs = ref<string[]>([]);

// 탭을 클릭할 때 활성화된 탭을 설정
const setActiveTab = (index: number) => {
  activeTab.value = index;
};

provide('addTab', (tabName: string, indexRef: Ref<number | undefined>) => {
    indexRef.value = tabs.value.length;
    tabs.value.push(tabName);
});

provide('activeTab', activeTab);

</script>

<template>
    <div class="container">
        <div class="tabs">
            <div
                v-for="(tabName, index) in tabs"
                :key="index"
                :class="['tab', { deactive: activeTab !== index }]"
                @click="setActiveTab(index)"
            >
                {{ tabName }}
            </div>
        </div>
        <div class="contents">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .container {
        background-color: white;
    }
    .tabs {
        display: flex;
        background-color: lightgray;
    }
    .tab {
        background-color: white;
        border-radius: 5px 5px 0 0;
        border-bottom: none;
        padding: 10px;
        margin: 5px 5px 0 5px;
        cursor: pointer;
    }
    .tab.deactive {
        background-color: lightgray;
    }

    .contents {
        border: 1px solid lightgray;
        border-top: none;
        padding: 10px;
    }
</style>