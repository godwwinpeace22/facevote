<template>
  <v-app class="cc">
    <!--toolbar></toolbar-->
    <vue-headful
      :title="title"
      :description="description"
    />

    <v-snackbar v-model="snackbar.show" dark color="error" 
      :timeout="5000" :vertical="$vuetify.breakpoint.xsOnly" top right>
      {{ snackbar.message }}
      <v-btn dark flat color="black" @click="snackbar = {}"> Close</v-btn>
    </v-snackbar>

    <v-content>
      <v-container fluid fill-height class="cc login">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            
            <h1 class="text-xs-center white--text mb-3" ><a href="/" style="text-decoration:none;color:#fff"> Contestr</a></h1>
            <v-subheader class="white--text text-xs-center d-block">Recover your account</v-subheader>
            <v-card flat class="pb-1" v-if="!show">
              <v-card-text>
                <v-card-title class="text-xs-center d-block mb-5 headline grey--text">Reset Your Password</v-card-title>
                <v-form v-model="valid" ref="form">
                  <v-text-field label="Enter your email" color="teal" outline class="mb-2" v-model="form.email" 
                    :rules="emailRules" browser-autocomplete="email" prepend-inner-icon="mail" required>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="px-3">
                <v-btn type="submit" block :dark="valid"  @click.prevent="submit" 
                    color="success" :disabled="!valid" depressed :loading="loading">
                  Request reset
                </v-btn>
                
              </v-card-actions>
              <p class="ml-5 pb-0" style="text-decoration:none;">Don't have an account? <router-link to="/signup" style="text-decoration:none;" class="pl-2 success--text"> Sign up here</router-link></p>
              <p class="ml-5">Remember your password ?<router-link to="/login" class="primary--text pl-2" style="text-decoration:none;">Login</router-link></p>
            </v-card>
            <v-card v-else>
              <v-card-title class="title text-xs-center">
                Your password reset email has been sent!
              </v-card-title>
              <v-card-text>
                <p>We have sent you a password reset email to your email address</p>
                <p>Please check your inbox to continue - you might need to check the spam folder also.</p>
              </v-card-text>
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
    title:'Recover Account | Facevote',
    description:'',
    loading:false,
    snackbar:{},
    show:false,
    form:{
      email: '',
    },
    valid:true,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
  }),
  components:{
    'toolbar':Nav,
    footr:Footer
  },
  computed: {
      
    },
  methods:{
    async submit(){
      try{
        if(this.$refs.form.validate()){
          this.loading = true
          await this.sendPasswordReset(this.form.email)
          
          this.loading = false
          this.show = true
        }
        else{
          this.loading = false
          this.snackbar = {show:true, message:'Please provide email'}
          $NProgress.done()
        }
      }
      catch(err){
        this.loading = false
        this.snackbar = {show:true, message:err.message}
        $NProgress.done()
      }
    },
    async sendPasswordReset(email){
      try{
        let res = await firebase.auth()
        .sendPasswordResetEmail(email)
        return res
      }catch(err){
        //this.snackbar = {show:true, message:err.message}
        // console.log(err)
        throw new Error('Something went wrong')
      }
    }
  }
}

import Nav from '@/components/Nav'
  import Footer from '@/components/Footer'
  import api from '@/services/api'
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


