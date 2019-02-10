<template>
  <div>
    <sleek v-if="template == 'sleek'" > </sleek>
    <default v-if="template == 'default'" :viewonly="viewonly" :selectedElection='selectedElection' :manifestoData='manifestoData'></default>
    <!-- <default v-else :selectedElection='selectedElection' :manifestoData='manifestoData'></default> -->
    
  </div>
</template>
<script>
export default {
  data: ()=>({

  }),
  props:{
    template:{
      type:String,
      default:'default'
    },
    selectedElection:{
      //type:Object,
      required:true
    },
    manifestoData:{
      //type:Object,
    },
    viewonly:{
      type:Boolean,
      default:false
    }

  },
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

