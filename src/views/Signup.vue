<template>
  <v-app id="cc">
    <!--toolbar></toolbar-->
    <vue-headful
      :title="title"
    />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md5>

          <v-snackbar v-model="snackbar.show" dark :color="snackbar.color" :timeout="5000" top>
             <span v-html='snackbar.message'></span>
            <v-btn dark flat color="white" @click="snackbar.show = false"> Close</v-btn>
          </v-snackbar>

          <h1 class="text-xs-center white--text mb-4" ><a href="/" style="text-decoration:none;color:#fff">{{$appName}}</a></h1>
          
          <v-card class="" max-width="800" v-if="!show_confirm_text">
            <v-card-title class="title font-weight-bold justify-space-around">
              <span>{{ currentTitle }}</span>
              
            </v-card-title>

            <v-window v-model="step">

              <v-window-item :value="1">
                <v-card-text :class="{'px-0':$vuetify.breakpoint.xsOnly}">
                  <v-form ref="form" class="text-xs-center pa-3">
                    <!-- <p class="text-xs-center"></p> -->
                    <v-text-field
                      label="Full Name" class="mb-0"
                      v-model.lazy="$v.form.name.$model" :error-messages="nameErrors"
                      color="secondary" required>
                      <v-icon slot="prepend-inner" color="teal">mdi-account</v-icon>
                    </v-text-field>

                    <v-text-field 
                      label="Email" class="mb-0"
                      v-model.lazy="$v.form.email.$model" 
                      color="secondary" :error-messages="emailErrors"
                      required type="email">
                      <v-icon slot="prepend-inner" color="teal">mdi-email</v-icon>
                    </v-text-field>

                    <v-text-field class="mb-0"
                      v-model.lazy="$v.form.password1.$model"
                      color="secondary" :error-messages="password1Errors"
                      type="password" label="Password" 
                      required>
                      <v-icon slot="prepend-inner" color="teal">mdi-lock</v-icon>
                    </v-text-field>

                    <v-text-field required
                      v-model.lazy="$v.form.password2.$model"
                      type="password" color="secondary"
                      name="password2" :error-messages="password2Errors"
                      label="Confirm Password">
                      <v-icon slot="prepend-inner" color="teal">mdi-lock</v-icon>
                    </v-text-field>
                  </v-form>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-text>
                  <!-- <v-subheader class="px-4">Are you a student? </v-subheader> -->
                  <v-radio-group v-model="form.is_student" row class="px-3">
                    <v-radio label="I am a student" :value="true"></v-radio>
                    <v-radio label="I am not a student" :value="false" disabled></v-radio>
                  </v-radio-group>
                  <v-form ref="form2" v-if="form.is_student == true" v-model="valid2" class="text-xs-center pa-3">
                    <v-autocomplete
                      v-model.lazy="form2.mySchool" hint="Select your school"
                      :items="schools" return-object item-text="text" hide-no-data  class="mb-0"
                      label="School" persistent-hint color="secondary">
                      <v-icon slot="prepend-inner" color="teal">mdi-school</v-icon>
                    </v-autocomplete>

                    <v-autocomplete color="secondary"
                      label="Faculty"  v-model.lazy="form2.myFaculty" 
                      :items="form2.mySchool.faculties"
                      return-object item-text="text" class="mb-0" hide-no-data
                      required >
                      <v-icon slot="prepend-inner" color="teal">mdi-domain</v-icon>
                    </v-autocomplete>
                    <v-autocomplete label="Department" class="mb-0" hide-no-data 
                      v-model.lazy="form2.myDepartment" :items="form2.myFaculty.departments" required
                      return-object item-text="text" color="secondary">
                      <v-icon slot="prepend-inner" color="teal">mdi-map-marker</v-icon>
                    </v-autocomplete>
                  </v-form>
                  <div class="text-xs-center">
                  <span class="caption grey--text text--darken-1">
                    * Please note that you need to be a student to paticipate in student elections
                  </span><br>
                  <small class="grey--text text--darken-1">By signing up, you agree with our </small><br>
                  <small class="grey--text text--darken-1">
                    <v-btn href="https://voteryte.com/terms" color="primary" style="font-size: 12px" target="blank" class="text-capitalize" flat small>Terms of Use</v-btn> and 
                    <v-btn href="https://voteryte.com/privacy" color="primary" style="font-size: 12px" target="blank" class="text-capitalize" flat small> Privacy Policy</v-btn></small>
                  </div>
                </v-card-text>
              </v-window-item>

            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn :disabled="step === 1 || loading" flat @click="step--">
                Back
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="step !== 3"
                :disabled="$v.form.$anyError || disable_step_two"
                color="success" :loading="loading" 
                depressed @click="next"
              >
                {{step == 2 ? 'Finish' : 'Continue'}}
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card v-else>
            <v-alert
              color="success"
              dismissible
              transition="fade-transition"
              type="success"
              :value="show_confirm_text"
            >
              {{confirm_text}}
            </v-alert>

            <v-card-text>
              <p class="subheading">We've sent an email to <b>{{form.email}}</b>. Click the confirmation link in that email to begin using {{$appName}}</p>
              <p>Didn't get the verification link ? <br>
                <v-btn color="info" flat @click="sendVerificationLInk(true)" :loading="sending_link">Resend verification link</v-btn>
              </p>
            </v-card-text>
          </v-card>

          <v-subheader class="ml-5 white--text text-xs-center">Already have an account? 
            <router-link to="/login" class="pl-2 font-weight-bold success--text" style="text-decoration:none;"> Sign in</router-link>
          </v-subheader>
        </v-flex>
      </v-layout>
    </v-container>

    <footr></footr>
  </v-app>
</template>
<script>

export default {
  data:()=>({
    step: 1,
    message: 'Login',
    snackbar: {},
    loading: false,
    sending_link: false,
    disabled: false,
    show_confirm_text: false,
    confirm_text: 'Email verification link has been sent',
    form: {
      name: '',
      email: '',
      is_student: true, // whether is student or not
      password1: '',
      password2: '',
    },
    form2: {

      mySchool: '',
      myFaculty: '',
      myDepartment: '',
    },
    schools: [],
    select: null,
    show3: false,
    show4: false,
    valid: true,
    valid2: true,
    checkbox: false
  }),
  validations: {
    form: {
      name: {required},
      email: {required, email},
      is_student: {required},
      password1: {required, minLength: minLength(6)},
      password2: {required, minLength: minLength(6), sameAsPassword: sameAs('password1')}
    },
    form2: {
      mySchool: {required},
      myFaculty: {required},
      myDepartment: {required}
    }
  },
  components:{
    // 'toolbar':Nav,
    footr:Footer
  },
  computed: {
    title(){
      return `Sign Up | ${this.$appName}`
    },
    currentTitle () {
      switch (this.step) {
        case 1: return 'Sign Up For Free'
        case 2: return 'Almost done...'
        default: return 'Account created'
      }
    },
    password1Errors () {
      const errors = []
      if (!this.$v.form.password1.$dirty) return errors
      !this.$v.form.password1.required && errors.push('Password is required.')
      !this.$v.form.password1.minLength && errors.push('Mininum length of 6 characters.')
      return errors
    },
    password2Errors () {
      const errors = []
      if (!this.$v.form.password2.$dirty) return errors
      !this.$v.form.password2.required && errors.push('Password is required.')
      !this.$v.form.password2.minLength && errors.push('Mininum length of 6 characters.')
      !this.$v.form.password2.sameAsPassword && errors.push('Passwords don\'t match.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.email && errors.push('Email must be valid')
      !this.$v.form.email.required && errors.push('E-mail is required')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required && errors.push('Name is required')
      return errors
    },
    disable_step_two(){
      return this.step == 2 && 
      (!this.form2.mySchool ||
      !this.form2.myFaculty ||
      !this.form2.myDepartment)
    }
  },
  methods:{
    next(){
      this.$v.form.$touch()

      if(this.step == 1 && this.$v.form.$anyError){
        
      }
      else if(this.step == 2 && this.$v.form2.$anyError){

      }
      else {
        // console.log(this.$v.form2)
        this.step == 2 ? this.submit() : this.step++
      }
    },
    async getSchools(){
      try {
        let schls = await api2().post('dashboard/getSchools')
        // console.log(schls)
        this.schools = schls.data
      } catch (error) {
        // console.log(error)
      }
    },
    submit(){
      try{
        // check if forms are valid before submit
        if(this.form.is_student){
          if((this.$refs.form && this.$refs.form.validate()) && (this.$refs.form2 && this.$refs.form2.validate())){
            this.send()
          }else{
            this.snackbar = {status:true,color:'error', message:'Please provide all required fields'}
          }
        }
        else{
          if(this.$refs.form && this.$refs.form.validate()){
            this.send()
          }else{
            this.snackbar = {status: true, color: 'error', message: 'Please provide all required fields'}
          }
        }
      }
      catch(err){
        // console.log(err)
      }
    },
    sendVerificationLInk(alert){
      this.sending_link = true
      return new Promise((resolve, reject)=>{
        if(firebase.auth().currentUser){

          firebase.auth().currentUser.sendEmailVerification().then(done=>{
            
            this.sending_link = false

            if(alert){
              this.confirm_text = 'Verification link has been resent'
              
            }
            resolve(done)
          }).catch(err => {
            this.sending_link  = false
            reject(err)
          })
        }
      })
    },
    async send(){
      if(this.$v.form2.$anyError){
        this.snackbar = {status:true,color:'error', message:'Passwords do not match'}
      }
      else{

        let user = this.form
        let two_weeks = 14 * 24* 60 * 60 * 1000

        user.school = this.form2.mySchool.text
        user.faculty = this.form2.myFaculty.text
        user.department = this.form2.myDepartment.text
        // user.trial_expiry_date = (new Date().getTime()) + two_weeks
        this.loading = true
        

        // console.log(user)
        // console.log(new Date(user.trial_expiry_date))
        api().post('createUser', user).then(result => {
          firebase.auth().signInWithCustomToken(result.data.token).then(() => {
            // console.log(result.data)
            // this.snackbar = {
            //   show: true,
            //   color: 'purple',
            //   message: `Welcome to ${this.$appName}`
            // }
            // this.$router.push('/home/?welcome=true')

            this.sendVerificationLInk().then(()=> {
              this.show_confirm_text = true
            })
              
          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // console.log(error.response.data)
            this.snackbar = {
              show: true,
              message: error.response.data.message,
              color: 'error'
            }
            // ...
          });
        }).catch(err => {
          // console.log(err.response.data)
          this.loading = false
          this.snackbar = {
            show: true,
            color: 'error',
            message: err.response.data.message
          }
        })
        
      }
    }
  },
  mounted(){
    this.getSchools()
    document.getElementById('welcome_logo').style.display = 'none'
  }
}

// import Nav from '@/components/Nav'
  import api from '@/services/api'
  import api2 from '@/services/api2'
  import Footer from '@/components/Footer'
  import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
  import {firebase, db, database} from '@/plugins/firebase'
</script>
<style lang="scss" scoped>
  @mixin MainColor(){
    //background:#fdba1e;
    background:#042943;
    color:#fff;
  }
  #cc{
    background:#042943;
    //background:#e8e8e8;
  }
  .v-input{
    margin-top:0;
  }
  .form_buttons button{
    text-transform:none;
  }
  .v-card{
    border-radius:6px;
  }
  //.theme--light.v-text-field--outline .v-input__slot {
   // border: 1px solid rgba(115, 114, 114, 0.54);
  //}
</style>


