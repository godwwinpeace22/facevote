<template>
  <v-card>
    <v-toolbar color="success" dark dense >

      <v-toolbar-title>
        <v-avatar size="36" color="grey lighten-4">
          <img :src="user.imgSrc || `https://ui-avatars.com/api/?name=${user.name}`" alt="avatar">
        </v-avatar>
        {{user.name}} 
      </v-toolbar-title>
    </v-toolbar>
    <v-container style="background:yello;" class="pa-0 pt-3 private_chat_home">
      <v-card flat pa-0 id="chat_space" style="height:30vh;margin-top:px;overflow-y:auto;background:ore;">
        <div v-for="(msg,i) in myConversations" :key="i">
          <div v-if="divide(msg.timestamp, myConversations[i-1])" style="background:oldlace;font-weight:bold;text-align:center;">
            {{divide(msg.timestamp, myConversations[i-1])}}
          </div>
          <div class="private_chat_rectangle " id="speech_bubble" :class=" msg.from == $store.getters.getUser.username ? 'reposition':''">
            <!--div class="private_chat_avartar"><img :src="'https://api.adorable.io/avatars/285/' + msg.user + '@adorable.png'" alt="avartar"></div-->
            <div class="private_chat_content">
              <div style="width:100%;margin-top:0px;margin-bottom:0px;">
                <v-subheader class="small text" v-if="msg.from != $store.getters.getUser.username" style="margin-right:5px;">
                  <a :href="'/#/dashboard/forum/profile/' + msg.from">{{msg.name || msg.from}}</a>
                </v-subheader>
                <span v-else style="margin-right:5px;"><strong>You  </strong></span>
                <span style="font-size:.9em;color:#555;" color="grey lighten-5">  {{parseDate(msg.timestamp)}}</span>
              </div>
              <div style="width:100%;" >{{msg.message}}</div>
            </div>
            
          </div>

        </div>
          
      </v-card>
    </v-container>
    <div class="white--text pb-0 px-1" style='margin-left:px;position:static;width:100%;background:#fee;'>
      
        <v-textarea v-model="message" box color="deep-purple" @keypress="isTyping"
          label="Type a message" outline
          :append-outer-icon="message ? 'send' : ''"
          @click:append-outer="sendMessage"
          rows="1" auto-grow
        ></v-textarea>
    </div>
  </v-card>
</template>
<script>
export default {
  data:()=>({
    data:true,
    message:'Hello',
    myConversations:[],

  }),
  props:['user'],
  methods:{
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
    clearMessage () {
      this.message = ''
    },
    sendMessage(){
      //console.log(this.$store.state.chat)
      let msgId = Date.now() * 1 + Math.floor(Math.random() * (999999 - 999)) + 999;
      this.$eventBus.$emit('PrivateChatMsg', { 
        message:this.message,
        to:this.user.username,
        from:this.$store.getters.getUser.username,
        name:this.$store.getters.getUser.name,
        imgSrc:this.$store.getters.getUser.imgSrc,
        timestamp:Date.now(),
        msgId:msgId,
        room:this.$store.state.curRoom.electionId,
        status:'unread'
      });
      
      this.clearMessage()
    },
    isTyping(){

    },
    
  },
  components:{
    //LoadingBar,
  },
  mounted(){
    this.$eventBus.$on('PrivateChatMsgResp', data=>{
      
      this.myConversations.push(data)
      console.log(this.myConversations)
    })

    // == hides profile dialog on election watch page
    this.$eventBus.$emit('Hide_Profile', true)

    // on mounted, get the chat conversations with this user from server
    this.$eventBus.$emit('Get_Conversation_History', {firstPerson:this.$store.state.user.username,secondPerson:this.user.username})
    this.$eventBus.$on('Conversation_History', data=>{ // server response to Get_Conversation_History
      this.myConversations = data
    })
  }
}
</script>

<style lang="scss">

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

.v-text-field__details{
  display:none;
}
.private_chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  //background-color: #00aabb;
}
.private_chat_avartar{
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
.private_chat_content{
  display:inline-block;
  //background:yellow;
  width:90%;
  min-height: 40px;
}
.private_chat_rectangle {
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
.private_chat_home::-webkit-scrollbar {
    width: 10px;
    background-color: $mainBgColor;
    @include borderRadius(10px)
  }
.private_chat_home::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: $mainBgColor;
  @include borderRadius(10px)
}
.private_chat_home::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>