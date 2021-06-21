<template>
  <div>
    {{changeShow}}
    <div @click="changeA">
      点击改变
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, reactive, toRefs,watch, inject } from 'vue'


// todo vuex ts校验


type c = {
  change: string,
  n?: string
}

type d = number
export default defineComponent({
  props: {
    msg: {
      type: Number as PropType<d>,
      default: 999
    }
  },
  setup(props) {
    console.log(props)
    console.log(inject('testKey'), 'inject')
    let a = ref<string>('123')
    console.log(a.value)
    let b:c = reactive({
      change:'123'
    })
    let changeShow = computed(():string => {
      return a.value + '223'
    })

    watch(a, (val, oldVal) => {
      console.log(val, oldVal)
    })

    let changeA = () => {
      a.value = '改变试试'
    }
    return {
      ...toRefs(b),
      changeShow,
      changeA
    }
  }
})
</script>

<style scoped>

</style>
