<template>
  <div>
    <vue-headful :title="title"></vue-headful>
    <navigation>
      <span slot="title">Account settings</span>
    </navigation>

    <v-container>
      
      <v-row justify="center" v-if="showUi">
        <v-col cols="12" sm="8" class="pt-0">

          <v-row >
            <v-col cols="12" sm="10">
              <v-card outlined>
                <v-card-title> Basic Info</v-card-title>

                <v-list two-line>
                  <v-list-item>
                    <v-list-item-avatar 
                      size="80"
                      :color="$helpers.colorMinder(getUser.name.charAt(0))">
                      <v-img :src="getUser.photoURL" v-if="getUser.photoURL"></v-img>
                      <span class="title" v-else>{{getUser.name.charAt(0)}}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="text-capitalize font-weight-bold">
                        {{getUser.name}}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        @{{getUser.username}}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{getUser.email}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-card-text class="mt-4">

                  <v-text-field 
                    class="mb-4 text-capitalize" 
                    outlined
                    v-model.trim="form.title" 
                    color="primary" autocomplete="title" 
                    :placeholder="getUser.title" 
                    label="Title">
                  </v-text-field>

                  <v-textarea
                    label="About You"
                    name="about" outlined 
                    :placeholder="getUser.about"
                    rows="9" v-model.trim="form.about"
                  ></v-textarea>

                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn depressed 
                    class="success" 
                    @click.native="updateProfile" 
                    :disabled="disabled_save || loading" 
                    :loading="loading">
                    Save Changes
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="12" sm="10">
              <v-card outlined>
                <v-card-title>School</v-card-title>
                <v-card-text>
                  
                  <v-switch 
                    label="I am a student"
                    color="success"
                    v-model="form.is_student">
                  </v-switch>
                  
                  <div v-if="form.is_student">
                    <v-autocomplete
                      required outlined
                      v-model="form.sch" 
                      :items="getSchools"
                      :readonly="getUser.was_once_a_student"
                      :disabled="getUser.was_once_a_student"
                      color="primary"
                      return-object
                      label="Your school" >
                      <v-icon slot="prepend-inner" color="teal">mdi-school</v-icon>
                    </v-autocomplete>
                    
                    <v-select
                      required outlined
                      v-model="form.fac"
                      :items="form.sch.faculties"
                      color="primary" return-object 
                      :readonly="getUser.was_once_a_student"
                      :disabled="getUser.was_once_a_student"
                      label="Select faculty" >
                      <v-icon slot="prepend-inner" color="teal">mdi-domain</v-icon>
                    </v-select>

                    <v-select
                      required outlined
                      v-model="form.dept"
                      :items="form.fac.departments"
                      return-object
                      :readonly="getUser.was_once_a_student"
                      :disabled="getUser.was_once_a_student"
                      color="primary" label="Select department">
                      <v-icon slot="prepend-inner" color="teal">mdi-map-marker</v-icon>
                    </v-select>
                  </div>
                    
                </v-card-text>
                <v-card-actions>

                  <v-spacer></v-spacer>

                  <v-btn color="success" 
                    @click="updateSchool"
                    :loading="saving_sch"
                    :disabled="disabled2"
                    depressed>
                    Save changes</v-btn>
                    
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="12" sm="10">
              <v-card outlined id="subscriptions">
                <v-card-title>
                  Subscriptions
                </v-card-title>
                <v-card-text>
                  <v-row v-if="isSuperUser && !subscription.cancelled">
                    <v-col cols="4">
                      Plan:
                    </v-col>
                    <v-col cols="6">
                      <b>Premium</b>
                    </v-col>
                    <v-col cols="4">
                      Subscription date:
                    </v-col>
                    <v-col cols="6">
                      <b>{{new Date(subscription.paid_at)}}</b>
                    </v-col>
                    <v-col cols="4">
                      Renews on: 
                    </v-col>
                    <v-col cols="6">
                      <b>{{renewsOn}}</b>
                    </v-col>
                  </v-row>
                  <v-subheader v-else>No active subscription</v-subheader>
                </v-card-text>
                <v-card-actions v-if="isSuperUser && !subscription.cancelled">
                  <v-spacer></v-spacer>

                  <v-dialog
                    v-model="dialog" 
                    persistent :overlay="false"
                    max-width="500px"
                    transition="dialog-transition"
                  >

                    <template v-slot:activator="{on}">

                      <v-btn 
                        v-on="on"
                        color="primary"
                        outlined>
                        Cancel subscription
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title primary-title>
                        Cancel Subscription
                      </v-card-title>
                      <v-card-text>
                        
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                          Totam id sequi distinctio, dolorem nostrum fugit numquam,
                        </p>
                        <p>Are you sure?</p>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                          depressed @click="dialog = false"
                          :disabled="loading3">
                          No</v-btn>
                        <v-btn 
                          color="success" depressed
                          :loading="loading3"
                          @click="cancelSubscription">
                          Proceed</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="12" sm="10">
              <v-card outlined>
                <v-card-title >
                  BVN Verification
                </v-card-title>
                
                <verification-settings/>
              </v-card>
            </v-col>

          </v-row>

        </v-col>

      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data: ()=>({
    showUi: false,
    loading: false,
    saving_sch: false,
    loading3: false,
    form: {
      title: '',
      about: '',
      is_student: '',
      sch: '',
      fac: '',
      dept: ''
    },
    dialog: false,
  }),
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified'
    ]),
    title(){
      return `Profile Settings | ${this.$appName}`
    },
    renewsOn(){
      let d = new Date(this.subscription.paid_at)
      d.setMonth(d.getMonth() + 1)
      return new Date(d)
    },
    disabled_save(){
      return !this.form.about
    },
    disabled2(){
      return this.form.is_student && 
       (!this.form.sch || 
       !this.form.fac ||
       !this.form.dept)
    },
    getSchools(){
      return schools
    }
  },
  methods: {
    async updateProfile(){

      this.loading = true
      try{

        this.$gun.get('users').get(this.getUser.username)
          .put({
            title: this.form.title || this.getUser.title || false,
            about: this.form.about || this.getUser.about
          })
          

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Changes save',
          color: 'purple'
        })
        this.loading = false
      }
      catch(err) {

        this.$eventBus.$emit('Snackbar',{
          show: true,
          message: 'Profile update failed. Try again',
          color: 'error'
        })

        console.log(err)

        this.loading = false

      }
    },
    async updateSchool(){

      this.saving_sch = true
      try{
        
        this.$gun.get('users').get(this.getUser.username)
          .put({
            was_once_a_student: this.getUser.was_once_a_student ? true : this.form.is_student,
            is_student: this.form.is_student || this.getUser.is_student,
            sch: this.form.sch.text || this.getUser.sch,
            fac: this.form.fac.text || this.getUser.fac,
            dept: this.form.dept.text || this.getUser.dept
          })
          

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Changes save',
          color: 'purple'
        })
        this.saving_sch = false
      }
      catch(err) {

        this.$eventBus.$emit('Snackbar',{
          show: true,
          message: 'Profile update failed. Try again',
          color: 'error'
        })

        console.log(err)

        this.saving_sch = false

      }
    },
    async cancelSubscription(){

      try {
        
        if(this.isSuperUser){

          this.loading3 = true;
          let dec = this.subscription
          // console.log(dec)
          
          if(!dec.cancelled){

            let resp = await api().post('/cancelSubscription', {
              plan_id: dec.plan_id,
              customer_id: dec.customer_id
            })
    
            let new_sub = JSON.stringify({
              ...dec,
              cancelled: true,
              cancelled_at: this.$Gun.state()
            })
    
            let enc = await this.$SEA.encrypt(new_sub, epriv)
    
            this.$gUser.get('subs').put(enc)
    
            this.loading3 = false
            this.dialog = false
            
            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'Subscription cancelled',
              color: 'success'
            })
          }
          else {

            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'You have not active subscriptions',
              color: 'error'
            })
            this.loading3 = false
            this.dialog = false
          }
        }

      } catch (error) {
        console.log(error)
        this.loading3 = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Something went wrong. Try again',
          color: 'error'
        })
      }

    }
  },
  async mounted(){

    this.form = Object.assign({}, this.getUser)

    if(this.getUser.was_once_a_student){
      let sch = this.getSchools.find(s => s.text == this.getUser.sch)
      let fac = sch.faculties.find(f => f.text == this.getUser.fac)
      let dept = fac.departments.find(d => d.text == this.getUser.dept)

      this.form.sch = sch;
      this.form.fac = fac;
      this.form.dept = dept;
    }

    // get subscription details
    let epriv = this.$gUser['_'].sea.epriv
    let sub = await this.$gUser.get('subs').then()
    this.subscription = await this.$SEA.decrypt(sub, epriv)

    this.showUi = true;
    
  },
  components: {
    VerificationSettings,
  }
}

import { mapGetters, mapState } from 'vuex'
import api from '@/services/api2'
import {schools} from '@/assets/js/schools'
import VerificationSettings from '@/components/profile_settings/VerificationSettings'
</script>

<style scss>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
    cursor:pointer;
  }
  .profile_card .v-image__image{
    filter:blur(2px) !important;
  }
</style>
