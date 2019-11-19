<template>
  <div class="">
    
    <v-card flat tile outlined min-width="100%" class="forum-members pt-4">
      
      <v-text-field hide-details dense v-model="search"
        prepend-inner-icon="mdi-account-search" color="primary"
        label="Search members..." class="mb-3 px-1" outlined
      ></v-text-field>
      <!-- <v-divider></v-divider> -->

      <template v-for="member in filteredList">
        <v-avatar @click="$helpers.openProfile($event, member)"
          :color="$helpers.colorMinder(member.name.charAt(0))" 
          size="35" tile
          class="ma-1 round-1 linkify" 
          :key="member.uid" :id="member.uid">

          <img :src="member.photoURL" v-if="member.photoURL">
          <span v-else class="white--text headline">{{member.name.charAt(0)}}</span>
        </v-avatar>
      </template>
      
    </v-card>
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
    isLastDoc: false,
    loading_more_members: false,
    profile_menu: false,
    selected_profile: {},
  }),
  props:['members', 'thisGroup', 'suspended'],
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
    forumId(){
      return this.$route.params.forumId
    }
  },
  methods:{
    nextDocs(lastUser){
      
      this.loading_more_members = true
      db.collection('moreUserInfo').doc(lastUser.uid).get().then(documentSnapshot => {
        let lastVisible = documentSnapshot;
        
        db.collection("moreUserInfo")
          .where('enrolled','array-contains', this.thisGroup.electionId)
          .startAfter(lastVisible)
          .limit(10).get().then(docs=>{
            docs.forEach(doc=>{
              
              let isSuspended = this.suspended.voters && !!this.suspended.voters.find(uid => doc.data().uid == uid)
              if(!isSuspended){

                this.members.push(doc.data())
              }
            })

            this.loading_more_members = false
            
            if(docs.empty){
              this.isLastDoc = true
            }
          }).catch(err=>{
            // console.log(err)
          })
      })
    },
    checkProfile(){
      this.$eventBus.$emit('show_right_sidebar','profile');
    },
    getRole(member){ // return the role a user is contesting for
      if(member.contestsRef){
        let found = member.contestsRef.find(contest=>contest.electionRef == this.thisGroup.electionId)
        //console.log(res)
        return found ? this.thisGroup.roles.find(role => role.value == found.role).title : false
      }else{
        return false
      }
    },
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
import {firebase, db, database} from '@/plugins/firebase'
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
  .online_badge{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
  }

.forum-members {
  // width: 100%;
  height: calc(100vh - 102px);
}

.navdrawr {
  width: 100%;
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
