<template>
  <v-card :id="$vuetify.breakpoint.smAndUp ? 'private_chat' : ''">
    <v-toolbar style="background:#8BC34A;" dark dense flat scroll-target="private_chat_home" :id="$vuetify.breakpoint.smAndUp ? 'private_chat_nav' : ''" >
      <v-avatar size="36" :color="$helpers.colorMinder(user.name.charAt(0))">
        <img v-if="user.imgSrc || user.photoURL" :src="user.imgSrc || user.photoURL" alt="avatar">
        <span v-else>{{user.name.charAt(0)}}</span>
      </v-avatar>

      <v-toolbar-title>{{user.name}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn flat icon @click="$eventBus.$emit('Close_Private_Chat_Window', '')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    

    <v-container v-if='!loading_messages' class="pa-0 private_chat_home" :style="switchHeight">
      <v-card flat pa-0 id="chat_space" class="pb-1 pt-3" style="height:100%;margin-top:px;overflow-y:auto;background:ore;">
        <div v-for="(msg,i) in myConversations" :key="i">
          <div v-if="divide(msg.timestamp, myConversations[i-1])" class="time_divider">
            {{divide(msg.timestamp, myConversations[i-1])}}
          </div>
          <div class="private_chat_rectangle px-2 py-1" id="speech_bubble">
            
            <div class="private_chat_content" style="background:rgb(249, 249, 237);" v-if="msg.sender != getUser.uid">
              <div style="float:left;margin-right:10px;margin-top:0px;margin-bottom:0px;">
                <v-avatar size="36" color="grey lighten-4">
                  <img :src="user.imgSrc || user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`" alt="avatar">
                </v-avatar>
              </div>
              <div style="" >
                <small class="d-block" color="teal" style="color:teal;">  {{parseDate(msg.timestamp)}}</small>
                {{msg.message}}
              </div>
            </div>
            <!--YOU-->
            <div class="private_chat_content" style="background:rgb(234, 241, 245);color:rgb(34, 35, 35);" v-else>
              <div style="margin-top:0px;margin-bottom:0px;float:right;">
                <v-avatar size="36" color="grey lighten-4">
                  <img :src="getUser.photoURL  || `https://ui-avatars.com/api/?name=${getUser.displayName}`" alt="avatar">
                </v-avatar>
              </div>
              <div style="" >
                <small class="d-block" style="">  {{parseDate(msg.timestamp)}}</small>
                {{msg.message}}
              </div>
            </div>
            
          </div>

        </div>
          
      </v-card>
    </v-container>

    <!-- <div class="white--text pb-0 pl-2 pr-4" style='padding-top:10px;width:100%;position:absolute;bottom:0;background:#fff'>
      
      <v-textarea v-model="message" box color="deep-purple" @keypress="isTyping"
        label="Type a message" outline
        :append-outer-icon="message.trim() ? 'send' : ''"
        @click:append-outer="sendMessage"
        rows="1" auto-grow
      ></v-textarea>
    </div> -->
    
  </v-card>
</template>
<script>
export default {
  data:()=>({
    data:true,
    message:'',
    loading_messages:true,
  }),
  computed:{
    styleObj(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {
          height:'100vh'
        }
      }
    },
    switchHeight(){
      if(this.$vuetify.breakpoint.xsOnly){
        return {
          height:'calc(100vh - 125px)'
        }
      }else{
        return {
          height:'60vh'
        }
      }
    },
    myConversations(){
      return this.getPrivateConversations
    },
    ...mapGetters([
      'isAuthenticated',
      'getToken',
      'getUser',
      'getPrivateConversations',
    ]),
    ...mapState([
      'isSuperUser'
    ])
  },
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
    async markMsgsAsRead(){
      let msgs = this.getPrivateConversations
      msgs.forEach(async msg=>{
        if(msg.type == 'broadcast'){
          await db.collection('broadcasts').doc(msg.msgId).update({
            seenBy:firebase.firestore.FieldValue.arrayUnion(this.getUser.uid)
          })
        }
        else{
          if(msg.status == 'unread' && msg.reciever == this.getUser.uid){
            await db.collection('private_conversations').doc(msg.msgId).update({
              status:'read'
            })
          }
        }
        
      })
      
    },
    sendMessage(){
      // console.log(this.$store.state.chat)
      let msgId = btoa(Math.random()).substring(0,12) + Date.now()
      let data = {
        message:this.message.trim(),
        type:'default', // message can be 'default' or 'broadcast'
        reciever:this.user.uid,
        sender:this.getUser.uid,
        parties:[this.getUser.uid,this.user.uid].sort().join('-'),
        name:this.getUser.displayName,
        imgSrc:this.getUser.photoURL,
        timestamp:Date.now(),
        msgId:msgId,
        status:'unread'
      }

      // console.log(data)
      // console.log(this.user)
      db.collection('private_conversations').doc(data.msgId).set(data)
      this.clearMessage()
  
    },
    isTyping(){

    },
    
  },
  components:{
    //LoadingBar,
  },
  mounted(){
    // console.log(this.user)
    db.collection('private_conversations')
      .where('parties','==',[this.getUser.uid,this.user.uid].sort().join('-'))
      .onSnapshot(async snapshot=>{
        let msgs = []
        snapshot.forEach(doc=>{
          //console.log(doc.data())
          msgs.push(doc.data())
        })

        this.$store.dispatch('private_conversations', msgs)
        this.loading_messages = false

        await this.markMsgsAsRead()
      })
  }
}
import { mapGetters, mapState } from 'vuex'
  //import LoadingBar from '@/spinners/LoadingBar'
</script>

<style lang="scss">

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
}
$mainBgColor:#1c1f35;

.private_chat_home{
  //background-image:url('../assets/chat_wallpaper.jpg');
  background-size:cover;
  background-position: center;
  //background-color: #00aabb;
}

.time_divider{
  background:oldlace;
  font-weight:bold;
  text-align:center;
  padding:0px 15px;
  margin:auto;
  width:fit-content;
  @include borderRadius(10px);
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
  //display:inline-block;
  //background:yellow;
  //width:90%;
  padding:12px;
  @include borderRadius(5px);
  overflow:auto;
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

.private_chat_home .v-text-field__details{
  display:none;
}
#private_chat_nav .v-toolbar__content{
  background:#8BC34A;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
#private_chat{
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
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