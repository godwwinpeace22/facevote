<template>
  <v-container grid-list-xs>
    <v-layout row wrap justify-center>
      <v-flex sm6 offset-sm-3>
        <div contenteditable="true">
          <h2 class="text-xs-center" v-html="data.title" id="title" ></h2>
          <p v-html="data.intro" id="intro"></p>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-flex sm6 mt-3 offset-sm-3>
        <div contenteditable="true">
          <h3 v-html='data.h3_1' id="h3_1"></h3>
          <p v-html="data.p1" id="p1"></p>
          <p v-html="data.p2" id="p2"></p>
          
        </div>
        <div contenteditable="true">
          <h3 v-html='data.h3_2' id="h3_2"></h3>
          <p v-html="data.p3" id="p3"></p>
          <p v-html="data.p4" id="p4"></p>
          
        </div>
        <div contenteditable="true">
          <h3 v-html="data.h3_3" id="h3_3"></h3>
          <p v-html="data.p5" id="p5"></p>
          <p v-html="data.p6" id="p6"></p>
          
        </div>
        <div contenteditable="true">
          <h3 v-html="data.h3_4" id="h3_4"></h3>
          <p v-html="data.p7" id="p7"></p>
          <p v-html="data.p8" id="p8"></p>
          
        </div>
        <div contenteditable="true">
          <h3 v-html="data.h3_5" id="h3_5"></h3>
          <p v-html="data.p9" id="p9"></p>
          <p v-html="data.p10" id="p10"></p>
          
        </div>
      </v-flex>
    </v-layout>
    <v-btn flat @click="$eventBus.$emit('prev', 2)" v-if="!saved && !manifestoData">Previous</v-btn>
    <v-btn color="primary" @click="create" v-if="!saved && !manifestoData" >Save</v-btn>
    <v-btn color="primary" @click="save" v-if="manifestoData" >Save changes</v-btn>
    <v-btn color="primary" :to="'/dashboard/manifesto/edit'" v-if="saved">Edit</v-btn>
  </v-container>
</template>
<script>
export default {
  data:()=>({
    saved:false,
    data:{
      title:'Five Point Agenda',
      intro:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      h3_1:'Dolor Sit Amet',
      h3_2:'Dolor Sit Amet',
      h3_3:'Dolor Sit Amet',
      h3_4:'Dolor Sit Amet',
      h3_5:'Dolor Sit Amet',
      p1:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p2:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p3:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p4:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p5:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p6:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p7:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p8:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p9:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',
      p10:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, rem suscipit? Quibusdam nesciunt non assumenda culpa explicabo cumque illum iure, similique molestias molestiae atque repellat placeat corrupti, maxime, ab ipsa.',

    },
    
  }),
  props:['selectedElection', 'manifestoData'],
  methods:{
    edit(){
      let data2 = {}
      let nodes = ['title','intro','h3_1','h3_2','h3_3','h3_4','h3_5','p1','p2','p3','p4','p5','p6','p7','p8','p9','p10',]
      let title = document.getElementById('')
      nodes.forEach(node=>{
        let foo = document.getElementById(node) ? document.getElementById(node).innerHTML : ''
        data2[node] = foo
      })
      console.log(data2)
      return data2
      //this.$eventBus.$emit('create', data2)
    },
    async create(){
        //this.$eventBus.$emit('Save_Template')
        api().post(`dashboard/newManifesto/${this.selectedElection._id}`, {
          token:this.$store.getters.getToken,
          template_data:{...this.edit()},
          template_name:'default',
          username:this.$store.getters.getUser.username
        }).then(result=>{
          console.log(result)
          alert('Your manifesto has been created successfully')
          this.saved = true
        }).catch(err=>{
          console.log(err)
        })
      
    },
    async save(){
      console.log('saving')
      api().post(`dashboard/editManifesto/${this.manifestoData._id}`, {
        token:this.$store.getters.getToken,
        username:this.$store.getters.getUser.username,
        template_data:{...this.edit()},
        template_name:'default',
      }).then(res=>{
        console.log(res)
        alert('Manifesto edited successfully')
      }).catch(err=>{
        console.log(err)
        alert('Sorry, something went wrong')
      })
    }
  },
  mounted(){
    this.manifestoData ? this.data = this.manifestoData.template_data : ''
    console.log(this.manifestoData)
  }
}
import api from '@/services/api'
</script>

