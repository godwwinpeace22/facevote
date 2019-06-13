<template>
  <v-app class="cc">
    <!--toolbar></toolbar-->
    <vue-headful
      :title="title"
    />

    <v-snackbar v-model="snackbar.show" dark :color="snackbar.color" 
      :timeout="50000" :vertical="$vuetify.breakpoint.xsOnly" top right>
      {{ snackbar.message }}
      <v-btn dark flat color="black" @click="snackbar = {}"> Close</v-btn>
    </v-snackbar>

    <v-content>
      <v-container fluid fill-height class="cc login" >
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <h1 class="text-xs-center white--text mb-3" ><a href="/" style="text-decoration:none;color:#fff"> {{$appName}}</a></h1>
            <v-subheader class="white--text text-xs-center d-block">{{text}}</v-subheader>

            <v-btn color="success" class="d-block" style="line-height:2.5" depressed v-if="resend_password_verification"
              to="/reset-password">
              Resend link
            </v-btn>

            <v-card flat class="pb-1" v-if="show">
              <v-card-text>
                <v-card-title class="text-xs-center d-block mb-5 headline grey--text">Reset Your Password</v-card-title>
                <v-card-actions v-if="resend_password_verification">
                  <v-btn color="success" depressed v-if="resend_password_verification"
                  to="/reset-password">Resend link</v-btn>
                </v-card-actions>
                <v-form v-model="valid" ref="form">
                  <v-text-field label="Enter your email" color="teal" type="email" outline class="mb-2" v-model="form.email" 
                    :rules="emailRules" browser-autocomplete="email" prepend-inner-icon="mail" required>
                  </v-text-field>
                  <v-text-field label="Enter your new password" type="password" 
                    color="teal" outline class="mb-2" v-model="form.password" 
                    :rules="passwordRules" browser-autocomplete="password" 
                    prepend-inner-icon="lock" hint="Use a strong password" required>
                  </v-text-field>
                  <v-text-field label="Re-enter password" color="teal" 
                    type="password" outline class="mb-2" 
                    v-model="form.password2" hint="Use a strong password"
                    :rules="passwordRules" browser-autocomplete="password"
                     prepend-inner-icon="lock" required>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="px-3">
                <v-btn type="submit" block :dark="valid"  @click.prevent="submit" 
                    color="success" :disabled="!valid" depressed :loading="loading">
                  Reset Password
                </v-btn>
                
              </v-card-actions>
              
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
    snackbar: {},
    disabled: true,
    show: false,
    mode: '',
    actionCode: '',
    text: 'Account Recovery',
    resend_email_verification: false,
    resend_password_verification: false,
    form: {
      email: '',
      password: '',
      password2: '',
    },
    valid: true,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail is not valid'
    ],
    passwordRules: [
      v => !!v || 'Please provide password',
      v => v.length >= 6 || 'Password should be at least six characters long'
    ]
  }),
  computed: {
    title(){
      return `Account Recovery | ${this.$appName}`
    },
  },
  methods:{
    requestMode(){
      let auth = app.auth()
      let query = this.$route.query
      // console.log(query)
      this.mode = query.mode
      this.actionCode = query.oobCode

      switch (this.mode) {
        case 'resetPassword':
          // Check if user is logged in
          if(firebase.auth().currentUser){
            this.$router.push('/')
          }
          else{
            // Display reset password handler and UI.
            this.title = `Reset Your Password | ${this.$appName}`
            this.handleResetPassword(auth, this.actionCode);
          }
          
          break;
        case 'recoverEmail':
          // Display email recovery handler and UI.
          this.title = `Recover Email | ${this.$appName}`
          this.text = 'Recover Your Email'
          this.handleRecoverEmail(auth, this.actionCode);
          break;
        case 'verifyEmail':
          // Display email verification handler and UI.
          this.title = `Verify Email | ${this.$appName}`
          this.text = 'Verify Your Email'
          this.handleVerifyEmail(auth, this.actionCode);
          break;
        default:
          // Error: invalid mode.
          this.handleError()
      }
    },
    resetPassword(){
      // Save the new password.
      let newPassword = this.form.password
      let accountEmail = this.form.email

      app.auth().confirmPasswordReset(this.actionCode, newPassword).then(resp=> {
        // Password reset has been confirmed and new password updated. Sign the user in
        this.loading = false
        this.snackbar = {show:true,message:'Your password has been reset successfully', color:'purple'}
        app.auth().signInWithEmailAndPassword(accountEmail, newPassword);
        setTimeout(() => {
          this.$router.push('/home')
        }, 2000);

      }).catch(error=> {
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
        console.log(error)
        this.snackbar = {show:true,message:error.message, color:'error'}
      });
    },
    handleResetPassword(auth, actionCode) {
      // Verify the password reset code is valid.
      // console.log(actionCode)
      auth.verifyPasswordResetCode(actionCode).then(email=> {
        let accountEmail = email;
        this.form.email = accountEmail
        this.show = true
        
      }).catch(error=>{
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        // console.log(error)
        this.resend_password_verification = true
        this.snackbar = {show:true,message:'Invalid or expired token', color:'error'}
      });
    },
    handleRecoverEmail(auth, actionCode) {
      let restoredEmail = null;
      // Confirm the action code is valid.
      auth.checkActionCode(actionCode).then(function(info) {
        // Get the restored email address.
        restoredEmail = info['data']['email'];

        // Revert to the old email.
        return auth.applyActionCode(actionCode);
      }).then(function() {
        // Account email reverted to restoredEmail

        // TODO: Display a confirmation message to the user.

        // You might also want to give the user the option to reset their password
        // in case the account was compromised:
        auth.sendPasswordResetEmail(restoredEmail).then(function() {
          // Password reset confirmation sent. Ask user to check their email.
        }).catch(function(error) {
          // Error encountered while sending password reset code.
        });
      }).catch(function(error) {
        // Invalid code.
      });
    },
    handleVerifyEmail(auth, actionCode) {
      // Try to apply the email verification code.
      auth.applyActionCode(actionCode).then(resp=>{
        // Email address has been verified.
        this.snackbar = {show:true,message:'Email verified successfully. You can now login', color: 'purple'}
        
        setTimeout(() => {
          // this.$router.push('/home')
          firebase.auth().signOut()
        }, 1000);
        
      }).catch(error=>{
        // Code is invalid or expired. Ask the user to verify their email address
        // again.
        this.snackbar = {show: true, message: error.message, color:'error'}
        
      });
    },
    async submit(){
      try{
        if(this.$refs.form.validate()){
          this.loading = true
          await this.resetPassword()
          
        }
        else{
          this.loading = false
          this.snackbar = {show:true, message:'Please provide email'}
          //$Nprogress.done()
        }
      }
      catch(err){
        this.loading = false
        this.snackbar = {show:true, message:err.message}
        $Nprogress.done()
      }
    },
    handleError(){
      this.snackbar = {show:true,message:'Invalid action', color:'error'}
    },
  },
  mounted(){
    document.getElementById('welcome_logo').style.display = 'none'
    this.requestMode()
  },
  components:{
    // 'toolbar':Nav,
    footr:Footer
  },
}
// import Nav from '@/components/Nav'
  import Footer from '@/components/Footer'
  import {firebase, db, database} from '@/plugins/firebase'
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
    .pad{
      margin-top:25%;
    }
  }
    .theme--light.v-text-field--outline .v-input__slot {
  border: 1px solid rgba(115, 114, 114, 0.54) !important;
}
  
</style>