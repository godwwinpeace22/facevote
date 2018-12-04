<template>
  <div>
    <sleek v-if="template == 2"> </sleek>
    <default v-else :selectedElection='selectedElection' :manifestoData='manifestoData'></default>
    
  </div>
</template>
<script>
export default {
  data: ()=>({

  }),
  props:['template', 'selectedElection', 'manifestoData'],
  components:{
    Default,
    Sleek
  },
  mounted(){
    console.log(this.manifestoData)
  },
}
import Default from '@/templates/Default'
import Sleek from '@/templates/Sleek'
</script>

