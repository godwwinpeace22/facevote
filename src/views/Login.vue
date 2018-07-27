<template>
  <v-app id="cc">
    <toolbar></toolbar>
    <v-slide-y-transition mode="out-in">
      <v-layout >
        <v-flex md8 offset-md2 mt-5 style="margin-top:50%;">
          <v-card>
            <v-layout wrap>
              <v-flex d-flex xs5 >
                <v-card-media class="white--text"
                  
                  src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" dark tile color="secondary">
                  <v-container fill-height fluid style="background:rgba(0,0,0,0.8);">
                    <v-layout fill-height align-center justify-center>
                      <v-flex xs12  flexbox>
                        <span class="headline">Top 10 Australian beaches</span>
                        <v-spacer></v-spacer>
                        <p class="text-xs-left">Tiatur minus, set nulla dolor! Tenetur debitis culpa sed., set nulla dolor! Tenetur debitis culpa sed.</p>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-flex>

              <!--form -->
              <v-flex d-flex xs7>
                <v-card tile ml-5>
                  <v-layout>
                    <v-flex d-flex xs8 offset-xs2 mt-5 pt-5>
                      <form @submit.prevent='submit' >
                        <p v-if="iHaveAnAccount">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Gus eum. Ullam tempore totam magnam consectetur blanditiis exercitationem ab!</p>
                        <v-text-field v-if="!iHaveAnAccount" label="Full Name" v-model="form.name" prepend-icon="place" :rules='[rules.required]' required></v-text-field>
                        <v-text-field label="Username" v-model="form.username" prepend-icon="place" :rules='[rules.required]' required :class="iHaveAnAccount ? 'pad' : ''"></v-text-field>
                        <v-text-field v-if="!iHaveAnAccount" label="Email" v-model="form.email" prepend-icon="place" required
                          type="email" :rules='[rules.required]'>
                        </v-text-field>
                        <v-text-field prepend-icon="place" :append-icon="show3 ? 'visibility_off' : 'visibility'" required
                          v-model="form.password"
                          :rules="[rules.required, rules.min]"
                          :type="show3 ? 'text' : 'password'"
                          height=''
                          label="Password"
                          hint="At least 6 characters"
                          class="input-group--focused"
                          @click:append="show3 = !show3"
                        ></v-text-field>
                        <v-text-field v-if="!iHaveAnAccount" required
                          v-model="form.password2"
                          prepend-icon="place"
                          :append-icon="show4 ? 'visibility_off' : 'visibility'"
                          :rules="[rules.required, rules.emailMatch]"
                          :type="show4 ? 'text' : 'password'"
                          name="password2"
                          label="Repeat password"
                          hint="Passwords should match"
                          
                          class="input-group--focused"
                          @click:append="show4 = !show4"
                        ></v-text-field>
                        <v-flex class="form_buttons" d-flex mb-3>
                          <v-btn type="submit" small flat style="background:#fdba1e;">Submit
                            <v-icon>arrow_right</v-icon>
                          </v-btn>
                          <v-btn @click="iHaveAnAccount = !iHaveAnAccount" small id="i_have_an_account">{{iHaveAnAccount ? 'Or signup': 'I already have an account'}} </v-btn>
                        </v-flex>
                        
                      </form>
                    </v-flex>
                  </v-layout>
                  
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
    </v-layout>
    </v-slide-y-transition>
    
  </v-app>
</template>
<script>
import Nav from '@/components/Nav'
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
import { validationMixin } from 'vuelidate'
import { required, minLength, email, password } from 'vuelidate/lib/validators'
import authService from '@/services/authService'
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
    'toolbar':Nav
  },
  computed: {
      
    },
  methods:{
    
    clear () {
      this.$v.$reset()
      this.name = ''
      this.email = ''
      this.select = null
      this.checkbox = false
    },
    
    async submit(){
      try{
        this.$v.touch
        this.form['token'] = this.$store.getters.getToken
        let res = this.iHaveAnAccount ? await authService.Login(this.form) :await  authService.Register(this.form)
        console.log(res.data)
        this.$store.dispatch('setUser', {user:res.data.user,token:res.data.token})
        this.$router.push('/dashboard')
      }
      catch(err){
        console.log(err.response)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @mixin MainColor(){
    background:#fdba1e;
    color:#fff;
  }
  #cc{
    background:#fdba1e;
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


