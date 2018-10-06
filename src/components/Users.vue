<template>
  <div>
  <v-list subheader dense>
    <v-subheader>Recent chat</v-subheader>
    <v-list-tile v-for="voter in $store.state.curRoom.regVoters" :key="voter._id" avatar :to="'forum/profile/' +voter.username">
      <v-list-tile-avatar>
        <img :src="'https://api.adorable.io/avatars/285/' + voter.username + '@adorable.png'">
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title v-html="voter.name"></v-list-tile-title>
      </v-list-tile-content>

      <v-list-tile-action>
        <v-icon :color="checkIfOnline(voter._id)">chat_bubble</v-icon>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>

  <v-divider></v-divider>

  <v-list subheader dense>
    <v-subheader>Previous chats</v-subheader>

    <v-list-tile v-for="item in items2" :key="item.title" avatar to="/item.title">
      <v-list-tile-avatar>
        <img :src="'https://api.adorable.io/avatars/285/' + item.title + '@adorable.png'">
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title v-html="item.title"></v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
  </div>
</template>
<script>
export default{
  data:()=>({
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar:true,
    items2: [
      { title: 'Travis Howard', avatar: 'https:cdn.vuetifyjs.com/images/lists/5.jpg' }
    ]
  }),
  methods:{
    checkProfile(){
      this.$eventBus.$emit('show_right_sidebar','profile');
    },
    checkIfOnline(userId){
      let those_online = this.$store.state.those_online
      //console.log(this.those_online)
      let foo = []
      those_online.forEach(data=>{
        if(data.user == userId){
          foo.push(true)
          //console.log(data.user)
        }
      })

      // using foo[0] bcs we know that the user can only appear once 
      // in the 'those_online' list, the only one not eventually filtered out, and therefore found at the zero
      return foo[0] == true ? 'teal' : 'grey' 
    }
  },
  async mounted(){
    
  },

  destroyed(){
    //this.$eventBus.$emit('show_right_sidebar',null);
  },
  components:{
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VTextField,
    ...VSelect,
    ...VSwitch,
    ...VDatePicker,
    ...VTimePicker,
    ...VDialog,
    ...VStepper,
    ...VSlider,
    ...VChip,
    ...VForm
  }
}
import api from '@/services/api'
import { promisfy } from "@/helpers/promisify";
import * as VCard from 'vuetify/es5/components/VCard'
import * as VAvatar from 'vuetify/es5/components/VAvatar'
import * as VSubheader from 'vuetify/es5/components/VSubheader'
import * as VDivider from 'vuetify/es5/components/VDivider'
import * as VTabs from 'vuetify/es5/components/VTabs'
import * as VMenu from 'vuetify/es5/components/VMenu'
import * as VTooltip from 'vuetify/es5/components/VTooltip'
import * as VTextField from 'vuetify/es5/components/VTextField'
import * as VSelect from 'vuetify/es5/components/VSelect'
import * as VSwitch from 'vuetify/es5/components/VSwitch'
import * as VDatePicker from 'vuetify/es5/components/VDatePicker'
import * as VTimePicker from 'vuetify/es5/components/VTimePicker'
import * as VDialog from 'vuetify/es5/components/VDialog'
import * as VStepper from 'vuetify/es5/components/VStepper'
import * as VSlider from 'vuetify/es5/components/VSlider'
import * as VChip from 'vuetify/es5/components/VChip'
import * as VForm from 'vuetify/es5/components/VForm'
</script>

<style lang="scss" scoped>
  .menu_tabs{
    .v-tabs__div{
      text-transform:capitalize
    }
    .v-list__tile{
      font-size: 14px;
    }
  }
</style>
