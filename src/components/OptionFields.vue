<script setup lang="ts">
import { ref, watch } from 'vue';
import { fragCostMultiplier, maxMainLevel } from '../utils/hexaTable';

const emit = defineEmits();

const goal = ref("10"); // 목표 레벨
const fragPrice = ref("0.07"); // 조각 가격
const isSunday = ref(false); // 썬데이 체크박스

const batch = ref("");
const goalProb = ref("95");

const goalInvalid = ref(false);
const fragPriceInvalid = ref(false);
const batchInvalid = ref(false);
const goalProbInvalid = ref(false);

const fieldsInvalid = ref(false);

watch(goal, (newValue) => {
    const goalNumber = Number(newValue);
    goalInvalid.value = isNaN(goalNumber) || goalNumber < 0 || goalNumber > maxMainLevel;
});

watch(fragPrice, (newValue) => {
    const fragPriceNumber = Number(newValue);
    fragPriceInvalid.value = isNaN(fragPriceNumber);
});

watch(batch, (newValue) => {
    const batchNumber = Number(newValue);
    batchInvalid.value = newValue !== "" || isNaN(batchNumber);
});

watch(goalProb, (newValue) => {
    const goalProbNumber = Number(newValue);
    goalProbInvalid.value = isNaN(goalProbNumber) || goalProbNumber < 0 || goalProbNumber >= 100;
});


watch([goalInvalid, fragPriceInvalid, batchInvalid, goalProbInvalid], (newValues) => {
    fieldsInvalid.value = newValues.reduce((acc, val) => acc || val, false);
})

// 폼 제출 처리
const submitData = () => {
    if (fieldsInvalid.value) {
        // Do nothing
    }
    else 
        emit('submit', {
            goal: Number(goal.value),
            fragPrice: Number(fragPrice.value),
            isSunday: isSunday.value,

            batch: batch.value ? Number(batch.value) : undefined,
            goalProb: Number(goalProb.value),
        });
};
</script>

<template>
    <div>
        <form class="container">
            <div class="title">
                <strong>강화 설정</strong>
            </div>
            <div 
                :class="`input-container ${goalInvalid ? 'invalid' : ''}`"
            >
                <label for="goal_id">목표 레벨</label>
                <input 
                    id="goal_id" 
                    v-model="goal" 
                >
            </div>
            <div 
                :class="`input-container ${fragPriceInvalid ? 'invalid' : ''}`"
            >
                <label for="fragPrice_id">조각 가격 (단위: 억 메소)</label>
                <input 
                    id="fragPrice_id" 
                    v-model="fragPrice" 
                >
            </div>
            <div class="checkbox-container">
                <label for="isSunday_id">썬데이</label>
                <input 
                    type="checkbox" 
                    id="isSunday_id" 
                    v-model="isSunday"
                >
            </div>

            <div class="title">
                <strong>출력 설정</strong>
            </div>
            <div 
                :class="`input-container ${batchInvalid ? 'invalid' : ''}`"
            >
                <label for="batch_id">구간 간격(조각 개수)</label>
                <input 
                    id="batch_id" 
                    v-model="batch" 
                    placeholder="공백 입력 시 자동"
                >
            </div>
            <div 
                :class="`input-container ${goalProbInvalid ? 'invalid' : ''}`"
            >
                <label for="goalProb_id">최대 달성 확률(%)</label>
                <input 
                    id="goalProb_id" 
                    v-model="goalProb" 
                >
            </div>
            <button 
                type="button" 
                @click="submitData"
                :class="fieldsInvalid ? 'inactive' : ''"
            >
                생성
            </button>
        </form>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        padding: 30px;

        border-radius: 10px;
        background-color: white;
        box-shadow: 3px 3px 5px rgba(0,0,0, 0.2), -3px -3px 5px rgba(0,0,0, 0.2);
    }

    .title {
        align-self: center;
        font-size: 1.2rem;
        margin-bottom: 15px;
    }

    .input-container {
        display: flex;
        flex-direction: column;

        background-color: #D3D3D3;
        border-radius: 10px;
        margin-bottom: 10px;

        label {
            font-size: 0.8rem;
            margin: 7px 10px 5px 10px;
            align-self: flex-start;
        }

        input {
            border: none;
            outline: none;
            margin: 0 10px 10px 10px;
            background-color: transparent;
        }
    }

    .input-container.invalid {
        background-color: lightcoral;
    }

    .checkbox-container {
        display: flex;
        flex-direction: row;

        background-color: #D3D3D3;
        border-radius: 10px;
        margin-bottom: 10px;

        label {
            font-size: 0.8rem;
            margin: 7px 10px 5px 10px;
            align-self: flex-start;
        }
    }

    button {
        margin-top: auto;
        width: 100%;
        color: white;
        background-color: #646cff;
    }

    button:hover {
        border-color: white;
    }

    button.inactive {
        background-color: gray;
        border: none;
        cursor: not-allowed;
    }
</style>