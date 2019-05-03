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
              <v-btn dark flat @click="snackbar.show = false"> Close</v-btn>
            </v-snackbar>

            <h1 class="text-xs-center white--text mb-3" ><a href="/" style="text-decoration:none;color:#fff"> {{app_title}}</a></h1>
            <v-subheader class="white--text text-xs-center d-block">Log in to your account</v-subheader>
            <v-card dark flat tile style="background:inherit">
              <!--v-toolbar dark dense flat style="background:inherit;text-align:center;">
                <v-toolbar-item class="text-xs-center">Login</v-toolbar-item>
              </v-toolbar-->
              <v-card-text>

                <template v-if="can_resend_verification">
                  <p class="error--text text-xs-center">A link has been sent to your email. Click on that link to verify your email</p>
                  <p class="error--text text-xs-center">Didn't get the link ? 
                    <v-btn color="info" @click="sendVerificationLInk" :disabled="sending" flat>Resend link</v-btn>
                  </p>
                </template>

                <v-form v-model="valid" ref="form">
                  <v-text-field label="Email" color="teal" outline class="mb-2" 
                    v-model="form.email" :rules="nameRules" browser-autocomplete="email"
                    required>
                     <v-icon slot="prepend-inner" color="teal">mail</v-icon>
                  </v-text-field>
                  <v-text-field id="text-field" color="teal" 
                    outline  v-model="form.password" type="password" :rules="passwordRules"
                    browser-autocomplete="password" label="Password" 
                    required>
                     <v-icon slot="prepend-inner" color="teal">lock</v-icon>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="px-3">
                <v-btn type="submit" block :dark="valid"  @click.prevent="submit" color="success" :disabled="!valid" 
                   :loading="loading">
                  Login
                </v-btn>
                
              </v-card-actions>
              <p class="ml-5 pb-1">Don't have an account? 
                <router-link to="/signup" class="pl-2 success--text" style="text-decoration:none;"> Sign up here</router-link>
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
    title:'Login | Facevote',
    app_title:'Facevote',
    loading:false,
    sending:false,
    can_resend_verification: false,
    snackbar:{},
    show_spinner:false,
    form:{
      email: '',
      password:'',
      password2:'',
    },
    select: null,
    show3: false,
    show4: false,
    valid:true,
    checkbox: false,
    nameRules: [
      v => !!v || 'Please enter your email',
    ],
    passwordRules: [
      v => !!v || 'Please enter your password'
    ],
  }),
  components:{
    // 'toolbar':Nav,
    footr:Footer
  },
  computed: {
      
    },
  methods:{
    sendVerificationLInk(){
      this.sending = true
      return new Promise((resolve, reject)=>{
        firebase.auth().currentUser.sendEmailVerification().then(done=>{
          resolve(done)
          
          this.disabled = true;
          this.sending = false

          this.snackbar = {
            show: true,
            message: 'Email verification link resent',
            color: 'purple'
          }
        }).catch(err => reject(err))
      })
    },
    async submit(){
      try{
        if(this.$refs.form.validate()){
          this.loading = true

          firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
          .then((result)=>{
            // console.log(result.user)
            
            firebase.auth().onAuthStateChanged((user)=>{
              if (user) {
                if(user.emailVerified){
                  this.$store.dispatch('setUser', result.user)
                  this.$router.push('/home')
                }
                else{
                  this.can_resend_verification = true
                  this.loading = false
                }
                
              } else {
                // No user is signed in.
              }
            });
            
          }).catch(error=> {
            // console.log(error)
            this.loading = false
            function errorMsg(code){
              switch(code){
                case "auth/user-not-found":
                  return "Sorry we couldn't find that account"
                case "auth/wrong-password":
                  return "The email or password is invalid"
                case "auth/network-request-failed":
                  return "Network error, Check your internet connection"
                default:
                  return "Something went wrong, try again"
              }
            }
            this.snackbar = {
              show:true,
              message:errorMsg(error.code),
              color:'error'
            }
          });
          
        }
        else{
          this.snackbar = {
            show:true, 
            message:'Please provide username and password',
            color:'error'
          }
          
        }
      }
      catch(err){
        // console.log(err)
        this.loading = false
        $NProgress.done()
        if(err.errorCode){
          
          this.snackbar = {
            show:true,
            message:err.message,
            color:'error'
          }
        }else{
          
          this.snackbar = {
            show:true,
            message:'Sorry, something went wrong. Try again',
            color:'error'
          }
          
        }
      }
    }
  },
  mounted(){
    document.getElementById('welcome_logo').style.display = 'none'
  }
}

// import Nav from '@/components/Nav'
  import Footer from '@/components/Footer'
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
    .theme--light.v-text-field--outline .v-input__slot {
  border: 1px solid rgba(115, 114, 114, 0.54) !important;
}
  
</style>


