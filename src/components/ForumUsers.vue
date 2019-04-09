<template>
  <div id="forum_users" style="height:100%;overflow-y:auto;" class="navdrawr pb-2">
    <v-container grid-list-xs fluid v-if='members.length == 0'>
      <v-layout>
        <v-flex xs12>
          <div style="height:100%">
            <v-layout align-center justify-center fill-height>
              <v-progress-circular indeterminate color="grey lighten-2"></v-progress-circular>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  
    <v-list dense class="">
      <v-list-tile @click.stop="'a'">
        <v-list-tile-content>
          <v-text-field hide-details v-model="search"
            prepend-icon="search" color="secondary"
            label="Search members..."
          ></v-text-field>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <div style="height:calc(100% - 50px);overflow-y:auto;" class="navdrawr" :class="{thin_scrollbar:$vuetify.breakpoint.smAndDown}">
      <v-list subheader dense two-line>
        <v-subheader v-show="filteredList.length == 0">No results found</v-subheader>
        <v-list-tile v-for="member in filteredList" :key="member.uid" avatar :to="'forum/profile/' + member.email">
          
          <v-list-tile-avatar>
            <!-- prefer to user loggedin user's info rather than his info from voters list -->
            <img :src="member.photoURL" v-if="member.photoURL">
            <v-avatar v-else :color="$helpers.colorMinder(member.name.charAt(0))" size="40">
              <span class="white--text headline">{{member.name.charAt(0)}}</span>
            </v-avatar>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title class="text-capitalize">{{member.name}}</v-list-tile-title>
            <v-list-tile-sub-title v-if="getRole(member)"><i>for</i> {{getRole(member)}}</v-list-tile-sub-title>
            <v-list-tile-sub-title v-else>{{member.dept}}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon :color="member.online ? 'success' : 'grey'" small>lens</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-btn color="teal" dark small depressed @click="nextDocs(members[members.length -1])" v-if="members.length >= 25">See more..</v-btn>
      
    </div>
  </div>
</template>
<script>
export default {
  data:()=>({
    search:'',
    //onlineMembers:[],
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar:true,
  }),
  props:['members', 'thisGroup'],
  computed: {
    filteredList() {
      // console.log(this.members)
      if(this.members && this.members.length > 0){
        //console.log(this.members)
        // let those online appear first, at the top
        let online = []
        let offline = []
        this.members.forEach(m=>{
          m.online ? online.push(m) : offline.push(m)
        })

        let sortedByOnline = [...online, ...offline]
        return sortedByOnline.filter(member => {
          return member.name.toLowerCase().includes(this.search.toLowerCase())
        })
      }
      else{return []}
    },
    // Mix your getter(s) into computed with the object spread operator
    ...mapGetters([
      'getUser'
    ]),
  },
  methods:{
    nextDocs(lastVisible){
      db.collection("moreUserInfo")
        .where('enrolled','array-contains', this.thisGroup.electionId)
        .startAfter(lastVisible)
        .limit(25).get().then(docs=>{
          docs.forEach(doc=>{
            //console.log(doc.id, " => ", doc.data());
            this.members.push(doc.data())
          })
        }).catch(err=>{
          console.log(err)
        })
    },
    checkProfile(){
      this.$eventBus.$emit('show_right_sidebar','profile');
    },
    /*isOnline(userId){
      console.log(userId,this.onlineMembers)
      return this.onlineMembers.find(memberId => memberId == userId) ? 
      true : false
    },*/
    getRole(member){ // return the role a user is contesting for
      if(member.contestsRef){
        let found = member.contestsRef.find(contest=>contest.electionRef == this.thisGroup.electionId)
        //console.log(res)
        return found ? this.thisGroup.roles.find(role => role.value == found.role).title : false
      }else{
        return false
      }
    },
    /*checkIfOnline(username){
      let those_online = this.$store.state.those_online
      let found = those_online.find(data => data.username == username)
      return found ? 'success' : 'grey'
    },*/
  },
  async mounted(){
    // console.log(this.members)
  },

  destroyed(){
    //this.$eventBus.$emit('show_right_sidebar',null);
  },
  components:{
  }
}
//import api from '@/services/api'
import {mapGetters} from 'vuex'
</script>

<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;

  .menu_tabs{
    .v-tabs__div{
      text-transform:capitalize
    }
    .v-list__tile{
      font-size: 14px;
    }
  }
  #online_badge{
    display: inline-block;
    background: green;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
  }

  /* --style the scrollbar --*/
.navdrawr::-webkit-scrollbar {
    width: 8px;
    background-color: #87899c ;
    @include borderRadius(10px)
  }
  .thin_scrollbar::-webkit-scrollbar{
    width: 2px;
  }
.navdrawr::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #fff ;
  // @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
