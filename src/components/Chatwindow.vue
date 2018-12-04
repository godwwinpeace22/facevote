<template>
    <div style="background:#fff;" class="pa-0 pt-3 chat_home" id="chat_home">
      <div flat pa-0 id="chat_space" style="height:75vh;margin-top:px;overflow-y:auto;background:ore;">
        <div v-for="(msg,i) in $store.getters.getChatMessages" :key="i">
          <div v-if="divide(msg.timestamp, $store.getters.getChatMessages[i-1])" style="background:oldlace;font-weight:bold;text-align:center;">
            {{divide(msg.timestamp, $store.getters.getChatMessages[i-1])}}
          </div>
          <div class="chat_rectangle " id="speech_bubble" :class=" msg.user == $store.getters.getUser.username ? 'reposition':''">
            <div class="chat_avartar"><img :src="Img(msg.user)" alt="avartar"></div>
            
            <div class="chat_content">
              <div style="width:100%;margin-top:0px;margin-bottom:0px;">
                <span class="text-capitalize" v-if="msg.user != $store.getters.getUser.username " style="font-size:15px;margin-right:5px;">
                  <a class="subheading" @click.prevent="$router.push(`/dashboard/forum/${msg.room}/profile/${msg.user}`)">{{msg.name || msg.user}}</a>
                </span>
                <span v-else style="margin-right:5px;"><strong>You  </strong></span>
                <span style="font-size:.9em;color:#555;" color="grey lighten-5">  {{parseDate(msg.timestamp)}}</span>
              </div>
              <div style="width:100%;" v-if="!msg.imgSrc">{{msg.chat}}</div>
              <div v-else>
                <div style="width:100%;">{{msg.chat}}</div>
                <v-img :src="msg.imgSrc" max-width="300" max-height="300"></v-img>
                
                
              </div>
              
              <div class="show_reactions">
                <div class="reactions">
                  <v-btn icon small @click="add_reaction(msg,'like')">
                    <img alt="Thumbs Up Hand Gesture" width=30 height=30 src="http://www.sherv.net/cm/emoticons/hand-gestures/thumbs-up-hand-gesture-smiley-emoticon.gif">
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
                    <img alt="Big Dancing Banana" width=20 height=20 src="http://www.sherv.net/cm/emo/funny/2/big-dancing-banana-smiley-emoticon.gif">
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
                <v-btn icon small @click="add_reaction(msg,'like')" v-show="msg.reactions.like.length > 0">
                  {{msg.reactions.like.length}}<img alt="Thumbs Up Hand Gesture" width=30 height=30 src="http://www.sherv.net/cm/emoticons/hand-gestures/thumbs-up-hand-gesture-smiley-emoticon.gif">
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'love')" v-show="msg.reactions.love.length > 0">
                  {{msg.reactions.love.length}}<v-icon color="red">favorite</v-icon>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'haha')" v-show="msg.reactions.haha.length > 0">
                  {{msg.reactions.haha.length}}<span class="emojis">😃</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'wow')" v-show="msg.reactions.wow.length > 0">
                  {{msg.reactions.wow.length}}<span class="emojis">😲</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'angry')" v-show="msg.reactions.angry.length > 0">
                  {{msg.reactions.angry.length}}<span class="emojis">😣</span>
                </v-btn>
                <v-btn icon small @click="add_reaction(msg,'excited')" v-show="msg.reactions.excited.length > 0">
                  {{msg.reactions.excited.length}}<img alt="Big Dancing Banana" width=20 height=20 src="http://www.sherv.net/cm/emo/funny/2/big-dancing-banana-smiley-emoticon.gif">
                </v-btn>
              </div>
            </div>
          </div>
        </div>
          
      </div>
    </div>
</template>

<script>
export default {
  props:{
    icons:{
      type:Array
    },
    source:String
  },
data:()=>({
    password: 'Password',
    show_reactions:false,
    drawer: null,
    message: 'Hey!',
    chat_messages:[],
    basemsgs:[],
    marker: true,
    iconIndex: 0,
    menu:false,
    chat:'',
    fab:true,
    curr_date:null
  }),
  props:['regVoters'],
  computed: {
    icon () {
      return this.icons[this.iconIndex]
    },
    
  },

  methods: {
    sameUser(msg){
      return msg.user == this.$store.getters.getUser.username
    },
    
    Img(user){
      //console.log('regvoters!: ', this.regVoters)
      return this.regVoters ? this.regVoters.find(voter=> voter.username == user).imgSrc : null
    },
    parseDate(timestamp){
      let d = new Date(timestamp)
      let options = {hour:'numeric', minute:'numeric' };
      return d.toLocaleString("en-US",options)
    },

    divide(timestamp,prev){
      let options = {year: 'numeric', month: 'numeric', day: 'numeric' };
      let then = new Date(timestamp)
      let that_day = then.toLocaleString("en-US",options)
      let that_day2 = then.toLocaleString('en-Us', {
          year:'numeric', month:'short', weekday:'short', day:'numeric'
        })

      if(prev && prev.timestamp){
        // for msg other than the first. If the previous date is same as the cur date return false
        if((new Date(prev.timestamp)).toLocaleString("en-US", options) == that_day){
          return false
        }
        else{
          // else return true (the previous date is different from the cur date, hence its another day)
          return that_day2
        }
      }
      else{ // for the very first msg
        // if today's date is same with message's date return 'today' else show that date
        return (new Date()).toLocaleString('en-Us',options) == that_day ? 'Today' : that_day2
      }
    },
    async add_reaction(msg,reaction){
      try {
        console.log(msg,reaction)
        let a_reaction = msg.reactions[reaction]
        let me = this.$store.getters.getUser.username

        if(a_reaction.indexOf(me) != -1){ // if user has reacted same way before
          
          a_reaction.splice(a_reaction.indexOf(me)) // this is reactive, so view are updated immediately
          
          this.$eventBus.$emit('Add_Reaction',{
            msgId:msg.msgId,reactions:msg.reactions,room:msg.room
          })
        }
        else if(a_reaction.indexOf(me) == -1){ // if user hasn't reacted same way before
          a_reaction.push(this.$store.getters.getUser.username) // this is reactive, so view are updated immediately
          this.$eventBus.$emit('Add_Reaction',{
            msgId:msg.msgId,reactions:msg.reactions,room:msg.room
          })
          //$('chat_home').scrollTop($('#chat_home')[0].scrollHeight);
        }
        else{}
  
      } catch(err) {
        console.log(err)
      }
    },
    scrollChat(){
       let doc = document.getElementById('chat_space')
      doc.scrollTop = doc.scrollHeight - doc.clientHeight
      console.log(doc.scrollTop)
    }
  },
  mounted() {
    setTimeout(() => {
      this.scrollChat()
    }, 4000);
    
    this.$eventBus.$on('Scroll_Chat', data=>{
      //this.scrollChat()
      console.log(data)
    })
      
  },
  components:{
    'settings':Settings,
    //'users':Users,
  }
}
import io from 'socket.io-client';
  import api from '@/services/api'
  import Settings from '@/components/Settings'
  //import Users from '@/components/Users'
  import { promisfy } from "@/helpers/promisify";
  
</script>
<style lang="scss" scoped>

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

.chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  height:75vh;
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
.chat_content{
  display:inline-block;
  //background:yellow;
  width:90%;
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
.speech-bubbl:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 25px solid transparent;
	border-right-color: #00aabb;
	border-left: 0;
	border-bottom: 0;
	margin-top: -12.5px;
	margin-left: -25px;
}

/* --scrollbar --*/
.chat_space::-webkit-scrollbar {
    width: 10px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
.chat_space::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: $mainBgColor;
  @include borderRadius(10px)
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