<template>
  <v-card>
    <v-toolbar color="teal" dark dense flat>
      <v-avatar size="36" color="grey lighten-4">
        <img :src="user.imgSrc || user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`" alt="avatar">
      </v-avatar>

      <v-toolbar-title>{{user.name}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn flat icon @click="$eventBus.$emit('Close_Private_Chat_Window', '')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    
    <v-container class="pa-0 pt-3 private_chat_home">
      <v-card flat pa-0 id="chat_space" style="height:30vh;margin-top:px;overflow-y:auto;background:ore;">
        <div v-for="(msg,i) in myConversations" :key="i">
          <div v-if="divide(msg.timestamp, myConversations[i-1])" class="time_divider">
            {{divide(msg.timestamp, myConversations[i-1])}}
          </div>
          <div class="private_chat_rectangle " id="speech_bubble">
            <!--div class="private_chat_avartar"><img :src="'https://api.adorable.io/avatars/285/' + msg.user + '@adorable.png'" alt="avartar"></div-->
            <div class="private_chat_content" style="background:beige;" v-if="msg.sender != getUser.uid">
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
            <div class="private_chat_content" style="background:#9E9E9E;color:#fff;" v-else>
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
    <div class="white--text pb-0 px-1" style='padding-top:10px;width:100%;'>
      
      <v-textarea v-model="message" box color="deep-purple" @keypress="isTyping"
        label="Type a message" outline
        :append-outer-icon="message.trim() ? 'send' : ''"
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
    message:'',
  }),
  computed:{
    styleObj(){
      if(this.$vuetify.breakpoint.smAndDown){
        return {
          height:'100vh'
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
      //console.log(this.$store.state.chat)
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
    
    db.collection('private_conversations')
      .where('parties','==',[this.getUser.uid,this.user.uid].sort().join('-'))
      .onSnapshot(async snapshot=>{
        let msgs = []
        snapshot.forEach(doc=>{
          //console.log(doc.data())
          msgs.push(doc.data())
        })

        //console.log(msgs)
        this.$store.dispatch('private_conversations', msgs)
        
        await this.markMsgsAsRead()
      })
  }
}
import { mapGetters } from 'vuex'
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

.time_divider{
  background:oldlace;
  font-weight:bold;
  text-align:center;
  padding:0px 15px;
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