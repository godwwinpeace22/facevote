<template>
  <div>
    <loading-bar v-if="!ready">
      <span slot="loading_info">Loading manifesto...</span>
    </loading-bar>

    <v-container grid-list-xs v-if="ready">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader v-if="noManifesto">Sorry, this contestant does not have a manifesto yet</v-subheader>
          <template-index v-else :viewonly="true" :manifestoData="manifesto" :selectedElection="election" :template="manifesto.template_name"></template-index>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data:()=>({
    ready:false,
    manifesto:{},
    noManifesto:false,
  }),
  props:['user','election'],
  methods:{
    getManifesto(){
      let docId = this.user.uid + this.election.electionId
      db.collection('manifestos').doc(docId)
      .get().then(doc=>{
        if(doc.exists){
          this.manifesto = doc.data()
          console.log(doc.data())
          this.ready = true
        }
        else{
          this.ready = true
          this.noManifesto = true
        }
        
      }).catch(err=> console.log(err))
    }
  },
  components:{
    TemplateIndex,
    LoadingBar,
  },
  mounted(){
    this.getManifesto()
  }
}
import TemplateIndex from '@/templates/TemplateIndex'
import LoadingBar from '@/spinners/LoadingBar'
</script>
