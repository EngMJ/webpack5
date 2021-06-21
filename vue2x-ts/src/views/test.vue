<template>
  <div @click="changeMsgEvent" ref="msgContent">
    {{msg}}
    <div>
      {{abs}}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit, Ref, Inject } from 'vue-property-decorator'
// todo vuex ts校验

@Component({})
export default class mc extends Vue{
  @Inject('nmuArr') abs!:number
  @Prop(String) readonly msg!:string
  @Watch('msg')
  msgChange(val:string, oldVal:string) {
    console.log(val, oldVal)
  }
  @Emit('changeData')
  changeData(val:string) {}

  @Ref('msgContent') msgRef: HTMLElement | undefined
  changeMsgEvent() {
    console.log(this.msgRef)
    this.changeData('我来试试');
  }
  get msgchange():string {
    return  this.msg
  }


}
</script>

<style scoped>

</style>
