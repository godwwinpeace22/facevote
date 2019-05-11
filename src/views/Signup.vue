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

          <h1 class="text-xs-center white--text mb-4" ><a href="/" style="text-decoration:none;color:#fff">{{app_title}}</a></h1>
          
          <v-card class="" max-width="800" >
            <v-card-title class="title font-weight-bold justify-space-around">
              <span>{{ currentTitle }}</span>
              
            </v-card-title>

            <v-window v-model="step">

              <v-window-item :value="1">
                <v-card-text :class="{'px-0':$vuetify.breakpoint.xsOnly}">
                  <v-form ref="form" v-model="valid" class="text-xs-center pa-3">
                    <!-- <p class="text-xs-center"></p> -->
                    <v-text-field
                      label="Full Name" class="mb-0" browser-autocomplete="name"
                      v-model="form.name" outline
                      :rules="nameRules" color="secondary" validate-on-blur required>
                      <v-icon slot="prepend-inner" color="teal">person</v-icon>
                    </v-text-field>

                    <v-text-field 
                      label="Email" class="mb-0" browser-autocomplete="email"
                      v-model="form.email" outline
                      :rules="emailRules" color="secondary" validate-on-blur
                      required type="email">
                      <v-icon slot="prepend-inner" color="teal">mail</v-icon>
                    </v-text-field>

                    <v-text-field class="mb-0"
                      v-model="form.password" outline
                      :rules="passwordRules" color="secondary" validate-on-blur
                      type="password" label="Password" 
                      required>
                      <v-icon slot="prepend-inner" color="teal">lock</v-icon>
                    </v-text-field>

                    <v-text-field required
                      v-model="form.password2" outline
                      type="password" color="secondary" validate-on-blur
                      :rules="passwordRules"
                      name="password2"
                      label="Confirm Password">
                      <v-icon slot="prepend-inner" color="teal">lock</v-icon>
                    </v-text-field>
                  </v-form>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-text>
                  <!-- <v-subheader class="px-4">Are you a student? </v-subheader> -->
                  <v-radio-group v-model="form.is_student" row class="px-3">
                    <v-radio label="I am a student" :value="true"></v-radio>
                    <v-radio label="I am not a student" :value="false"></v-radio>
                  </v-radio-group>
                  <v-form ref="form2" v-if="form.is_student == true" v-model="valid2" class="text-xs-center pa-3">
                    <v-autocomplete
                      v-model="mySchool" hint="Select your school"
                      :items="schools" return-object item-text="text" hide-no-data outline class="mb-0"
                      label="School" persistent-hint color="secondary" validate-on-blur>
                      <v-icon slot="prepend-inner" color="teal">school</v-icon>
                    </v-autocomplete>

                    <v-autocomplete color="secondary" validate-on-blur
                      label="Faculty"  v-model="myFaculty" :items="mySchool.faculties"
                      return-object item-text="text" outline class="mb-0" hide-no-data
                      :rules="nameRules" required >
                      <v-icon slot="prepend-inner" color="teal">domain</v-icon>
                    </v-autocomplete>
                    <v-autocomplete label="Department" outline class="mb-0" hide-no-data
                      v-model="myDepartment" :items="myFaculty.departments" required
                      return-object item-text="text" :rules="nameRules" color="secondary" validate-on-blur>
                      <v-icon slot="prepend-inner" color="teal">place</v-icon>
                    </v-autocomplete>
                  </v-form>
                  <div class="text-xs-center">
                  <span class="caption grey--text text--darken-1">
                    * Please note that you need to be a student to paticipate in student elections
                  </span><br>
                  <small class="grey--text text--darken-1">By signing up, you agree with our </small><br>
                  <small class="grey--text text--darken-1">
                    <router-link to="#">Terms of Use</router-link> and <router-link to="#"> Privacy Policy</router-link></small>
                  </div>
                </v-card-text>
              </v-window-item>

            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn :disabled="step === 1" flat @click="step--">
                Back
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="step !== 3"
                :disabled="!valid || (step === 2 && !valid2 && form.is_student == true)"
                color="success" :loading="loading" 
                depressed @click="next"
              >
                {{step == 2 ? 'Finish' : 'Continue'}}
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- <v-card v-else>
            <v-card-text>
              Check your email to confirm your registration
              <p>Didn't get the verification link ? <br>
                <v-btn color="info" flat @click="sendVerificationLInk(true)" :disabled="disabled" :loading="loading">Resend verification link</v-btn>
              </p>
            </v-card-text>
          </v-card> -->

          <v-subheader class="ml-5 white--text">Already have an account? 
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
    title:'Sign Up | Facevote',
    app_title: 'Facevote',
    step: 1,
    message: 'Login',
    snackbar: {},
    loading: false,
    disabled: false,
    verification_sent: false,
    form: {
      name: '',
      email: '',
      is_student: true, // whether is student or not
      password: '',
      password2: '',
    },
    mySchool: '',
    myFaculty: '',
    myDepartment: '',
    schools: [],
    select: null,
    show3: false,
    show4: false,
    valid: true,
    valid2: true,
    nameRules: [
      v => !!v || 'This field is required',
    ],
    passwordRules: [
      v => !!v || 'Please enter your password',
      v => (v && v.length >= 6) || 'Password must be at least 6 characters'
    ],
    passwordMatch: [
      v => !!v || 'Please enter your password',
      v => (v && v.length >= 6) || 'Password must be at least 6 characters',
      v => this.form.password === this.form.password2 || 'Passwords do not match'
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    checkbox: false
  }),
  components:{
    // 'toolbar':Nav,
    footr:Footer
  },
  computed: {
    currentTitle () {
      switch (this.step) {
        case 1: return 'Sign Up For Free'
        case 2: return 'Almost done...'
        default: return 'Account created'
      }
    }
  },
  methods:{
    next(){
      this.step == 2 ? this.submit() : this.step++
    },
    async getSchools(){
      try {
        let schls = await api().post('dashboard/getSchools')
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
      this.loading = true
      return new Promise((resolve, reject)=>{
        if(firebase.auth().currentUser){

          firebase.auth().currentUser.sendEmailVerification().then(done=>{
            resolve(done)
            if(alert){
              this.disabled = true;
              this.loading = false
  
              this.snackbar = {
                show: true,
                message: 'Email verification link resent',
                color: 'purple'
              }
            }
          }).catch(err => reject(err))
        }
      })
    },
    async send(){
      if(this.form.password !== this.form.password2){
        this.snackbar = {status:true,color:'error', message:'Passwords do not match'}
      }
      else{
        let user_school = this.mySchool.text
        let user_faculty = this.myFaculty.text
        let user_department = this.myDepartment.text
        this.loading = true
        
        let user = this.form
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
          .then(userRecord=>{
            // console.log(userRecord)
            // update users profile info
            firebase.auth().currentUser.updateProfile({
              displayName: user.name,
            }).catch(function(error) {
                // An error happened.
            });

            // store additional user info
            db.collection('moreUserInfo').doc(userRecord.user.uid).set({
              uid: userRecord.user.uid,
              name: user.name,
              email: user.email,
              followers: 0,
              is_verified: false,
              is_student: user.is_student,
              was_once_a_student: user.is_student,
              sch: user_school,
              fac: user_faculty,
              dept: user_department
            }).then(done=>{
              this.snackbar = {show:true,color:'purple', message:'Account created successfully'}
              
              this.$router.push('/home')
              
              // send email verification message
                // this.sendVerificationLInk().then((sent)=>{
                //   // console.log({sent})
                //   this.verification_sent = true
                //   // Email sent. Sign out user
                //   this.loading = false
                //   // firebase.auth().signOut().then(()=>{
                //   //   // console.log('logged out')
                //   // })

                // }).catch(function(error) {
                //   // An error happened.
                //   this.loading = false
                //   // console.log(error)
                // })
              
            })
          })
          .catch((error) =>{
            
            this.loading = false
            $NProgress.done()
            var errorCode = error.code;

            if(errorCode == 'auth/weak-password' || errorCode == 'auth/invalid-email' 
              || errorCode == 'auth/email-already-in-use' || errorCode == "auth/network-request-failed"){

              this.snackbar = {
                show: true,
                color: 'error',
                message: error.message}
            }else{
              this.snackbar = {
                show: true,
                color: 'error',
                message: 'Something went wrong, please try again'
              }
            }
          });
        
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
  import Footer from '@/components/Footer'
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


