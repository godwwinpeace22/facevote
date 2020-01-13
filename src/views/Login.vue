<template>
  <v-app class="cc">
    
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

              <v-card-actions class="px-3">

                <v-btn type="submit" block :dark="valid"  
                  @click.native="login" color="success" 
                   :loading="loading">
                  Signin With Blockstacks
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
    loading: false,
    snackbar: {},
  }),
  computed: {
    title(){
      return `Login | ${this.$appName}`
    },
  },
  methods:{
    login(){
      try {
        
        this.loading = true;
        userSession.redirectToSignIn()

      } catch (error) {
        console.log(error)
      }
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
    
  },
  components:{
    footr:Footer
  },
}

  import Footer from '@/components/Footer'
  import {userSession} from '@/plugins/userSession'
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
    
    .pad{
      margin-top:25%;
    }
  }
  
</style>


