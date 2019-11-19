<template>
  <v-app class="cc">
    <!--toolbar></toolbar-->
    <vue-headful
      :title="title"
    />
    <v-content>
      <v-container fluid fill-height class="cc login">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            
            <v-snackbar v-model="snackbar.show" :color="snackbar.color"
              :timeout="5000" top :vertical="$vuetify.breakpoint.xsOnly">
              {{ snackbar.message }}
              <v-btn dark text @click="snackbar.show = false"> Close</v-btn>
            </v-snackbar>

            <h1 class="text-center white--text mb-3" >
              <a href="/" style="text-decoration:none;color:#fff">
                {{$appName}}
              </a>
            </h1>

            <v-subheader class="white--text text-center d-block">Log in to your account</v-subheader>

            <v-card dark flat tile style="background:inherit">
              <!--v-toolbar dark dense flat style="background:inherit;text-align:center;">
                <v-toolbar-item class="text-center">Login</v-toolbar-item>
              </v-toolbar-->

              <v-alert
                transition="fade-transition"
                :type="alert.type"
                :value="alert.show"
              >
                {{alert.message}}
              </v-alert>

              <v-btn color="orange" 
                text block 
                v-if="confirm_text.show || $route.query.verify_email"
                @click="sendVerificationLInk(true)" 
                :loading="sending_link"
                class="text-capitalize">
                Resend verification link
              </v-btn>
              <v-card-text>

                <v-form v-model="valid" ref="form">

                  <!-- <v-text-field label="Email" color="teal" 
                    outlined class="mb-2" 
                    v-model.lazy="$v.form.email.$model" 
                    :error-messages="emailErrors"
                    required>
                     <v-icon slot="prepend-inner" color="teal">mdi-email</v-icon>
                  </v-text-field> -->

                  <v-text-field label="Username" color="teal" 
                    outlined class="mb-2" 
                    v-model.lazy="$v.form.username.$model" 
                    :error-messages="usernameErrors"
                    required>
                     <v-icon slot="prepend-inner" color="teal">mdi-account</v-icon>
                  </v-text-field>

                  <v-text-field 
                    id="text-field" color="teal" 
                    outlined  
                    v-model.lazy="$v.form.password.$model" type="password" 
                    label="Password" validate-on-blur 
                    :error-messages="passwordErrors"
                    required>
                     <v-icon slot="prepend-inner" color="teal">mdi-lock</v-icon>
                  </v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions class="px-3">

                <v-btn type="submit" block :dark="valid"  
                  @click.prevent="submit" color="success" 
                   :loading="loading">
                  Login
                </v-btn>
                
              </v-card-actions>

              <p class="ml-5 pb-1">
                Don't have an account? 

                <router-link to="/signup" 
                  class="pl-2 success--text" 
                  style="text-decoration:none;">
                  Sign up here
                </router-link>
              </p>

              <p class="ml-5 pl-5">
                <router-link to="/reset-password" class="primary--text" style="text-decoration:none;">
                Forgot your password ?</router-link>
              </p>

            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <footr></footr>
  </v-app>
</template>
<script>
export default {
  data:()=>({
    loading: false,
    alert: {show: false},
    sending_link: false,
    confirm_text: {
      type: 'info',
      text: 'Please verify your email address'
    },
    snackbar: {},
    show_spinner: false,
    form: {
      email: '',
      username: '',
      password: ''
    },
    select: null,
    show3: false,
    show4: false,
    valid: true,
    checkbox: false,
  }),
  validations: {
    form: {
      // email: {
      //   required, email
      // },
      username: {
        required
      },
      password: {
        required
      }
    }
  },
  computed: {
    title(){
      return `Login | ${this.$appName}`
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required && errors.push('Password is required.')
      return errors
    },
    usernameErrors () {
      const errors = []
      if (!this.$v.form.username.$dirty) return errors
      !this.$v.form.username.required && errors.push('Username is required')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.email && errors.push('Must be valid e-mail')
      !this.$v.form.email.required && errors.push('E-mail is required')
      return errors
    }
  },
  methods:{
    sendVerificationLInk(){
      this.sending_link = true
      return new Promise((resolve, reject)=>{
        if(firebase.auth().currentUser){

          firebase.auth().currentUser.sendEmailVerification().then(done=>{
            
            this.sending_link = false
  
            this.confirm_text = {
              show: true,
              text: 'Verification link resent',
              type: 'success'
            }
            resolve(done)
          }).catch(err => reject(err))
        }
        else{
          // console.log('else')
        }
      })
    },
    async submit(){
      try{
        
        this.$v.form.$touch()

        let errors = this.$v.form.$anyError
      
        if(errors === false){
          this.loading = true

          try {
            this.form.returnTo = this.$route.query.returnTo
            let done = await Auth.login({
              ...this.form
            })

          } catch (error) {

            console.log(error)
            this.loading = false

            this.snackbar = {
              show: true,
              message: error,
              color: 'error'
            }
          }
          

          // firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
          // .then((result)=>{
          //   // console.log(result.user)
          //   this.loading = false

          //   firebase.auth().onAuthStateChanged((user)=>{
          //     if (user && user.emailVerified) {

          //       firebase.auth().currentUser.getIdTokenResult()
          //       .then((idTokenResult) => {
                  
          //         this.$store.dispatch('setUser', user)
          //         // this.$store.dispatch('setUserInfo', idTokenResult.claims)
          //         let isFirstTime = this.$route.query.new
          //         let returnTo = this.$route.query.returnTo
          //         // console.log(this.$route.query)
          //         let link = isFirstTime ? '/home?new=true' : returnTo ? returnTo : '/home'
                  
          //         this.$router.push(link)
          //       })
                
                
          //     } else {
          //       this.confirm_text = {
          //         show: true,
          //         text: 'Please verify your email address',
          //         type: 'info'
          //       }
          //       // console.log(user.emailVerified)
          //       // No user is signed in.
          //     }
          //   });
            
          // }).catch(error=> {
          //   // console.log(error)
          //   this.loading = false
          //   function errorMsg(code){
          //     switch(code){
          //       case "auth/user-not-found":
          //         return "Sorry we couldn't find that account"
          //       case "auth/wrong-password":
          //         return "The email or password is invalid"
          //       case "auth/network-request-failed":
          //         return "Network error, Check your internet connection"
          //       default:
          //         return "Something went wrong, try again"
          //     }
          //   }
          //   this.snackbar = {
          //     show: true,
          //     message: errorMsg(error.code),
          //     color: 'error'
          //   }
          // });
          
        }
        else{
          this.snackbar = {
            show: true, 
            message: 'Please provide username and password',
            color: 'error'
          }
          
        }
      }
      catch(err){
        // console.log(err)
        this.loading = false
        // this.$Nprogress.done()
        if(err.errorCode){
          
          this.snackbar = {
            show: true,
            message: err.message,
            color: 'error'
          }
        }else{
          
          this.snackbar = {
            show: true,
            message: 'Sorry, something went wrong. Try again',
            color: 'error'
          }
          
        }
      }
    }
  },
  mounted(){
    document.getElementById('welcome_logo').style.display = 'none'
    // console.log(this.$store.state)
  },
  components:{
    // 'toolbar':Nav,
    footr:Footer
  },
}

  import Footer from '@/components/Footer'
  import Auth from '@/plugins/auth'
  import { required, email } from 'vuelidate/lib/validators'
  // import { validationMixin } from 'vuelidate'
  // import {firebase, db, database} from '@/plugins/firebase'
</script>
<style lang="scss">
  @mixin MainColor(){
    //background:#fdba1e;
    background:#042943;
    color:#fff;
  }
  .cc{
    background:#042943;
    //background:#e8e8e8;
  }
  .login{
    .v-input{
      margin-top:0;
    }
    .form_buttons button{
      text-transform:none;
    }
    #i_have_an_account{
      font-size: 12px;
    }
    .pad{
      margin-top:25%;
    }
  }
  
</style>


