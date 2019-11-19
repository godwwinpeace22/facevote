<template>
  <div>
    <navigation>
      <span slot="title">Profile Settings</span>
    </navigation>
    
    <v-container>
      
      <v-row>
        <v-col cols="12" sm="8" class="pt-0">

          <v-row >
            <v-col cols="12" sm="10">
              <v-card outlined>
                <v-card-title> Basic Info</v-card-title>
                <v-card-text class="mt-4">
                  <v-text-field class="mb-4 text-capitalize" required outlined dense v-model.trim="form.name" 
                    color="primary" autocomplete="name" :placeholder="getUser.name" 
                    label="Your Name">
                  </v-text-field>

                  <v-text-field required outlined dense v-model.trim="form.email"
                    color="primary" autocomplete="email" :placeholder="getUser.email" disabled
                    label="Your Email">
                  </v-text-field>

                  <v-text-field required outlined dense v-model.trim="form.username" 
                    color="primary" autocomplete="username" :placeholder="getUser.username"
                    label="Your Username" >
                  </v-text-field>

                  <v-text-field required outlined dense v-model.trim="form.phone"
                    color="primary" autocomplete="tel" :placeholder="getUser.phone || ''" 
                    label="Your Phone number" hint="e.g +2347099998888">
                  </v-text-field>

                  <v-textarea
                    label="About You"
                    name="about" outlined :placeholder="getUser.about"
                    rows="9" v-model.trim="form.about"
                  ></v-textarea>
                </v-card-text>
                
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-btn depressed 
                color="orange" 
                @click.native="updateProfile" 
                :disabled="disabled_save || loading || uploading" 
                :loading="loading">
                Save
              </v-btn>
            </v-col>

            <v-col cols="12" sm="10">
              <v-card outlined>
                <v-card-title>School</v-card-title>
                
                <v-container v-if="getUser.is_student">
                  <v-row column>
                    <template v-if="getUser && getUser.was_once_a_student">
                      <v-col cols="8">
                        <v-text-field class="mb-4" disabled small style="text-transform:capitalize"
                          color="primary" :placeholder="getUser ? getUser.sch : ''" 
                          label="Your School">
                        </v-text-field>
                      </v-col>
                      <v-col cols="8">
                        <v-text-field class="mb-4" disabled small style="text-transform:capitalize"
                          color="primary" :placeholder="getUser ? getUser.fac : ''" 
                          label="Your Faculty">
                        </v-text-field>
                      </v-col>
                      <v-col cols="8">
                        <v-text-field class="mb-4" disabled small style="text-transform:capitalize"
                          color="primary" :placeholder="getUser ? getUser.dept : ''" 
                          label="Your Department">
                        </v-text-field>
                      </v-col>
                    </template>
                    
                    <template v-else>
                      <v-col cols="8">
                        <v-select required small 
                          v-model="form.school" :items="getSchools" item-text="text" color="primary" 
                          label="School" >
                        </v-select>
                      </v-col>
                      <v-col cols="8">
                        <v-select required small 
                          v-model="form.faculty" :items="form.school.faculties" 
                          color="primary" item-text="text" item-value="value" label="Select faculty" >
                        </v-select>
                      </v-col>
                      <v-col cols="8">
                        <v-select required small 
                          v-model="form.department" :items="form.faculty.departments"
                          item-text="text" item-value="value"
                          color="primary" label="Select department">
                        </v-select>
                      </v-col>
                    </template>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>

            <v-col>
              <v-card flat>
                <v-card-title>
                  Verify Account
                </v-card-title>
                <v-card-text>
                  <v-btn color="success" depressed
                    to="/verify"
                    v-if="!is_verified">
                    Click to Verify
                  </v-btn>
                  <v-btn color="success" depressed
                    v-else>
                    Your account is verified
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

        </v-col>

        <v-col sm="4" cols="12">
          <v-card tile outlined style="min-height: 300px;">
            <v-hover :class="{profile_card: selected_file}">
              <v-container slot-scope="{ hover }">
                <v-img :src="blob_url || getUser.photoURL || `https://ui-avatars.com/api/?name=${getUser.displayName}&size=300`"
                  max-height="250" @click="openFileSelect">
                  <v-expand-transition>
                    <div v-if="hover" class=" transition-fast-in-fast-out teal darken-2 v-card--reveal display-5 white--text"
                      style="height: 100%;">
                      <v-icon x-large class="pt-5 text-center d-block">mdi-camera</v-icon>
                      <h3 class="mt-0 text-center d-block">Change profile photo</h3>
                    </div>
                  </v-expand-transition>
                </v-img>
                <v-btn color="success" class="mt-4" small outlined @click="openFileSelect">Change Photo</v-btn>
              </v-container>
            </v-hover>
            <v-card-actions class="ml-3">
              <v-btn dark :color="uploading ? 'grey' : 'teal'" class="text-capitalize d-block" @click="updatePhoto"
                v-if="selected_file" >{{upload_text}}
              </v-btn>
            </v-card-actions>
            <v-container v-if="uploading" class="py-0 px-0">
              <v-progress-linear :indeterminate="true" ></v-progress-linear>
            </v-container>
          </v-card>
        </v-col>


        
      </v-row>
    </v-container>
    <input type="file" style="visibility:hidden;position: absolute;" id="file" @change="onFileSelect($event)" accept="image/jpeg,image/png"/>
  </div>
</template>
<script>
export default {
  data: ()=>({
    upload_text:'Update photo',
    snackbar:{},
    loading: false, // to show the loading state on the save btn
    uploading: false, // when image is being uploaded
    disabled_fields: false,
    form: {
      name:'',
      email:'',
      username: '',
      phone:'',
      about: '',
      is_student: '',
      school:'',
      faculty:'',
      department:'',
      work:'',
      work_role:'',
    },
    selected_file:null,
    blob_url:null,
  }),
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'is_verified'
    ]),
    title(){
      return `Profile Settings | ${this.$appName}`
    },
    disabled_save(){
      return !this.form.name || !this.form.phone || !this.form.about
    }
  },
  methods: {
    openFileSelect(){
      document.getElementById('file').click()
    },
    onFileSelect(e){

      if(e.target.files[0].type == 'image/jpeg' || 
        e.target.files[0].type == 'image/jpg' || 
        e.target.files[0].type == 'image/png'
        
      ){
        let one_mb = 1000000
        if(e.target.files[0].size < one_mb){
          this.blob_url = URL.createObjectURL(e.target.files[0])
          this.selected_file = e.target.files[0]
        }
        else{
          alert('Please select an image that is less than 1mb')
          this.blob_url = null
          this.selected_file = null
        }
      }
      else{
        alert('Only images are allowed!')
        this.blob_url = null
        this.selected_file = null
        document.getElementById('file').value = ''
      }
    },
    async updatePhoto(){
      this.upload_text = 'Updating photo...'
      this.uploading = true

      firebase.auth().currentUser.getIdToken(true)
      .then(async idToken=>{

        let formData = new FormData()
        formData.append('file', this.selected_file)
        formData.append('idToken', idToken)

        try {
          let response = await api2().post( 'dashboard/updateUserProfilePhoto',
            formData,{
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          )

          firebase.auth().currentUser.getIdToken(true);
          this.selected_file = null
          this.blob_url = null
          this.upload_text = 'Update photo'
          this.uploading = false

          this.snackbar = {
            show: true,
            message: 'Photo updated successfully',
            color: 'purple'
          }

          let docRef = db.collection('moreUserInfo').doc(this.getUser.uid)
          let doc = await docRef.get()

          firebase.auth().onAuthStateChanged((user) => {
            if(user){
              user.photoURL = doc.data().photoURL
              this.$store.dispatch('setUser', user)
              this.$store.dispatch('setUserInfo', doc.data())
            }

          })

        } catch (error) {
          
          this.snackbar = {
            show: true,
            message: "Upload failed. Please try again",
            color: "error"
          }
          this.upload_text = 'Update photo'
          this.uploading = false
          this.$Nprogress.done()
        }
      })
    },
    async updateProfile(){

      this.loading = true
      try{

        this.$gun.get(this.getUser.username)
          .put({
            name: this.form.name || this.getUser.name,
            phone: this.form.phone || this.getUser.phone,
            about: this.form.about || this.getUser.about,
          })

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Profile updated',
          color: 'purple'
        })
        this.loading = false
      }
      catch(err) {

        this.$eventBus.$emit('Snackbar',{
          show: true,
          message: 'Profile update failed. Try again',
          color: 'error'
        })

        console.log(err)

        this.loading = false

      }
    },
    async setUp(data){
      try {
        
        // console.log(this.getUser.photoURL)
        // this.form.name = this.getUser.name
        // this.form.phone = this.getUser.phone || ''
        // this.form.username = this.getUser.username

        // if(this.getUser && !this.getUser.was_once_a_student){
        //   this.form.is_student = this.getUser.is_student
        //   await this.allSchools()
          
        // }
      } catch (error) {
        // console.log(error)
      }
      
    }
  },
  async mounted(){
    await this.setUp()
    // console.log(this.getUser)
    
  },
  components:{
    Navigation
  }
}

import api from '@/services/api'
import api2 from '@/services/api2'
import Navigation from '@/components/Navigation'
import { mapGetters, mapState } from 'vuex'
</script>

<style scss>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
    cursor:pointer;
  }
  .profile_card .v-image__image{
    filter:blur(2px) !important;
  }
</style>
