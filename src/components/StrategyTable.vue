<script setup lang="ts">

import { type Action } from '../utils/hexaStrategy';
import { maxMainLevel, maxProgress, resetEnableProgress } from '../utils/hexaTable';

defineProps<{
    strategyTable: Action[][]
}>();

const actionTranslation = {
    "progress": "강화",
    "reset": "리셋",
    "finish": "완료",
    "unreachable": "",
}

const actionColor = {
    "progress": "lightblue",
    "reset": "lightcoral",
    "finish": "lightgreen",
    "unreachable": "none",
}

</script>

<template>
    <div class="container">
        <div 
            v-if="strategyTable.length"
            class="grid"
            v-bind:style="{
                gridTemplateRows: `repeat(${maxMainLevel + 3}, 1fr)`, 
                gridTemplateColumns: `repeat(${maxProgress + 3 - resetEnableProgress}, 1fr)`,
            }"
        >
            <div></div>
            <div
                class="axis-label"
                v-bind:style="{gridColumnStart: 2, gridColumnEnd: maxProgress + 4 - resetEnableProgress}"
            >
                진행도
            </div>
            <div
                class="axis-label vertical"
                v-bind:style="{gridRowStart: 2, gridRowEnd: maxMainLevel + 4}"
            >
                메인스탯 레벨
            </div>

            <div></div>
            <div
                class="index-cell"
                v-for="progress in Array.from({length: maxProgress + 1 - resetEnableProgress}, (_, i) => i + resetEnableProgress + 1)"
                v-bind:style="{borderLeft: '1px solid #bbbbbb'}"
                :key="`col-${progress}`"
            >
                {{ progress - 1 }}
            </div>

            <template
                v-for="(row, level) in strategyTable"
                :key="`row-${level-1}`"
            >
                <div 
                    class="index-cell"
                    v-bind:style="{borderTop: '1px solid #bbbbbb'}"
                >
                    {{ level }}
                </div>
                <div
                    class="action-cell"
                    v-for="(action, progress) in row.filter((_, progress) => progress >= resetEnableProgress)"
                    v-bind:style="{
                        backgroundColor: actionColor[action],
                    }"
                    :key="`action-${level-1},${progress-1}`"
                >
                    {{ actionTranslation[action] }}
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
    .container {
        width: 100%;
    }

    .grid {
        display: grid;
        padding: 10px;
        width: 100%;
    }

    .action-cell {
        display: flex;
        justify-content: center;
        align-items: center;

        color: #444444;
        
        box-sizing: border-box;
        border-color: gray;
        border-style: solid;
        border-width: 1px 0 0 1px;

        user-select: none;
    }

    .index-cell {
        display: flex;
        justify-content: center;
        align-items: center;

        color: #444444;

        user-select: none;
    }

    .axis-label {
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 1.2rem;
    }

    .vertical {
        writing-mode: vertical-lr;
    }
</style>