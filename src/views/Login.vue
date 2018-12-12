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
            <v-subheader class="white--text text-xs-center d-block">Log in to your account</v-subheader>
            <v-card dark flat tile style="background:inherit">
              <!--v-toolbar dark dense flat style="background:inherit;text-align:center;">
                <v-toolbar-item class="text-xs-center">Login</v-toolbar-item>
              </v-toolbar-->
              <v-card-text>
                
                <v-form v-model="valid" ref="form">
                  <v-text-field label="Username" color="teal" outline class="mb-2" 
                    v-model="form.username" :rules="nameRules" browser-autocomplete="username"
                    prepend-inner-icon="person" required>
                  </v-text-field>
                  <v-text-field id="text-field" color="teal" prepend-inner-icon="lock" 
                    outline  v-model="form.password" type="password" :rules="passwordRules"
                    browser-autocomplete="password" label="Password" hint="At least 6 characters" 
                    required>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="px-3">
                <v-btn type="submit" block :dark="valid"  @click.prevent="submit" color="success" :disabled="!valid" 
                   :loading="loading">
                  Continue
                </v-btn>
                
              </v-card-actions>
              <p class="ml-5 pb-1">Don't have an account? 
                <router-link to="/signup" class="pl-2 success--text" style="text-decoration:none;"> Sign up here</router-link>
              </p>
              <p class="ml-5">
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
    description:'',
    message:'',
    loading:false,
    snackbar:false,
    show_spinner:false,
    form:{
      name: '',
      username:'',
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
      v => !!v || 'Please enter your username',
    ],
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
      
    },
  methods:{
    async submit(){
      try{
        if(this.$refs.form.validate()){
          this.loading = true
          //console.log(this.form)
          let res = await authService.Login(this.form)
          //console.log(res.data)
          this.$store.dispatch('setUser', {user:res.data.user,token:res.data.token})
          //this.$store.dispatch('setLoggedInUser', res.data.user)
          this.$router.push('/')
          this.loading = false
        }
        else{
          this.snackbar = true
          this.message = 'Please provide username and password'
        }
      }
      catch(err){
        console.log(err)
        console.log(err.response)
        if(err.response){
          this.loading = false
          this.snackbar = true
          this.message = err.response.data.message
          $NProgress.done()
        }else{
          this.loading = false
          this.snackbar = true
          this.message = 'Sorry, something went wrong. Try again'
          $NProgress.done()
        }
      }
    }
  }
}

import Nav from '@/components/Nav'
  import Footer from '@/components/Footer'
  //import { validationMixin } from 'vuelidate'
  //import { required, minLength, email, password } from 'vuelidate/lib/validators'
  import authService from '@/services/authService'
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


