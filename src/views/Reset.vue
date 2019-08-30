<template>
  <v-app class="cc">
    <!--toolbar></toolbar-->
    <vue-headful
      :title="title"
      :description="description"
    />
    <v-content>
      <v-container fluid fill-height class="cc login">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            
            <v-snackbar :value="snackbar" color="error"
              :timeout="3000" top :vertical="$vuetify.breakpoint.smAndDown">
              {{ message }}
              <v-btn dark flat @click="snackbar = false"> Close</v-btn>
            </v-snackbar>

            <h1 class="text-xs-center white--text mb-3" ><a href="/" style="text-decoration:none;color:#fff"> Contestr</a></h1>
            
            <v-card flat class="pb-1" v-if="!success">
              <v-card-text>
                <v-card-title class="text-xs-center mb-5 headline grey--text">Reset Your Password</v-card-title>
                <v-form v-model="valid" ref="form">
                  <v-text-field label="Enter new password" color="teal" outline class="mb-2" v-model="form.password" 
                    :rules="passwordRules" type="password" browser-autocomplete="email" prepend-inner-icon="lock" required>
                  </v-text-field>
                  <v-text-field label="Confirm password" color="teal" outline class="mb-2" v-model="form.password2" 
                    :rules="passwordRules" type="password" browser-autocomplete="password" prepend-inner-icon="lock" required>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="px-3">
                <v-btn type="submit" block :dark="valid"  @click.prevent="reset" 
                    color="success" :disabled="!valid" depressed :loading="loading">
                  Reset
                </v-btn>
                
              </v-card-actions>
              <p class="ml-5 pb-0" style="text-decoration:none;">Don't have an account? <router-link to="/signup" style="text-decoration:none;" class="pl-2 success--text"> Sign up here</router-link></p>
              <p class="ml-5">Remember your password ?<router-link to="/login" class="primary--text pl-2" style="text-decoration:none;">Login</router-link></p>
            </v-card>
            <v-card v-if="success">
              <v-card-title class="title">
                Password reset successful!
              </v-card-title>
              <v-card-text>
                <p>Your password has been reset successfully. You can now login with your new password.</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="secondary" to="/login" depressed>Login</v-btn>
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
    description:'',
    message:'',
    loading:false,
    snackbar:false,
    show:false,
    form:{
      email: '',
    },
    valid:true,
    success:false,
    passwordRules: [
      v => !!v || 'Please enter your password',
      v => (v && v.length >= 4) || 'Password must be at least 4 characters'
    ],
  }),
  components:{
    'toolbar':Nav,
    footr:Footer
  },
  computed: {
    title(){
      return `Recover Account | ${this.$appName}`
    },
  },
  methods:{
    async reset(){
      try{
        if(this.$refs.form.validate()){
          this.loading = true
          // console.log(this.$route.query.token)
          let res = await api().post('users/reset', {
            ...this.form,
            reset_password_token:this.$route.query.token
          })
          
          this.loading = false
          this.success = true
        }
        else{
          this.snackbar = true
          this.message = 'Please provide email'
          $Nprogress.done()
        }
      }
      catch(err){
        this.snackbar = true
        this.message = err.response.data.message
        $Nprogress.done()
      }
    }
  },
  async mounted(){
    document.getElementById('welcome_logo').style.display = 'none'
  }
}

import Nav from '@/components/Nav'
  import Footer from '@/components/Footer'
  import api from '@/services/api2'
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


