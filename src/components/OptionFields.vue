<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits();

const goal = ref(10); // 목표 레벨
const fragPrice = ref(0.07); // 조각 가격
const isSunday = ref(false); // 썬데이 체크박스

const batch = ref<number | undefined>(undefined);
const goalProb = ref<number>(95);

// 폼 제출 처리
const submitData = () => {
    emit('submit', {
        goal: goal.value,
        fragPrice: fragPrice.value,
        isSunday: isSunday.value,

        batch: batch.value,
        goalProb: goalProb.value,
    });
};
</script>

<template>
    <div>
        <form class="container">
            <div class="title">
                <strong>강화 설정</strong>
            </div>
            <div class="input-container">
                <label for="goal_id">목표 레벨</label>
                <input id="goal_id" v-model="goal" value="10">
            </div>
            <div class="input-container">
                <label for="fragPrice_id">조각 가격 (단위: 억 메소)</label>
                <input step="0.001" id="fragPrice_id" v-model="fragPrice" value="0.07">
            </div>
            <div class="checkbox-container">
                <label for="isSunday_id">썬데이</label>
                <input type="checkbox" id="isSunday_id" v-model="isSunday">
            </div>

            <div class="title">
                <strong>출력 설정</strong>
            </div>
            <div class="input-container">
                <label for="batch_id">구간 간격</label>
                <input id="batch_id" v-model="batch" value="" placeholder="공백 입력 시 자동">
            </div>
            <div class="input-container">
                <label for="goalProb_id">최대 달성 확률(%)</label>
                <input id="goalProb_id" v-model="goalProb" value="">
            </div>
            <button type="button" @click="submitData">생성</button>
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
</style>