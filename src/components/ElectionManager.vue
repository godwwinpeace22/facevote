<template>
  <div>
    <vue-headful
      :title="title"
    />

    <navigation>
      <span slot="title">Dashboard</span>
      <v-toolbar slot="extended_nav" color="teal" dark flat
        style='background-color:#29648a;' dense>
        <v-tabs v-model="model" color="teal" slider-color="yellow">
          <v-tab
            v-for="item in ['Overview','Broadcasts','Payments']"
            :key="item"
            :href="`#${item}`"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        
        <!--v-menu offset-y>
          <v-btn icon slot="activator"
            v-show="$vuetify.breakpoint.mdAndUp">
            <v-icon size="30">menu</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="media_dialog = true">
              <v-list-tile-title>Media files</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu-->
        
      </v-toolbar>
    </navigation>

    <div>
      <!--v-container grid-list-xs>
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
                
                  <v-btn flat small exact depressed :to="`/elections/manage/${electionId}`" color="default">Overview</v-btn>
                  <v-btn flat small depressed :to="`/elections/manage/${electionId}/broadcasts`">Broadcasts</v-btn>
                  <v-btn flat small depressed :to="`/elections/manage/${electionId}/payments`" v-if="!$vuetify.breakpoint.xs">Payments</v-btn>
                  <v-btn flat small depressed :to="`/elections/manage/${electionId}/settings`" v-if="!$vuetify.breakpoint.xs">Settings</v-btn>
            
                <v-spacer></v-spacer>
                <v-btn color="secondary" :to="`/elections/watch/${currElection.electionId}`" v-if="!$vuetify.breakpoint.xs">Vote</v-btn>
                
                <v-menu offset-y v-if="$vuetify.breakpoint.xs">
                  <v-btn slot="activator" icon><v-icon>menu</v-icon></v-btn>
                  <v-list>
                    <v-list-tile class='text-capitalize' :to="`/elections/manage/${electionId}/${item}`" v-for="item in ['payments','settings']" :key="item">
                      
                        {{ item }}
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-toolbar>
            </v-flex>
          </v-layout>
        </v-card>
      </v-container-->

      <v-tabs-items v-model="model">
        <v-tab-item value="Overview">
          <overview></overview>
        </v-tab-item>
        <v-tab-item value="Broadcasts">
          <broadcasts ></broadcasts>
        </v-tab-item>
        <v-tab-item value="Payments">
          <payments></payments>
        </v-tab-item>
        <!--v-tab-item value="Settings">
          <settings></settings>
        </v-tab-item-->
      </v-tabs-items>
      
    </div>
  </div>
</template>
<script>
export default {
  data:()=>({
    title:'Election Manager | Facevote',
    show_everything:false,
    model:'Overview',
  }),
  components:{
    EditElection,
    Navigation,
    Overview,
    Broadcasts,
    Settings,
    Payments
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
    
  },
  async mounted(){
    try {
      

    } catch (error) {
      console.log(error)
    }
    
  }
}
import api from '@/services/api'
  import EditElection from '@/components/EditElection'
  import Navigation from '@/components/Navigation'
  import Broadcasts from '@/components/manager/Manager__broadcasts'
  import Overview from '@/components/manager/Manager__overview'
  import Payments from '@/components/manager/Manager__payments'
  import Settings from '@/components/manager/Manager__settings'
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
