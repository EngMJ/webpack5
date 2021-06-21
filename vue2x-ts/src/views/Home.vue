<template>
  <div class="home">
    <ul>
      <li @click="changenm">改变nm</li>
      <li @click="changetestProvide">改变testProvide</li>
      <li @click="changecsarr">改变csarr</li>
    </ul>
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld @changeParentData="changeThatData"
                :pData="parentData"
                msg="Welcome to Your Vue.js + TypeScript App"/>
    <test :msg="testData" @changeData="testDataChange"></test>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide, ProvideReactive, Emit, Model, Ref} from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import test from './test.vue'; // @ is an alias to /src

const tlupe:[string] = ['123']

enum mz{
  a= 123,
  b
}

let a = mz.a
let b = mz[123]
console.log(a,b)

interface a{
  a:number
}

interface a {
  b:string
}

type myType = string | number
type un = undefined

@Component({
  components: {
    HelloWorld,
    test
  },
  beforeRouteEnter(to:any,from:any,next:any) {
    console.log('enter',to,from)
    next()
  },
  beforeRouteLeave(to:any,from:any,next:any) {
    console.log('leave',to,from)
    next()
  }
})
export default class Home extends Vue {
  private parentData:number = 123
  testData:string = '我是测试数据'
  @Provide('testProvide') ppData:Array<string | undefined> = ['123']
  @Provide('nmuArr') numArr:number[] = [123]
  @ProvideReactive('dtArr') dtArr:[] = []
  @ProvideReactive() csArr:Array< myType | un> = ['123']

  testDataChange(data:string) {
    this.testData = data
  }
  changenm(){
    console.log('556')
    this.numArr.push(223)
  }
  changetestProvide(){
    console.log('556')
    this.ppData.push('223')
  }
  changecsarr(){
    console.log('556')
    this.csArr.push('556')
  }
  changeThatData(childData:number):void {
    console.log(childData)
    this.parentData = childData
  }
}
</script>
