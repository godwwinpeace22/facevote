<template>
  <v-card tile color="grey lighten-3">
    <v-toolbar card dark color="teal">
      <v-btn icon dark v-show="$vuetify.breakpoint.smAndUp"
        @click.native="$eventBus.$emit('hide_profile_settings', {})">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn dark :small="$vuetify.breakpoint.xs" tile color="grey lighten-1" outline @click.native="$eventBus.$emit('hide_profile_settings', {})">Cancel</v-btn>
      <v-btn depressed color="secondary" @click.native="updateProfile" :disabled="disabled_btn" :loading="saving">Save</v-btn>
    </v-toolbar>

    <v-card-text>
      <v-layout row wrap>
        <v-flex sm8 xs12>

          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm10 offset-sm1>
                <v-card  flat>
                  <v-card-text>Profile</v-card-text>
                  <v-card-text>
                    <v-text-field class="mb-4" required small v-model="form.name" style="text-transform:capitalize"
                      color="pink" browser-autocomplete="name" :placeholder="getUser.displayName" 
                      label="Your Name">
                    </v-text-field>

                    <v-text-field required small v-model="form.email" style="text-transform:capitalize"
                      color="pink" browser-autocomplete="email" :placeholder="getUser.email" 
                      label="Your Email">
                    </v-text-field>
                  </v-card-text>
                  
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>

          <v-container>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm10 offset-sm-3>
                <v-card tile>
                  <v-card-title>School</v-card-title>
                  <v-card-text>
                    
                    <v-checkbox
                      :label="form.is_student ? 'I am a student' : 'I am not a student'"
                      v-model="form.is_student"
                    ></v-checkbox>
                  </v-card-text>
                  <v-container v-if="form.is_student">
                    <v-layout column>
                      <v-flex xs10 d-flex>
                        <v-select required small :disabled="disabled_fields" 
                          v-model="form.school" :items="getSchools" item-text="text" color="pink" 
                          label="School" >
                        </v-select>
                      </v-flex>
                      <v-flex xs8 d-flex>
                        <v-select required small :disabled="disabled_fields" 
                          v-model="form.faculty" :items="form.school.faculties" 
                          color="pink" item-text="text" item-value="value" label="Select faculty" >
                        </v-select>
                      </v-flex>
                      <v-flex xs8 d-flex>
                        <v-select required small :disabled="disabled_fields" 
                          v-model="form.department" :items="form.faculty.departments"
                          item-text="text" item-value="value"
                          color="pink" label="Select department">
                        </v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>

        </v-flex>

        <v-flex sm4 xs12>
          <v-container>
            <v-layout row justify-center>
              <v-flex xs12>
                
                <v-card tile height="380">
                  <v-hover v-if="!selected_file">
                    <v-container slot-scope="{ hover }">
                      <v-img :src=" getUser.photoURL || `https://ui-avatars.com/api/?name=${getUser.name}&size=300`" max-height="250" @click="openFileSelect">
                        <v-expand-transition>
                          <div v-if="hover" class="d-flex transition-fast-in-fast-out teal darken-2 v-card--reveal display-5 white--text"
                            style="height: 100%;">
                            <v-icon x-large class="text-xs-center">photo_camera</v-icon>
                            <h3>Change profile photo</h3>
                          </div>
                        </v-expand-transition>
                      </v-img>
                      <v-btn color="success" class="mt-4" small outline @click="openFileSelect">Change Photo</v-btn>
                    </v-container>
                  </v-hover>
                  <v-hover v-else :class="reset_class">
                    <v-container slot-scope="{ hover }">
                      <v-img :src="blob_url" max-height="250" @click="openFileSelect">
                        <v-expand-transition>
                          <div v-if="hover" class="d-flex transition-fast-in-fast-out teal darken-2 v-card--reveal display-5 white--text"
                            style="height: 100%;filter:blur(0px)">
                            <v-icon x-large class="text-xs-center">photo_camera</v-icon>
                            <h3>Change profile photo</h3>
                          </div>
                        </v-expand-transition>
                      </v-img>
                    </v-container>
                  </v-hover>
                  <v-card-actions class="ml-3">
                    <v-btn dark color="teal" class="text-capitalize d-block" @click="updatePhoto"
                     small v-if="selected_file" :disabled="disabled_file_btn">{{upload_text}}
                    </v-btn>
                  </v-card-actions>
                  <v-container v-if="show_progress" class="py-0">
                    <v-progress-linear :indeterminate="true" ></v-progress-linear>
                  </v-container>
                </v-card>
                
                <input type="file" style="visibility:hidden;" id="file" @change="onFileSelect($event)" accept="image/jpeg,image/png"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-card-text>

    <div style="flex: 1 1 auto;"></div>
  </v-card>
</template>
<script>
export default {
  data:()=>({
    show_progress:false,
    upload_text:'Update photo',
    reset_class:'profile_card',
    disabled_file_btn:false,
    me:'',
    saving:false, // to show the loading state on the save btn
    disabled_fields:false,
    disabled_btn:false,
    form: {
      name:'',
      email:'',
      is_student:false,
      school:'',
      faculty:'',
      department:'',
      work:'',
      work_role:'',
    },
    selected_file:null,
    blob_url:'',
    selected_school:'',
    selected_faculty:'',
    selected_department:'',
    notifications: false,
    sound: true,
    widgets: false,
    cloudinary:{
      cloud_name:'unplugged',
      upload_preset:'pe4iolek'
    }
  }),
  computed: {
    // Mix your getter(s) into computed with the object spread operator
    ...mapGetters([
      'isAuthenticated',
      'getToken',
      'getUser',
      'getSchools'
      // ...
    ]),
  },
  methods:{
    openFileSelect(){
      //$('#file').click()
      document.getElementById('file').click()
      //console.log('trigger file select')
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
          this.disabled_file_btn = false
        }
        else{
          alert('Please select an image that is less than 1mb')
        }
      }
      else{
        alert('Only images are allowed!')
        this.disabled_file_btn = true
      }
    },
    async updatePhoto(){
      //this.show_progress = !this.show_progress
      this.upload_text = 'Updating photo...'
      let formData = new FormData()
      formData.append('file', this.selected_file)
      formData.append('uid', this.getUser.uid)
      try {
        let response = await api().post( 'dashboard/updateProfile/photo',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        )
  
        firebase.auth().currentUser.getIdToken(true);

        //this.$store.dispatch('setUser', {user:response.data.user,token:response.data.token})
        this.upload_text = 'Update photo'
        this.selected_file = null
        this.blob_url = null
        this.show_progress = false
      } catch (error) {
        console.log(error)
        console.log(error.response)
        alert('something went wrong. Please try again')
        this.upload_text = 'Update photo'
        this.selected_file = null
        this.blob_url = null
        this.show_progress = false
        //$NProgress.end()
      }
    },
    async updateProfile(){
      try {
        this.saving = true
        this.disabled_btn = true
        await firebase.auth().currentUser.updateProfile({
          displayName: this.form.name,
          email:this.form.email
        })

        let userRef = db.collection('moreUserInfo').doc(this.getUser.email);
        let update = await userRef.update({
          name:this.form.name,
          email:this.form.email,
          school:this.form.school.text,
          faculty:this.form.faculty.text,
          department:this.form.department.text
        });

        this.$eventBus.$emit('Show_Snackbar', {show:true,message:'Profile updated successfully', color:'success'})
        this.saving = false
        this.disabled_btn = false
      } catch (error) {
        this.$eventBus.$emit('Show_Snackbar', {show:true,message:'Something went wrong', color:'error'})
        this.saving = false
        this.disabled_btn = false
      }
    },
    async allSchools(){
      try {
        let schls = await api().post('dashboard/getSchools')
        //console.log(schls)
        //this.schools = schls.data
        this.$store.dispatch('setSchools', schls.data)
        this.setCurrSettings(this.getUser)
      } catch (error) {
        console.log(error)
      }
    },
    async setCurrSettings(data){
      
      this.me = data
      let userDetails = db.collection('moreUserInfo').doc(this.getUser.email);

      let getDoc = await userDetails.get()
        this.me = getDoc.data()
        console.log(this.me)
      if(this.me){
        this.form.notifications = this.me.notifications
        this.form.is_student = this.me.is_student
        this.form.school = this.getSchools.find(school => school.text == this.me.school)
        this.form.faculty = this.form.school.faculties.find(
          faculty => faculty.text == this.me.faculty
        )
        //console.log(this.form.faculty)
        this.form.department = this.form.faculty.departments.find(
          department => department.text == this.me.department
        )
        this.form.work = this.me.work
        this.form.work_role = this.me.work_role
        this.form.sound = this.me.sound
        this.form.extra = this.me.extra
        this.form.name = this.me.name

        // if user was once a student some fields(school,faculty,dept) will be disabled. If not,
        // those fields will not be disabled but will be hidden
        this.me.was_once_a_student ? this.disabled_fields = true : this.disabled_fields = false
      }
      //console.log(me)
      //console.log(this.form)
    }
  },
  async mounted(){
    if(this.getSchools.length > 0){
      this.setCurrSettings(this.getUser)
    }
    else{
      await this.allSchools()
    }
    
    
  },
  components:{
  }
}

import api from '@/services/api'
import { mapGetters } from 'vuex'
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
