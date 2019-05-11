<template>
  <div>
    <navigation>
      <span slot="title">Verify Account</span>
    </navigation>
    
    <v-container grid-list-xs pa-0 >
      <v-layout row wrap>
        <v-flex>
          <v-card class="text-xs-center pt-5 grey lighten-3" flat height="">
            <v-container grid-list-xs >
              <v-layout row wrap justify-center>
                <v-flex sm5>
                  <v-card height="" class="round" color="">
                    <v-sheet flat width="61%" height="100" dark style="position: absolute;top: -40px;left: 20%;" color="transparent">
                      <v-avatar
                        size="100"
                        color="success"
                        class="elevation-1 d-block mx-auto"
                        style="padding-top: 2px;"
                      >
                        
                        <v-avatar class="d-block mx-auto"
                          size="100"
                        >
                        <!-- <div v-if="verifying || verified" class="circle-loader" :class="[verified ? 'load-complete' : '']">
                          <div class="checkmark draw" :style="{'display': verified ? 'block' : 'none'}"></div>
                        </div> -->
                        <v-progress-circular :value="100" :indeterminate="verifying" size="98" width="2" style="margin-top: -1.5px">
                          <!-- <div class="checkmark draw" :style="{'display': verified ? 'block' : 'none'}"></div> -->
                          <v-icon v-if="!verified" large>verified_user</v-icon>
                          <v-icon v-if="verified" large>check</v-icon>
                        </v-progress-circular>
                        </v-avatar>
                      </v-avatar>
                    </v-sheet>

                    <v-card-text class="pt-5 text-xs-center">
                      <div class="mt-4">
                        <span>Verify your account so that you can enroll in elections and participate in chat forums. It takes less than a minute. </span><br>
                        <span>You will only need to do this <strong>once</strong>.</span><br>
                        <router-link to="/faq">Find out more <v-icon small>open_in_new</v-icon></router-link>
                      </div>
                      <v-text-field
                        v-model="bvn"
                        label="Enter BVN"
                        hint="Please provide your valid bvn"
                        :type="show ? 'text' : 'password'"
                        :append-icon="show ? 'visibility' : 'visibility_off'"
                        @click:append="show = !show"
                        counter="11"
                        browser-autocomplete="vote"
                        class="px-4" color="secondary"
                      ></v-text-field>

                      <v-text-field
                        v-model="phone"
                        label="Enter Phone number"
                        hint="* This number should match the phone number associated with your BVN."
                        type="number" counter="11"
                        browser-autocomplete="phone" min="0"
                        class="px-4" color="secondary"
                      ></v-text-field>
                    </v-card-text>
                    
                    <v-card-actions>
                      <v-btn color="success" block flat v-if="is_verified">Your account is verified</v-btn>
                      <v-btn
                        v-else
                        color="success" 
                        ripple class="mx-auto" 
                        :loading="verifying"
                        @click="verify"
                        :disabled="disabled_verify">Verify</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>
<script>
export default {
  data: ()=>({
    dialog: false,
    show: false,
    bvn: '',
    phone: '',
    verifying: false,
    verified: false,
    verify_dialog: false,
    cloudinary: {
       uploadPreset: 'izcl0gzg',
       cloudName: 'unplugged',
       folder: 'securepoll',
        transformation:[
          {width: 400, height: 400, crop: "thumb", gravity:"face"},
        ],
     }, 
  }),
  watch: {
    
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified'
    ]),
    disabled_verify(){
      return !this.bvn.trim() || 
      !this.phone.trim() || 
      this.bvn.length != 11 ||
      this.phone.length != 11
    }
  },
  methods:{
    verify(){
      this.verifying = true
      
      firebase.auth().currentUser.getIdToken().then((token)=>{
        api().post('dashboard/verify', {
          idToken: token,
          bvn: this.bvn,
          phone: this.phone
        }).then(async result =>{

          console.log(result)
          this.verified = true

          this.$store.dispatch('verifiedState', true)

          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Account verified successfully',
            color: 'success'
          })

          // this.$router.push('/home')
        }).catch(err => {
          this.verifying = false
          $NProgress.done()
          console.log(err.response)
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: err.response ? err.response.data.message : 'Verification failed',
            color: 'error'
          })
        })
      })
    }
  },
  mounted(){
    
  },
  components:{
    Navigation
  }
}
import api from '@/services/api'
import Navigation from '@/components/Navigation'
import { mapGetters, mapState } from 'vuex';
</script>


<style lang="scss" scoped>
  
</style>
