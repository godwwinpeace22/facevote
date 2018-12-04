<template>
  <div id="forum_users" style="height: calc(100% - 50px);overflow-y:auto;" class="navdrawr">
    <v-list dense class="">
      <v-list-tile @click.stop="'a'">
        <v-list-tile-content>
          <v-text-field hide-details v-model="search"
            prepend-icon="search"
            label="Search users..."
          ></v-text-field>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <div style="height:calc(100% - 50px);overflow-y:auto;" class="navdrawr">
      <v-list subheader dense two-line>
        <!--v-subheader>Recent chat</v-subheader-->
        <v-list-tile v-for="voter in filteredList" :key="voter._id" avatar :to="$route.params.electionId + '/profile/' + voter.username">
          <v-list-tile-avatar>
            <!-- prefer to user loggedin user's info rather than his info from voters list -->
            <img :src="getSrc(voter)">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title class="text-capitalize">{{getName(voter)}}</v-list-tile-title>
            <v-list-tile-sub-title v-if="getRole(voter)"><i>for</i> {{getRole(voter)}}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon :color="checkIfOnline(voter.username)">lens</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>
    </div>
  </div>
</template>
<script>
export default {
  data:()=>({
    search:'',
    drawerRight: true,
    right: null,
    left: null,
    right_sidebar:true,
    items2: [
      { title: 'Travis Howard', avatar: 'https:cdn.vuetifyjs.com/images/lists/5.jpg' }
    ]
  }),
  props:['regVoters', 'contestants'],
  computed: {
    filteredList() {
      if(this.regVoters){
      return this.regVoters.filter(voter => {
        return voter.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
    }
  },
  methods:{
    checkProfile(){
      this.$eventBus.$emit('show_right_sidebar','profile');
    },
    getSrc(voter){
      // doing this so that when there is a profile update, the reactive user data will be updated here
      return voter.username == this.$store.getters.getUser.username ? this.$store.getters.getUser.imgSrc : 
      voter.imgSrc || `https://ui-avatars.com/api/?name=${voter.name}`
    },
    getName(voter){
      // doing this so that when there is a profile update, the reactive user data will be updated here
      let me = this.$store.getters.getUser
      return voter.username == me.username ? me.name : voter.name
    },
    getRole(voter){ // return the role a user is contesting for
      for(let cont of this.contestants){
        if(cont.userId.username == voter.username){
          return cont.role
          break;
        }
        //else return null
      }
    },
    checkIfOnline(username){
      let those_online = this.$store.state.those_online
      let found = those_online.find(data => data.username == username)
      return found ? 'success' : 'grey'
    },
  },
  async mounted(){
    //console.log(this.regVoters)
    //setInterval(function(){
    //  this.filteredList()
    //}, 4000)
  },

  destroyed(){
    //this.$eventBus.$emit('show_right_sidebar',null);
  },
  components:{
  }
}
import api from '@/services/api'
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
    width: 10px;
    background-color: #87899c ;
    @include borderRadius(10px)
  }
.navdrawr::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #f5f6fa ;
  @include borderRadius(10px)
}
.navdrawr::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
