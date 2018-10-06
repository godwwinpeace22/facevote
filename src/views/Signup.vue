<template>
  <v-app id="cc">
    <toolbar></toolbar>
    <v-container>
      <v-layout >
        <v-flex md4 offset-md4 mt-5 style="margin-top:50%;">

          <v-snackbar v-model="snackbar" color="error" :timeout="30000" top>
            {{ message }}
            <v-btn dark flat @click="snackbar = null"> Close</v-btn>
          </v-snackbar>

          <v-card>
            <h3 class="pt-3" style="text-align:center;">Sign Up</h3>
            <form @submit.prevent='submit' class="pa-3 pt-3 text-xs-center">
              <p class="text-xs-center">Lorem ipsum dolor, sit amet consectetur adi </p>
              <v-text-field label="Full Name" v-model="form.name" prepend-icon="place" required></v-text-field>
              <v-text-field label="Username" v-model="form.username" prepend-icon="place" required ></v-text-field>
              <v-text-field label="Email" v-model="form.email" prepend-icon="place" required type="email" ></v-text-field>
              <v-text-field prepend-icon="place" required
                v-model="form.password"
                type="password"
                height=''
                label="Password"
              ></v-text-field>
              <v-text-field required
                v-model="form.password2"
                prepend-icon="place"
                type="password"
                name="password2"
                label="Repeat password"
              ></v-text-field>
              <v-flex class="form_buttons" d-flex mb-3>
                <v-btn type="submit" small flat style="background:#fdba1e;">
                  <!-- loading spinner -->
                  <loading-bar v-if="show_spinner"></loading-bar>
                  Submit
                </v-btn>
                <v-btn to="/login" small id="i_have_an_account">Or Login </v-btn>
              </v-flex>
              
            </form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    
  </v-app>
</template>
<script>

export default {
  mixins: [validationMixin],

  validations: {
    name: { required },
    username:{required},
    email: { required, email },
    password: { required,minLength: minLength(6) },
    checkbox: { required }
  },

  data:()=>({
    message:'Login',
    snackbar:false,
    show_spinner:false,
    form:{
      name: '',
      username:'',
      email: '',
      password:'',
      password2:'',
    },
    iHaveAnAccount:false,
    select: null,
    show3: false,
    show4: false,
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 6 || 'Min 6 characters',
      emailMatch: () => 'The email and password you entered don\'t match'
    },
    checkbox: false
  }),
  components:{
    ...VCard,
    ...VAvatar,
    ...VSubheader,
    ...VDivider,
    ...VTabs,
    ...VTooltip,
    ...VMenu,
    ...VForm,
    ...VCheckbox,
    ...VSelect,
    ...VTextField,
    ...VSnackbar,
    'toolbar':Nav,
    LoadingBar
  },
  computed: {
      
    },
  methods:{
    
    async submit(){
      try{
        this.$v.touch
        this.form['token'] = this.$store.getters.getToken
        this.show_spinner = true
        //console.log(this.form)
        let res = await  authService.Register(this.form)
        console.log(res.data)
        this.show_spinner = false
        this.$store.dispatch('setUser', {user:res.data.user,token:res.data.token})
        this.$router.push('/dashboard')
      }
      catch(err){
        console.log(err)
        console.log(err.response)
        if(err.response.status == 404){
          this.show_spinner = false
          this.snackbar = true
          this.message = 'Username is already taken'
        }
        else if(err.response.status == 401){
          this.show_spinner = false
          this.snackbar = true
          this.message = 'Please provide required fields'
        }
        else{

        }
      }
    }
  }
}

import Nav from '@/components/Nav'
  import LoadingBar from '@/spinners/LoadingBar'
  import * as VCard from 'vuetify/es5/components/VCard'
  import * as VAvatar from 'vuetify/es5/components/VAvatar'
  import * as VSubheader from 'vuetify/es5/components/VSubheader'
  import * as VDivider from 'vuetify/es5/components/VDivider'
  import * as VTabs from 'vuetify/es5/components/VTabs'
  import * as VMenu from 'vuetify/es5/components/VMenu'
  import * as VTooltip from 'vuetify/es5/components/VTooltip'
  import * as VForm from 'vuetify/es5/components/VForm'
  import * as VSelect from 'vuetify/es5/components/VSelect'
  import * as VTextField from 'vuetify/es5/components/VTextField'
  import * as VCheckbox from 'vuetify/es5/components/VCheckbox'
  import * as VSnackbar from 'vuetify/es5/components/VSnackbar'
  import { validationMixin } from 'vuelidate'
  import { required, minLength, email, password } from 'vuelidate/lib/validators'
  import authService from '@/services/authService'
</script>
<style lang="scss" scoped>
  @mixin MainColor(){
    //background:#fdba1e;
    background:#042943;
    color:#fff;
  }
  #cc{
    background:#042943;
  }
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
</style>


