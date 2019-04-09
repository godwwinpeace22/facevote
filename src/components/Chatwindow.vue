<template>
  <loading-bar v-if='loading_messages'>
    <v-subheader slot='loading_info' class='d-block mx-auto' style='width:fit-content;'>Loading messages...</v-subheader>
  </loading-bar>

  
  <div v-else style="background:#fff;" class="pa-0 px-1 chat_home chat_space" id="chat_home">
    <v-snackbar v-model="snackbar.show" :timeout="5000" :color="snackbar.color" 
      class="white--text" top right>
      {{snackbar.message}} 
      <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>

    <!-- NO DATA -->
    <v-subheader class="text-xs-center" v-if="!getChatMessages || getChatMessages.length == 0">No recent messages</v-subheader>

    <div flat pa-0 id="chat_space" v-on:scroll="scroll" class="chat_space thick_scrollbar" :class="{thin_scrollbar:$vuetify.breakpoint.smAndDown}">
      
      <div id="chat_space_content" v-if="getChatMessages.length > 0">
        <div v-for="(msg,i) in getChatMessages" :key="i">

          <!-- DATE DIVIDER -->
          <div v-if="divide(msg.tstamp, getChatMessages[i-1])" style="background:oldlace;font-weight:bold;text-align:center;">
            {{divide(msg.tstamp, getChatMessages[i-1])}}
          </div>
          <div class="chat_rectangle ">
            <div class="chat_avartar">
              <v-avatar
                size="40" tile
                :color="$helpers.colorMinder(msg.onr.name.charAt(0))"
              >
                <img v-if="msg.onr.photoURL" :src="msg.onr.photoURL" alt="alt">
                <span v-else class="white--text">{{msg.onr.name.charAt(0)}}</span>
              </v-avatar>
            </div>
            
            <div class="chat_content">
              <div style="width:100%;margin-top:0px;margin-bottom:0px;">
                <span class="text-capitalize" v-if="msg.onr.uid != getUser.uid " style="font-size:15px;margin-right:5px;">
                  <a class="black--text font-weight-bold" @click.prevent="$router.push(`/forum/profile/${msg.onr.email}`); 
                    $eventBus.$emit('Toggle_drawerRight', true)">
                  {{msg.onr.name}}</a>
                </span>
                <span v-else style="margin-right:5px;" class="font-weight-bold"><strong>You  </strong></span>
                <span style="font-size:.83em;color:#555;" color="grey lighten-5">
                  {{$helpers.parseDate(msg.tstamp)}}
                </span>
              </div>
              
              <div style="width:100%;">

                <!-- the spice of life -->
                <template v-for="item in msg.body.split(' ')">
                  
                  <router-link event="" @click.native.prevent="goto(item,msg.elecRef)" 
                    v-if="item.charAt(0) == '@'" 
                    :to="'/forum/profile/' + item.slice(1)" :key="item">
                    @{{findAMember(item.slice(1))}}
                  </router-link>

                  <router-link v-else-if="item.charAt(0) == '#'" :to="item" append :key="item">{{item}} </router-link>

                  <template v-else>{{item}} </template>

                </template>
                
                <!-- ACTIONS FOR ADMINS OR MODERATORS -->
                <div id="moderator_actions" v-if="isModerator(getUser.uid)">
                  <v-menu offset-y>
                    <v-btn flat icon slot="activator">
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list dense>
                      <v-list-tile @click="deleteMessage(msg)">
                        <v-list-tile-title>Delete this message</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  
                </div>

                <!-- UPLOADED IMAGES -->
                <v-container grid-list-md v-if="msg.imgs">
                  <v-layout row wrap>
                    <v-flex v-for="(image,i) in msg.imgs" :key="i"
                      :class="{'xs3': msg.imgs.length >=3,'xs12': msg.imgs.length == 1,'xs6': msg.imgs.length == 2}">
                      <v-card class="mb-1" flat id="msg_img"
                        max-height="500px" :height="msg.imgs.length == 1 ? 'initial' : $vuetify.breakpoint.xsOnly ? 100 : '200'">
                        <v-img :src='image' :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`" height="100%" max-height="500px" @click="carouselDialog(msg.imgs,i)">
                          <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                          </v-layout>
                        </v-img>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </div>
              
              <div class="show_reactions">
                <div class="reactions">
                  <v-btn icon small @click="add_reaction(msg,'like')">
                    <img alt="Thumbs Up" width=30 height=30 src="@/assets/thumbs-up.gif">
                  </v-btn>
                  <v-btn icon small @click="add_reaction(msg,'love')">
                    <v-icon color="red">favorite</v-icon>
                  </v-btn>
                  <v-btn icon small @click="add_reaction(msg,'haha')">
                    <span class="emojis">😃</span>
                  </v-btn>
                  <v-btn icon small @click="add_reaction(msg,'wow')">
                    <span class="emojis">😲</span>
                  </v-btn>
                  <v-btn icon small @click="add_reaction(msg,'angry')">
                    <span class="emojis">😣</span>
                  </v-btn>
                  <v-btn icon small @click="add_reaction(msg,'excited')">
                    <img alt="Big Dancing Banana" width=20 height=20 src="@/assets/dancing-banana.gif">
                  </v-btn>
                </div>
                <v-tooltip bottom>
                  <v-btn icon small slot="activator">
                    <v-icon color="success">mood</v-icon>
                  </v-btn>
                  <span>Add reactions</span>
                  
                </v-tooltip>
              </div>
              <div style="display:inline-block;">
                <v-btn icon small @click="add_reaction(msg,'like')" v-show="msg.reactions.like > 0">
                  {{msg.reactions.like}}<img alt="Thumbs Up Hand Gesture" width=30 height=30 src="@/assets/thumbs-up.gif">
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'love')" v-show="msg.reactions.love > 0">
                  {{msg.reactions.love}}<v-icon color="red">favorite</v-icon>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'haha')" v-show="msg.reactions.haha > 0">
                  {{msg.reactions.haha}}<span class="emojis">😃</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'wow')" v-show="msg.reactions.wow > 0">
                  {{msg.reactions.wow}}<span class="emojis">😲</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'angry')" v-show="msg.reactions.angry > 0">
                  {{msg.reactions.angry}}<span class="emojis">😣</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'excited')" v-show="msg.reactions.excited > 0">
                  {{msg.reactions.excited}}<img alt="Big Dancing Banana" width=20 height=20 src="@/assets/dancing-banana.gif">
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

export default {
  data:()=>({
    password: 'Password',
    show_reactions:false,
    reactions: {}, // temp holds reactions for quick feedback
    snackbar:{},
    carousel_dialog:false,
    carousel_images:[],
    onboarding:0,
    drawer: null,
    message: 'Hey!',
    chat_messages:[],
    basemsgs:[],
    marker: true,
    iconIndex: 0,
    offset: '',
    loading_more_msgs: false,
    menu:false,
    chat:'',
    fab:true,
    curr_date:null,
    loading_messages:true,
  }),
  props:['members','room','thisGroup'],
  watch:{
    room: function(e){
      //console.log(e)
      this.loading_messages = true // it will set if off when its done
      this.chatUpdate()
    }
  },
  computed: {
    icon () {
      return this.icons[this.iconIndex]
    },
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getChatMessages'
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ])
  },

  methods: {
    carouselDialog(images,index){
      this.$eventBus.$emit('Open_Image_Gallery', {
        images, index
      })
    },
    scroll(e){
      console.log(e)
    },
    findAMember(memberEmail){
      let member = this.members.find(member=> member.email == memberEmail)
      return member ? member.name : memberEmail
    },
    getRep(chat){
      return chat.replace(/@([\w]+)/g,'<router-link to="/tag/$1">#$1</router-link>')
    },
    goto(item,room){
      console.log(item,room)
      if(this.members.find(member => member.email == item.slice(1))){
        this.$router.push(`/forum/profile/${item.slice(1)}`)
        this.$eventBus.$emit('Toggle_drawerRight', true)
      }
      else{}
      
    },
    deleteMessage(msg){
      // Delete an inappropriate msg
      db.collection('chat_messages').doc(msg.docId)
      .delete().then(done=>{
        this.snackbar = {show:true,message:'Message deleted',color:'dark'}
      }).catch(err=>{
        this.snackbar = {show:true,message:'Something went wrong',color:'error'}
      })
    },
    isModerator(userId){
      //console.log(userId,this.thisGroup.moderators)
      let found = this.thisGroup.moderators ?
      this.thisGroup.moderators.find(id => id == userId) : false
      //console.log(found,this.thisGroup)
      return found ? true : false
    },
    divide(timestamp,prev){
      let options = {year: 'numeric', month: 'numeric', day: 'numeric' };
      let then = new Date(timestamp)
      let that_day = then.toLocaleString("en-US",options)
      let that_day2 = then.toLocaleString('en-Us', {
          year:'numeric', month:'short', weekday:'short', day:'numeric'
        })

      if(prev && prev.tstamp){
        // for msg other than the first. If the previous date is same as the cur date return false
        if((new Date(prev.tstamp)).toLocaleString("en-US", options) == that_day){
          return false
        }
        else{
          // else return true (the previous date is different from the cur date, hence its another day)
          let today = new Date()
          if((new Date()).toLocaleString('en-Us',options) == that_day){
            return 'Today'
          }
          // showing 'yesterday'
          else if(Date.now() - timestamp <= 2* 24 * 60 * 60 * 1000){
            return 'Yesterday'
          }
          // showing other days
          else{
            return that_day2
          }
          
          
        }
      }
      else{ // for the very first msg
        // if today's date is same with message's date return 'today' else show that date
        return (new Date()).toLocaleString('en-Us',options) == that_day ? 'Today' : that_day2
      }
    },
    async add_reaction(msg,reaction){
      try {
        let msg_rxns_clone = Object.assign({}, msg.reactions) // bcs of Javascript's Object reassignment issues
        console.log(msg_rxns_clone)
        console.log(msg,reaction)
        let docId = `${this.getUser.uid}-${msg.docId}-crxn`
        let reactionsRef = db.collection('chat_reactions').doc(docId)
        let chatRef = db.collection('chat_messages').doc(msg.docId)

        if(this.reactions[msg.docId]){
          // reaction already exists for the msg
          if(this.reactions[msg.docId] == reaction){
            // user already reacted same way before, e.g liked already
            msg.reactions[reaction] = msg.reactions[reaction] > 0 ? msg.reactions[reaction] - 1 : 0
            this.reactions[msg.docId] = null
          }
          else{
            msg.reactions[reaction] += 1
            this.reactions[msg.docId] = reaction
          }
        }
        else{
          msg.reactions[reaction] += 1
          this.reactions[msg.docId] = reaction
        }
        
        reactionsRef.get().then(doc => {
          console.log(msg.reactions)
          if(doc.exists){
            if(doc.data().reaction == reaction){
              // user already reacted same way before, e.g liked already
              msg_rxns_clone[reaction] = msg_rxns_clone[reaction] > 0 ? msg_rxns_clone[reaction] - 1 : 0 // this is reactive, so view are updated immediately
              chatRef.update({
                reactions: msg_rxns_clone
              })
              reactionsRef.delete()
            }
            else{

              msg_rxns_clone[doc.data().reaction] = msg_rxns_clone[doc.data().reaction] > 0 ? msg_rxns_clone[doc.data().reaction] - 1 : 0 // this is reactive, so view are updated immediately
              msg.reactions[reaction] += 1
              chatRef.update({
                reactions: msg_rxns_clone
              }).then(()=>{
                reactionsRef.update({
                  reaction: reaction
                })
              })

            }
            
          }
          else{
            msg_rxns_clone[reaction] += 1 // this is reactive, so views are updated immediately

            chatRef.update({
              reactions: msg_rxns_clone
            }).then(()=>{
               reactionsRef.set({
                onr: this.getUser.uid,
                tstamp: Date.now(),
                chatRef: msg.docId,
                reaction: reaction
              })
            })
           
          }
        })
  
      } catch(err) {
        console.log(err)
      }
    },
    scrollChat(){
       let doc = document.getElementById('chat_space')
      doc ? doc.scrollTop = doc.scrollHeight - doc.clientHeight : ''
      //console.log(doc.scrollTop)
    },
    moreMessages(){
      this.loading_more_msgs = true

      db.collection('chat_messages')
        .where('elecRef','==',this.curRoom.electionId)
        .orderBy('tstamp', 'desc')
        .limit(100).get().then(querySnapshot =>{
          let msgs = []
          querySnapshot.forEach(doc =>{
            msgs.unshift(doc.data())
          })
          this.offset = querySnapshot.docs[querySnapshot.docs.length - 1]

          this.$store.dispatch('saveChatMessage', msgs)
          this.loading_more_msgs = false
        })
    },
    chatUpdate(){
      
      //console.log(this.$route.params.electionId)
      if(this.curRoom.electionId){
        this.updateRef = db.collection('chat_messages')
        .where('elecRef','==',this.curRoom.electionId)
        .orderBy('tstamp', 'desc')
        .limit(3)
        .onSnapshot(snapshot=>{
          let msgs = []
          snapshot.forEach(doc=>{
            msgs.push(doc.data())
            
          })

          this.offset = snapshot.docs[snapshot.docs.length - 1]

          this.$store.dispatch('updateFromDb', msgs)
          this.loading_messages = false
        })
      }
    }
  },
  created() {
    setTimeout(() => {
      this.scrollChat()
    }, 4000);
    
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        // User is signed in.
        this.chatUpdate()
        
      } else {
        console.log('No user is signed in.')
      }
    });
    

    this.$eventBus.$on('Scroll_Chat', data=>{
      //this.scrollChat()
      console.log(data)
    })
    
  },
  destroyed(){
    this.chatUpdate()
  },
  components:{
    'settings':Settings,
    LoadingBar,
    //'users':Users,
  }
}
import {mapGetters, mapState} from 'vuex'
  import Settings from '@/components/Settings'
  import LoadingBar from '@/spinners/LoadingBar'
  
</script>
<style lang="scss" scoped>

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;
$secondary:#1867c0;

a{
  color:$secondary;
}

.chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  height:calc(100% - 50px);
  //background-color: #00aabb;
}
.chat_avartar{
  width:40px;
  height: 40px;
  border-radius:5px;
  //float:left;
  //display:inline-block;
  margin-right:1%;
  float:left;
  img{
    width:100%;
    height:100%;
    border-radius:5px;
  }
}
@media (min-width: 960){
  .chat_avartar{
    margin-right: 2%;
  }
}
.chat_content{
  display:inline-block;
  //background:yellow;
  width:calc(100% - 50px);
  min-height: 40px;
}
.chat_rectangle {
  padding:5px 15px;
  margin-bottom: 5px;
	//position: relative;
	//background: #00aabb;
	text-align: left;
  text-overflow:wrap;
  width:100%;
  word-wrap: break-word;
  &:hover{
    background-color:rgb(241, 241, 241);
  }
  a{
    text-decoration:none;
    color:#00aabb;
  }
}

#moderator_actions{
  float:right;
  margin-top: -30px;
  margin-right:-16px;
  display:none;
}
.chat_rectangle:hover #moderator_actions{
  display:block;
}

#chat_space{
  height:100%;
  overflow-y:auto;
  visibility: hidden;
}
#chat_space_content, #chat_space:hover, #chat_space:focus {
  visibility: visible;
}

#msg_img:hover{
  cursor: pointer;
}
/* --scrollbar --*/
.chat_space::-webkit-scrollbar {
    width: 8px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
  .thin_scrollbar::-webkit-scrollbar{
    width: 2px;
  }
.chat_space::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  // -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #fff;
  // @include borderRadius(10px)
}
.chat_space::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
.show_reactions{
  position: relative;
  width:50px;
  width:fit-content;
  display:inline-block;
  &:hover .reactions{
    display:block;
    
  }
}
.reactions{
  display:none;
  position: absolute;
  z-index: 1;
  top:-90%;
  width:280px;
  height: 40px;
  @include borderRadius(10px);
  //opacity: .8;
  background: #d4d4d4;
}
.emojis{
  font-size: 22px;
}
</style>