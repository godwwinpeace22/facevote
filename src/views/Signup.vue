<template>
  <v-app id="cc">
    <!--toolbar></toolbar-->
    <vue-headful
      :title="title"
      :description="description"
    />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md5>

          <v-snackbar v-model="snackbar" color="error" :timeout="30000" top>
            {{ message }}
            <v-btn dark flat @click="snackbar = null"> Close</v-btn>
          </v-snackbar>

          <h1 class="text-xs-center white--text mb-4" ><a href="/" style="text-decoration:none;color:#fff"> Contestr</a></h1>
          
          <v-card class="" max-width="800">
            <v-card-title class="title font-weight-bold justify-space-around">
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
                      :rules="nameRules" color="secondary" required>
                      <v-icon slot="prepend" color="teal">person</v-icon>
                    </v-text-field>

                    <v-text-field
                      label="Username" class="mb-2"
                      v-model="form.username" outline
                      :rules="nameRules" color="secondary"
                      required >
                      <v-icon slot="prepend" color="teal">person</v-icon>
                    </v-text-field>

                    <v-text-field 
                      label="Email" class="mb-2"
                      v-model="form.email" outline
                      :rules="emailRules" color="secondary"
                      required type="email">
                      <v-icon slot="prepend" color="teal">mail</v-icon>
                    </v-text-field>

                    <v-text-field class="mb-2"
                      v-model="form.password" outline
                      :rules="passwordRules" color="secondary"
                      type="password" label="Password" 
                      required>
                      <v-icon slot="prepend" color="teal">lock</v-icon>
                    </v-text-field>

                    <v-text-field required
                      v-model="form.password2" outline
                      type="password" color="secondary"
                      :rules="passwordRules"
                      name="password2"
                      label="Confirm Password">
                      <v-icon slot="prepend" color="teal">lock</v-icon>
                    </v-text-field>
                  </v-form>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-text>
                  <v-subheader class="px-4">Are you a student? </v-subheader>
                  <v-radio-group v-model="form.is_student" row class="px-3">
                    <v-radio label="I am a student" :value="true"></v-radio>
                    <v-radio label="I am not a student" :value="false"></v-radio>
                  </v-radio-group>
                  <v-form ref="form2" v-if="form.is_student == true" v-model="valid2" class="text-xs-center pa-3">
                    <v-autocomplete
                      v-model="mySchool" hint="Select your school"
                      :items="schools" return-object item-text="text" hide-no-data outline class="mb-2"
                      label="School" persistent-hint color="secondary">
                      <v-icon slot="prepend" color="teal">school</v-icon>
                    </v-autocomplete>

                    <v-select color="secondary"
                      label="Faculty"  v-model="myFaculty" :items="mySchool.faculties"
                      return-object item-text="text" outline class="mb-2"
                      :rules="nameRules" required >
                      <v-icon slot="prepend" color="teal">domain</v-icon>
                    </v-select>
                    <v-select label="Department" outline class="mb-2"
                      v-model="myDepartment" :items="myFaculty.departments" required
                      return-object item-text="text" :rules="nameRules" color="secondary">
                      <v-icon slot="prepend" color="teal">place</v-icon>
                    </v-select>
                  </v-form>
                  <div class="text-xs-center">
                  <span class="caption grey--text text--darken-1">
                    * Please note that you need to be a student to paticipate in student elections
                  </span><br>
                  <small class="grey--text text--darken-1">By signing up, you agree with Contesr's </small><br>
                  <small class="grey--text text--darken-1">
                    <router-link to="#">Terms of Use</router-link> and <router-link to="#"> Privacy Policy</router-link></small>
                  </div>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="3">
                <div class="pa-3 text-xs-center">
                  <!--v-img class="mb-3" contain height="128"
                    src="https://cdn.vuetifyjs.com/images/logos/v.svg"></v-img-->
                  <h3>Please check your email to confirm your registration</h3>
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
                <!--v-icon v-if="step == 1">arrow_forward</v-icon-->
              </v-btn>
            </v-card-actions>
          </v-card>
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
      password:'',
      password2:'',
    },
    mySchool:'',
    myFaculty:'',
    myDepartment:'',
    schools:[],
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
        case 1: return 'Create Your Account'
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
        console.log(schls)
        this.schools = schls.data
      } catch (error) {
        console.log(error)
      }
    },
    submit(){
      try{
        // check if forms are valid before submit
        if(this.form.is_student){
          if((this.$refs.form && this.$refs.form2.validate()) && (this.$refs.form2 && this.$refs.form.validate())){
            this.send()
          }else{
            this.snackbar = true
            this.message = 'Please provide all required fields'
          }
        }
        else{
          this.send()
        }
      }
      catch(err){
        console.log(err)
      }
    },
    async send(){
      try{
        if(this.form.password !== this.form.password2){
          this.snackbar = true
          this.message = 'Passwords do not match'
        }
        else{
          console.log(this.form.password, this.form.password2)
          this.form.school = this.mySchool.text
          this.form.faculty = this.myFaculty.text
          this.form.department = this.myDepartment.text
          this.loading = true
          //console.log(this.form)
          let res = await authService.Register(this.form)
          console.log(res.data)
          this.loading = false

          firebase.auth().signInWithCustomToken(res.data)
          .then((result)=>{
             console.log(result.user)
          })
          .catch(function(error) {
            // Handle Errors here.
            console.log(error)
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
          //this.step = 3
        }
      }catch(err){
        console.log(err)
        console.log(err.response)
        if(err.response){
          this.loading = false
          this.snackbar = true
          this.message = err.response.data.message
          $NProgress.done()
        }
      }
    }
  },
  mounted(){
    this.getSchools()
  }
}

import Nav from '@/components/Nav'
  import api from '@/services/api'
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
  .v-card{
    border-radius:6px;
  }
  //.theme--light.v-text-field--outline .v-input__slot {
   // border: 1px solid rgba(115, 114, 114, 0.54);
  //}
</style>


