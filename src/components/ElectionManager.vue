<template>
  <div v-if="show_everything">
    <v-container grid-list-xs>
      <v-card flat dark class="pt-3" style="background:#1c1f35;">
        <v-layout align-center justify-center >
          <v-flex xs2 d-block style="background:yello;">
            <v-avatar :size="$vuetify.breakpoint.xs ? 60 : 120" color="grey lighten-4"  >
              <img :src="currElection.logo || `https://ui-avatars.com/api/?size=250&name=e+l`" alt="avatar">
            </v-avatar>
          </v-flex>
          <v-flex xs9 d-block>
            <h2 class="ml-3 mt-2 title text-capitalize">~ {{currElection.title}}</h2>
            <v-card-actions>
              <v-btn color="succes" class="text-capita" small flat>
                <strong>{{currElection.followers ? currElection.followers.length : ''}}</strong> &nbsp; Followers</v-btn>
              <v-btn color="succes" class="text-capita" small flat>0 Stars </v-btn>
              <!--v-tooltip>
                <v-btn slot="activator" color="success" class="text-capita ml-2" small outlin @click="follow" :disabled="disabled">{{'followText'}}</v-btn>
                <span>{{"followText == 'Following' ? 'You are following'  : 'Follow"}} {{user.name | capitalize}}</span>
              </v-tooltip-->
            </v-card-actions>
            <v-card-actions>
              <small class="pl-2 grey--text"><v-icon size="12">access_time</v-icon> Created at: {{currElection.dateCreated}}</small>
              <small class="ml-2 grey--text"><v-icon size="12">timer</v-icon> Start time: {{currElection.startDate}} | {{currElection.startTime}}</small>
              <small class="ml-2 grey--text"><v-icon size="12">bookmark</v-icon> Status: ended</small>
            </v-card-actions>
            
          </v-flex>
        </v-layout>
        <v-layout mt-4>
          <v-flex xs12>
            <v-toolbar flat color="grey" style="background:#1c1f35;" dense dark>
              
                <v-btn flat small exact depressed :to="`/dashboard/elections/manage/${electionId}`" color="default">Overview</v-btn>
                <v-btn flat small depressed :to="`/dashboard/elections/manage/${electionId}/broadcasts`">Broadcasts</v-btn>
                <v-btn flat small depressed :to="`/dashboard/elections/manage/${electionId}/payments`" v-if="!$vuetify.breakpoint.xs">Payments</v-btn>
                <v-btn flat small depressed :to="`/dashboard/elections/manage/${electionId}/settings`" v-if="!$vuetify.breakpoint.xs">Settings</v-btn>
           
              <v-spacer></v-spacer>
              <v-btn color="secondary" :to="`/dashboard/elections/watch/${currElection.electionId}`" v-if="!$vuetify.breakpoint.xs">Vote</v-btn>
              
              <v-menu offset-y v-if="$vuetify.breakpoint.xs">
                <v-btn slot="activator" icon><v-icon>menu</v-icon></v-btn>
                <v-list>
                  <v-list-tile class='text-capitalize' :to="`/dashboard/elections/manage/${electionId}/${item}`" v-for="item in ['payments','settings']" :key="item">
                    
                      {{ item }}
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
    
    <router-view :currElection='currElection' :contestants='contestants' :regVoters='regVoters' :tabledata='table_data' />

  </div>
</template>
<script>
export default {
  data:()=>({
    show_everything:false,
    disabled:false, // disables the follow btn
    currElection:{},
    contestants:[],
    regVoters:[],
    currUser:{},
    table_data:[]
  }),
  components:{
    EditElection,
  },
  props:['electionId'],
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.setUp()
    }
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      let arr = []
      value.split(' ').map((item,index)=>
        arr.push(item.charAt(0).toUpperCase() + item.slice(1))
      )
      return arr.toString().split(',').join(' ')
    }
  },
  computed:{
    filteredList() {
      if(this.regVoters){
        return this.regVoters.filter(voter => {
          return voter.name.toLowerCase().includes(this.search_voters.toLowerCase())
        })
      }
    },
   followText(){
     return this.user.followers.indexOf(this.currUser._id) == -1 ? '+ Follow' : 'Following'
   }
  },
  methods:{
    async follow(){
      if(this.user.followers.indexOf(this.currUser._id) == -1){
        // not following user, follow this user
        this.disabled = true
        this.user.followers.push(this.currUser._id)
        await api().post(`dashboard/followContestant/${this.user._id}/${this.currUser._id}`, {
          token:this.$store.getters.getToken
        })
        this.disabled = false
      }
      else{
        // is following the user, unfollow
        this.disabled = true
        await api().post(`dashboard/unfollowContestant/${this.user._id}/${this.currUser._id}`, {
          token:this.$store.getters.getToken
        })
        this.user.followers.splice(this.user.followers.indexOf(this.currUser._id),1)
        this.disabled = false
      }
    },
    async setUp(){
      try {
        let res = await api().post(
          `dashboard/getId/${this.$route.params.electionId}`,
          {token:this.$store.getters.getToken}
        )
        this.currElection = res.data
        this.regVoters = res.data.regVoters
        
        // DON'T SHOW ANYTHING IF THE USER IS NOT THE ADMIN OF THE ELECTION
        this.currElection ? 
        this.currElection.admin._id == this.$store.state.logged_in_user._id ? 
        this.show_everything = true : false : ''
        //this.show_everything = true

        let contestants = await api().post(
          `dashboard/getContestants/${this.currElection._id}`,
          {token:this.$store.getters.getToken}
        )
        this.contestants = contestants.data
        

        // set the contestants table data
        this.table_data = [] // to prevent multiple pushings
        this.contestants.forEach(cont=>{
          let myObj = {
            value:false,
            name:cont.userId.name,
            role:cont.role,
            department:cont.userId.department,
            faculty:cont.userId.faculty,
            others:'Others'
          }
          this.table_data.push(myObj)
        })

        let activities = await api().post(`dashboard/latestActivities/${this.currElection._id}`, {
          token:this.$store.getters.getToken
        })
        console.log(activities)

        console.log(this.$store.state.logged_in_user._id,res.data.admin._id)
        console.log(this.currElection,this.contestants,this.regVoters)
        
      } catch (error) {
        console.log(error)
        if(error){}
      }
    }
  },
  async mounted(){
    try {
      await this.setUp()

    } catch (error) {
      console.log(error)
    }
    
  }
}
import api from '@/services/api'
  import EditElection from '@/components/EditElection'
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;
  .v-dialog--fullscreen{
    background:#fff !important;
  }

   /* --scrollbar --*/
  .scrollbar::-webkit-scrollbar {
      width: 10px;
      background-color: #d7d7df ;
      @include borderRadius(5px)
    }
  .scrollbar::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #d7d7df ;
    @include borderRadius(5px)
  }
  .scrollbar::-webkit-scrollbar-thumb {
    background-color:#87899c ;
    @include borderRadius(5px);
  }
</style>
