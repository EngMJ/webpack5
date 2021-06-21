<template>
  <div class="hello">
    <h1 @click="get">{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul ref="ulList">
      <li @click="changeData">点我试试</li>
      <li @mousedown="add">点我加数</li>
      <li>{{pData}}</li>

      <li>{{nm}}</li>
      <li>{{testProvide}}</li>
<!--      <li>{{csArr}}</li>-->
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch, Emit, Ref, Inject, InjectReactive } from 'vue-property-decorator';

interface objStyle{
  a:object,
  b:string,
  c:string[]
}

interface classfun<T>{
  (option1:number, option2:T):void
}

let a:classfun<string> = function (option1,option2){}
a(2, '123')

@Component
export default class HelloWorld extends Vue {
  @Inject('nmuArr') nm!: number[]
  @Inject() testProvide!:Array<string | undefined>
  // @InjectReactive() csArr!: any[]

  @Prop({type: String}) readonly msg!:string
  @Prop(Number) readonly pData!:number
  //
  @Ref('ulList') a!:HTMLUListElement

  get msgChange():string {
    return this.msg + '试试computed'
  }

  private mydata:string = '测试data数据'

  @Watch('mydata')
  mydataChange(val:string, oldVal:string):void {
    console.log(val)
    console.log(oldVal)
  }
  // 父组件事件
  @Emit('changeParentData') changeParentData(childNumber:number):void{}
  // 子组件事件
  changeData(e:Event) {
    console.log(e)
    this.mydata = '我来试试改变数据'
  }
  add():void {
    let num:number = this.pData + 1
    this.changeParentData(num)
  }
  get() {
    console.log(this.a)
  }
  // 生命周期hook
  beforeCreate() {}
  created() {}
  beforeMount() {}
  mounted() {
    console.log(this.nm)
    console.log(this.testProvide)
  }
  beforeUpdate() {}
  updated() {}
  beforeDestroy() {}
  destroyed() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
