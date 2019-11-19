<template>
  <div>
    <v-container grid-list-xs pa-0>
      <v-row row wrap>
        <v-col cols="12" sm="6" >
          <v-card flat>
            <v-subheader>Your subscriptions</v-subheader>
            <v-subheader v-if="!subscription">No active subscriptions</v-subheader>
            <v-card-text class="pt-0 " v-if="subscription && subscription.plan">
              <v-row row wrap>
                <v-col >
                  <span class="pr-5 font-weight-bold">Plan Name: </span>
                </v-col>
                <v-col class="text-xs-left">
                  <span>{{subscription.plan.name}}</span>
                </v-col>
              </v-row>
              <v-row row wrap>
                <v-col >
                  <span class="pr-5 font-weight-bold">Amount: </span>
                </v-col>
                <v-col class="text-xs-left">
                  <span>{{subscription.plan.amount/100}}</span>
                </v-col>
              </v-row>
              <v-row row wrap>
                <v-col >
                  <span class="pr-5 font-weight-bold">Interval: </span>
                </v-col>
                <v-col class="text-xs-left">
                  <span>{{subscription.plan.interval}}</span>
                </v-col>
              </v-row>
              <v-row row wrap>
                <v-col >
                  <span class="pr-5 font-weight-bold">Paid At: </span>
                </v-col>
                <v-col class="text-xs-center">
                  <span>{{payment_date}}</span>
                </v-col>
              </v-row>
              <v-row row wrap>
                <v-col >
                  <span class="pr-5 font-weight-bold">Next Payment: </span>
                </v-col>
                <v-col class="text-xs-center">
                  <span>{{next_payment_date}}</span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              
              <v-btn color="secondary" dark 
                @click="dialog = true" 
                v-if="subscription && 
                subscription.plan" text 
                class="text-normal pl-2">
                  Cancel subscription
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
              <v-card-title class="headline">Cancel Subscription</v-card-title>
              <v-card-text>
                <div class="mb-3"><b>Are your sure you want to cancel your subscription?</b></div>
                <div>You will continue to use your premium features until {{next_payment_date}}</div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click.native="dialog = false" :disabled="cancelling">No</v-btn>
                <v-btn color="primary" text @click.native="cancelSubscription" :loading="cancelling">Continue</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({
    subscription: {},
    options: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    },
    dialog: false,
    cancelling: false,
  }),
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified',
      'curRoom'
    ]),
    payment_date(){

      return this.subscription ? 
      new Date(this.subscription.created_at).toLocaleString('en-US', this.options) : ''
    },
    next_payment_date(){
      return this.subscription ? 
      new Date(this.subscription.next_payment_date).toLocaleString('en-US', this.options) : ''
    }
  },
  methods: {
    async initialize(){
      this.subscription = await this.fetchUserSubscription()
    },
    fetchUserSubscription(){
      let latest_subscription = this.getUserInfo.latest_subscription

      return db.collection('transaction_events').doc(latest_subscription)
      // .orderBy('timestamp', 'desc')
      .get().then(doc => {
        // console.log(doc.data())
        let res = doc.data().status == 'active'
        return res ? doc.data() : null
      })
    },
    cancelSubscription(){
      this.cancelling = true;

      firebase.auth().currentUser.getIdToken()
      .then((token)=>{
        api().post('/cancel_subscription', {
          idToken: token,
          subscription_code: this.subscription.subscription_code,
          email_token: this.subscription.email_token
        }).then(async res=>{
          // subscription cancelled
          this.cancelling = false;
          this.dialog = false
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Subscription has been cancelled',
            color: 'info'
          })
          await this.initialize()
          this.subscription = {}
        }).catch(error=>{
          this.$Nprogress.done()

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: error.response ? error.response.data.message : 'Something went wrong',
            color: 'error'
          })
          this.dialog = false
          this.cancelling = false;
        })
        
      })
    }
  },
  mounted(){
    this.initialize()
  }
}
import { mapState, mapGetters } from 'vuex'
import { firebase, db, database } from '@/plugins/firebase'
import api from '@/services/api'
</script>