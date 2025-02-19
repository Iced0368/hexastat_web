<script setup lang="ts">

import './style.css';
import { ref } from 'vue';

import { type Action } from './utils/hexaStrategy';
import { findOptimalStrategy } from './utils/hexaStrategy';

import AnalyzedChart from './components/AnalyzedChart.vue';
import StrategyTable from './components/StrategyTable.vue';
import OptionFields from './components/OptionFields.vue';
import { analyzeData } from './utils/analyze';

const strategy = ref<Action[][]>([]);
const analyzedData = ref<{
  //distData: number[], 
  accData: number[][], 
  mean: {frag: number, reset: number}, batch: number}
>({
  //distData: [], 
  accData: [], 
  mean: {frag: 0, reset: 0}, 
  batch: 0
});

const handleSubmit = (data: {goal: number, fragPrice: number, isSunday: boolean, batch: number | undefined, goalProb: number}) => {
  strategy.value = findOptimalStrategy(data.goal, data.fragPrice, data.isSunday);
  analyzedData.value = analyzeData(strategy.value, data.goalProb, data);
}

</script>


<template>
  <header>
    <img src="./assets/hexa-icon.png">
    <strong>헥사스탯 강화 분석기</strong>
  </header>

  <div class="container">
    <main>
      <div class="divider">
        <div class="main-label"><strong>솔 에르다 조각 누적 소모량</strong></div>
        <AnalyzedChart :data="analyzedData"></AnalyzedChart>
      </div>

      <div class="divider">
        <div class="main-label"><strong>강화/초기화 테이블</strong></div>
        <StrategyTable :strategyTable="strategy"></StrategyTable>
      </div>
    </main>
    <aside>
      <OptionFields @submit="handleSubmit"></OptionFields>
    </aside>
  </div>

  <footer>
  </footer>
</template>

<style scoped>
  header {
    display: flex;
    justify-content: center;
    align-items: center;

    left: 0;
    width: 100%;
    padding: 10px 0 10px 0;

    gap: 20px;
    font-size: 2rem;

    margin-bottom: 30px;

    background-color: white;
  }

  .container {
    display: flex;
    gap: 20px;
  }

  main {
    width: 800px;
  }

  aside {
    width: 250px;
  }

  @media (max-width: 1100px) {
    .container {
      flex-direction: column-reverse;
      width: 90%;
    }

    aside {
      width: 100%;
    }

    main {
      width: 100%;
    }
  }

  .divider {
    border-radius: 10px;
    background-color: white;
    box-shadow: 3px 3px 5px rgba(0,0,0, 0.2), -3px -3px 5px rgba(0,0,0, 0.2);
    padding: 30px;

    margin-bottom: 20px;
  }

  .main-label {
    font-size: 1.5rem;
    border-bottom: 1px solid gray;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }


</style>
