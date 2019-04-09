<template>
  <div>
    <div v-for="(msg, i) in broadcasts.msgs" :key="msg.tstamp">
      <div v-if="divide(msg.tstamp, broadcasts.msgs[i-1])" class="time_divider">
        {{divide(msg.tstamp, broadcasts.msgs[i-1])}}
      </div>
      <v-card class="round my-3 ">
        <v-card-text>
          {{msg.body}}
          <div class="font-weight-light">{{(new Date(msg.tstamp)).toLocaleString('en-Us', options)}}</div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      dialog: true,
      options: {
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  },
  props: ['broadcasts'],
  methods: {
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
    }
  },
  mounted(){
    console.log(this.broadcasts)
    this.$store.dispatch('setLastReadTime', {
      timestamp: Date.now(),
      read: this.broadcasts.msgs.length
    })
  }
}
</script>

<style lang="scss" scoped>

@mixin borderRadius($radius) {
  border-radius: $radius;
  -webkit-border-radius:$radius;
  -moz-border-radius:$radius;
  -o-border-radius:$radius;
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
.broadcast_msg{
  background: aliceblue;
  padding: 5px;
}
</style>


