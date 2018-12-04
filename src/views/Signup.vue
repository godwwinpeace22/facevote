<template>
  <v-app id="cc">
    <!--toolbar></toolbar-->
    <vue-headful
      :title="title"
      :description="description"
    />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>

          <v-snackbar v-model="snackbar" color="error" :timeout="30000" top>
            {{ message }}
            <v-btn dark flat @click="snackbar = null"> Close</v-btn>
          </v-snackbar>

          <h1 class="text-xs-center white--text mb-4" >Contestr</h1>
          
          <v-card class="" max-width="500">
            <v-card-title class="title font-weight-regular justify-space-around">
              <span>{{ currentTitle }}</span>
              
            </v-card-title>

            <v-window v-model="step">
              <v-window-item :value="1">
                <v-card-text>
                  <v-form ref="form" v-model="valid" class="text-xs-center pa-3">
                    <p class="text-xs-center">Lorem ipsum dolor, sit amet consectetur </p>
                    <v-text-field
                      label="Full Name" class="mb-2"
                      v-model="form.name" outline
                      :rules="nameRules" color="secondary"
                      prepend-icon="person" 
                      required>
                    </v-text-field>

                    <v-text-field
                      label="Username" class="mb-2"
                      v-model="form.username" outline
                      :rules="nameRules" color="secondary"
                      prepend-icon="person" 
                      required >
                    </v-text-field>

                    <v-text-field 
                      label="Email" class="mb-2"
                      v-model="form.email" outline
                      :rules="emailRules" 
                      prepend-icon="mail" color="secondary"
                      required type="email">
                    </v-text-field>

                    <v-text-field 
                      prepend-icon="lock" class="mb-2"
                      v-model="form.password" outline
                      :rules="passwordRules" color="secondary"
                      type="password"
                      label="Password" 
                      required>
                    </v-text-field>

                    <v-text-field required
                      v-model="form.password2" outline
                      prepend-icon="lock"
                      type="password" color="secondary"
                      :rules="passwordRules"
                      name="password2"
                      label="Confirm Password"
                    ></v-text-field>

                    <!--v-card-actions>
                      <v-btn type="submit" small color="success" 
                        :dark="valid" :disabled="!valid" 
                        :loading="loading" 
                        @click.prevent="submit">
                        Submit
                        <v-icon right>chevron_right</v-icon>
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn to="/login" small id="i_have_an_account">Or Login </v-btn>
                    </v-card-actions-->
                    
                  </v-form>
                  <span class="caption grey--text text--darken-1">
                    This is the email you will use to login to your Contestr account
                  </span>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-text>
                  <v-subheader class="pa-0">Are you a student? </v-subheader>
                  <v-radio-group v-model="form.is_student" row>
                    <v-radio label="I am a student" :value="true"></v-radio>
                    <v-radio label="I am not a student" :value="false"></v-radio>
                  </v-radio-group>
                  <v-form ref="form2" v-if="form.is_student == true" v-model="valid2" class="text-xs-center pa-3">
                    <v-autocomplete
                      v-model="form.school" hint="Select your school"
                      :items="states" hide-no-data outline class="mb-2"
                      label="School" persistent-hint color="secondary"
                      prepend-icon="person" >
                    </v-autocomplete>

                    <v-text-field color="secondary"
                      label="Faculty"  v-model="form.faculty" outline class="mb-2"
                      :rules="nameRules"  prepend-icon="person" required >
                    </v-text-field>
                    <v-text-field label="Department" outline class="mb-2"
                      v-model="form.department" :rules="nameRules" color="secondary"
                      prepend-icon="person" required >
                    </v-text-field>
                  </v-form>
                  <span class="caption grey--text text--darken-1">
                    Please note that you need to be a student to paticipate in student elections
                  </span>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="3">
                <div class="pa-3 text-xs-center">
                  <!--v-img class="mb-3" contain height="128"
                    src="https://cdn.vuetifyjs.com/images/logos/v.svg"></v-img-->
                  <h3>Please check your email to confirm your registration</h3>
                  <v-btn>Resend confirmation</v-btn>
                </div>
              </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn :disabled="step === 1" flat @click="step--">
                Back
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="step !== 3"
                :disabled="step === 3 || !valid || (step === 2 && !valid2 && form.is_student == true)"
                color="success" :loading="loading" 
                depressed @click="next"
              >
                {{step == 2 ? 'Finish' : 'Continue'}}
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-subheader class="ml-5 white--text">Already have an account? <router-link to="/login" class="pl-2"> Sign in</router-link></v-subheader>
        </v-flex>
      </v-layout>
      <!--v-layout row wrap v-else>
        <v-flex>
          <h3>Please check your email for the confirmation link sent to you</h3>
          <v-btn>Resend confirmation</v-btn>
        </v-flex>
      </v-layout-->
    </v-container>

    <footr></footr>
  </v-app>
</template>
<script>

export default {
  data:()=>({
    title:'Sign Up | Facevote',
    description:'',
    step:1,
    message:'Login',
    snackbar:false,
    loading:false,
    form:{
      name: '',
      username:'',
      email: '',
      is_student:true, // whether is student or not
      school:null,
      faculty:'',
      department:'',
      password:'',
      password2:'',
    },
    states: [
      'Alabama', 'Alaska', 'American Samoa', 'Arizona',
      'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'District of Columbia', 'Federated States of Micronesia',
      'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho',
      'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Marshall Islands', 'Maryland',
      'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
      'Missouri', 'Montana', 'Nebraska', 'Nevada',
      'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio',
      'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
      'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia',
      'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    select: null,
    show3: false,
    show4: false,
    valid:true,
    valid2:true,
    nameRules: [
      v => !!v || 'Please enter your username',
    ],
    passwordRules: [
      v => !!v || 'Please enter your password',
      v => (v && v.length >= 4) || 'Password must be at least 4 characters'
    ],
    passwordMatch: [
      v => !!v || 'Please enter your password',
      v => (v && v.length >= 4) || 'Password must be at least 4 characters',
      v => this.form.password === this.form.password2 || 'Passwords do not match'
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    checkbox: false
  }),
  components:{
    'toolbar':Nav,
    footr:Footer
  },
  computed: {
    currentTitle () {
      switch (this.step) {
        case 1: return 'Create your account'
        case 2: return 'Almost done...'
        default: return 'Account created'
      }
    }
  },
  methods:{
    next(){
      this.step == 2 ? this.submit() : this.step++
    },
    async submit(){
      try{
        // check if forms are valid before submit
        if((this.$refs.form && this.$refs.form2.validate()) && (this.$refs.form2 && this.$refs.form.validate())){
          // check if passwords match
          if(this.form.password !== this.form.password2){
            this.snackbar = true
            this.message = 'Passwords do not match'
          }
          else{
            console.log(this.form.password, this.form.password2)
            this.form['token'] = this.$store.getters.getToken
            this.loading = true
            //console.log(this.form)
            let res = await  authService.Register(this.form)
            console.log(res.data)
            this.loading = false
            //this.show_register = false
          }
        }
        else{
          this.snackbar = true
          this.message = 'Please provide all required fields'
        }
      }
      catch(err){
        console.log(err)
        console.log(err.response)
        if(err.response.status == 403){
          this.loading = false
          this.snackbar = true
          this.message = 'Username is already taken'
        }
        else if(err.response.status == 401){
          this.loading = false
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
  import Footer from '@/components/Footer'
  //import { validationMixin } from 'vuelidate'
  //import { required, minLength, email, password } from 'vuelidate/lib/validators'
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
    //background:#e8e8e8;
  }
  .v-input{
    margin-top:0;
  }
  .form_buttons button{
    text-transform:none;
  }
  
  //.theme--light.v-text-field--outline .v-input__slot {
   // border: 1px solid rgba(115, 114, 114, 0.54);
  //}
</style>


