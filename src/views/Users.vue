<template>
  <div>
    <v-container grid-list-md>
      <v-card flat dark class="pt-3" style="background:#1c1f35;">
        <v-layout align-center justify-center >
          <v-flex xs2 d-block style="background:yello;">
            <v-avatar :size="$vuetify.breakpoint.xs ? 50 : 100" color="grey lighten-4"  >
              <img :src="user.imgSrc || `https://ui-avatars.com/api/?size=250&name=${user.name}`" alt="avatar">
            </v-avatar>
          </v-flex>
          <v-flex xs9 d-block>
            <h2 class="ml-3 mt-2 title text-capitalize">~ {{user.name}}</h2>
            <v-card-actions>
              <v-btn color="succes" class="text-capita" small flat :to="`/users/${user.username}/followers`">
                <strong>{{user ? user.followers.length : ''}}</strong> &nbsp;Followers</v-btn>
              <v-btn color="succes" class="text-capita" small flat :to="`/users/${user.username}/following`">0 Following </v-btn>
              <v-tooltip top v-if="user.username != currUser.username">
                <v-btn slot="activator" color="success" class="text-capita ml-2" small outlin @click="follow" :disabled="disabled">{{followText}}</v-btn>
                <span>{{followText == 'Following' ? 'You are following'  : 'Follow'}} {{user.name | capitalize}}</span>
              </v-tooltip>
            </v-card-actions>
            
          </v-flex>
        </v-layout>
        <v-layout mt-4 row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white"  tabs dense light>
              <v-btn small flat depressed class="text-capitalize" exact :to="`/users/${user.username}`" 
                >
                Overview
              </v-btn>

              <v-btn small flat depressed class='text-capitalize'
                :to="`/users/${user.username}/manifesto`">
                Manifesto
              </v-btn>

              <v-btn small flat depressed class='text-capitalize ' v-show="$vuetify.breakpoint.smAndUp" :to="`/users/${user.username}/${item}`" 
                v-for="item in 
                ['broadcasts','payments','preferences']" :key='item'>
                {{item}}
              </v-btn>
              
              
              <v-spacer class="hidden-xs-and-down"></v-spacer>
              <v-btn color="secondary" v-show="$vuetify.breakpoint.smAndUp" @click.native="$eventBus.$emit('show_profile_settings', {})" 
                v-if="user.username == $store.getters.getUser.username" 
                depressed >Edit profile
              </v-btn>

              <v-menu offset-y v-show="$vuetify.breakpoint.xsOnly">
                <v-btn slot="activator" icon><v-icon>menu</v-icon></v-btn>
                <v-list>
                  <v-list-tile class='text-capitalize' :to="`/users/${user.username}/${item}`" v-for="item in ['broadcasts','payments','preferences']" :key="item">
                    
                      {{ item }}
                  </v-list-tile>
                </v-list>
              </v-menu>
              
              
            </v-toolbar>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
    
    <!-- views -->
    <router-view :myContests='myContests' :user='user' :broadcasts='broadcasts' />
    
  </div>
</template>
<script>
export default {
  data:()=>({
    hide:true,
    follower_tab:1,
    user:'', // users profile
    about_user:[
      'name','email','phone','school','faculty','department'
    ],
    currUser:'', // the curr loggedin user
    followers_id_list:[],
    myElections:[],
    myContests:[],
    broadcasts:[],
    disabled:false, // disables the follow btn
    user_tabs_model:'overview'
  }),
  props:['username'],
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
    },
    lowercase:function(value){
      if (!value) return ''
      value = value.toString()
      return value.toLowercase
    }
  },
  computed:{
   followText(){
     return this.followers_id_list.indexOf(this.currUser._id) == -1 ? '+ Follow' : 'Following'
   },
   lowercase(val){
     return val.toUpperCase
   }
  },
  methods:{
    async follow(){
      if(this.followers_id_list.indexOf(this.currUser._id) == -1){
        // not following user, follow this user
        this.disabled = true
        this.followers_id_list.push(this.currUser)
        this.user.followers.push(this.currUser)
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
        this.followers_id_list.splice(this.user.followers.indexOf(this.currUser._id),1)
        this.user.followers.splice(this.user.followers.indexOf(this.currUser._id),1)
        this.disabled = false
      }
    },
    async setUp(){
      try {
        let user,currUser,elections,broadcasts;
        api().post(`dashboard/getPopUser/${this.username}`, {
          token:this.$store.getters.getToken
        }).then(user=>{
          this.user = user.data
          user.data.followers.forEach(fol=>{
            this.followers_id_list.push(fol._id)
          })
        })

        elections = await api().post(`dashboard/getElections/${this.username}`, {
          token:this.$store.getters.getToken
        })

        broadcasts = await api().post(`dashboard/getbroadcasts`, {
          token:this.$store.getters.getToken,
          by:this.$store.state.logged_in_user._id,
        })

        this.currUser = this.$store.state.logged_in_user
        //this.user = user.data
        this.myElections = elections.data
        this.myContests = elections.data.contested
        this.broadcasts = broadcasts.data
        console.log(this.myElections,this.currUser,this.user,broadcasts)
      } catch (error) {
        console.log(error)
        if(error){}
      }
    }
  },
  async mounted(){
    try {
      this.setUp()
      this.$eventBus.$on('Create_Broadcast_Resp', (data)=>{
        this.broadcasts.push(data)
      })

    } catch (error) {
      console.log(error)
    }
    
  }
}
import api from '@/services/api'
</script>

<style lang="scss" >
@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;
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
