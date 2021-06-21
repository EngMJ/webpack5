<template>
  <div class="home">
    <test :msg="num"></test>
    <img alt="Vue logo" src="../assets/logo.png">
    <div>{{num}}</div>
    <div>{{a}}</div>
    <div>++{{currentNum}}</div>
    <div @click="changeNum">点我试试</div>
    <HelloWorld :abs="123" msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs,reactive, computed, provide } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import test from './test.vue'; // @ is an alias to /src

interface datatype{
  a:number,
  b:number
}

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
    test
  },
  setup() {
    let num = ref<number>(123)
    let obj:datatype = reactive({
      a: 123,
      b: 223
    })
    let currentNum = computed(():number=>{
      return num.value + 2
    })
    let changeNum = function () {
      num.value++
    }
    provide('testKey', num.value)
    return {
      num,
      ...toRefs(obj),
      currentNum,
      changeNum
    }
  }
});
</script>
