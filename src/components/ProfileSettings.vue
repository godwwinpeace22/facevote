<template>
  <v-card tile color="grey lighten-3">
    <v-toolbar card dark color="teal">
      <v-btn icon dark @click.native="$eventBus.$emit('hide_profile_settings', {})">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      
        <v-btn dark tile color="grey lighten-1" outline @click.native="$eventBus.$emit('hide_profile_settings', {})">Cancel</v-btn>
        <v-btn dark tile  outline @click.native="save" :disabled="disabled_btn" :loading="saving">Save</v-btn>
      
      <!--v-menu bottom right offset-y>
        <v-btn slot="activator" dark icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in 4" :key="i" to="">
            <v-list-tile-title>Click Me</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu-->
    </v-toolbar>

    <v-card-text>
      <v-layout row wrap>
        <v-flex sm8 xs12>
          <v-container>
            <v-layout row wrap justify-center>
              <v-flex sm10 xs12 offset-sm-3>
                <v-card tile>
                  <v-card-title>Profile</v-card-title>
                  <v-container>
                    <v-layout row="">
                      <v-flex xs12 d-flex>
                        <v-text-field required small v-model="form.name" style="text-transform:capitalize"
                         color="pink" browser-autocomplete="name" :placeholder="getUser.name" 
                         label="Your Name">
                         </v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
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
                          v-model="form.school" :items="schools" item-text="text" color="pink" 
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


          <v-container>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm10 offset-sm-3>
                <v-card tile>
                  <v-list three-line subheader>
                    <v-subheader>General</v-subheader>
                    <v-list-tile avatar>
                      <v-list-tile-action>
                        <v-checkbox v-model="form.notifications"></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Notifications</v-list-tile-title>
                        <v-list-tile-sub-title>Notify me through email about elections I subscribed</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile avatar>
                      <v-list-tile-action>
                        <v-checkbox v-model="form.sound"></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Sound</v-list-tile-title>
                        <v-list-tile-sub-title>Play sounds during notifications</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile avatar>
                      <v-list-tile-action>
                        <v-checkbox v-model="form.extra"></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Auto-add widgets</v-list-tile-title>
                        <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
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
                      <v-img :src=" getUser.imgSrc || `https://ui-avatars.com/api/?name=${getUser.name}&size=300`" max-height="250" @click="openFileSelect">
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
      is_student:false,
      school:'',
      faculty:'',
      department:'',
      work:'',
      work_role:'',
      notifications: false,
      sound: true,
      extra: false,
    },
    selected_file:null,
    blob_url:'',
    selected_school:'',
    selected_faculty:'',
    selected_department:'',
    schools:[
      {
        text:'UNN',
        value:'Unn',
        faculties:[
          {
            text:'Physical science',
            value:'Physical_science',
            departments:[
              {
                text:'Physics and Astronomy',
                value:'phy'
              },
              {
                text:'Computer Science',
                value:'cs',
              },
              {
                text:'Geology',
                value:'geology'
              },
              {
                text:'Chemistry',
                value:'chemistry'
              },
              {
                text:'Statistics',
                value:'statistics'
              }
            ]
          },
          {
            text:'Biological Sciences',
            value:'biological_sciences',
            departments:[
              {
                text:'Biochemistry',
                value:'biochemistry',
              },
              {
                text:'Microbiology',
                value:'microbiology'
              }
            ]
          }
        ]
      },
      {
        text:'Funai',
        value:'Funai',
        faculties:[
          {
            text:'Pha',
            value:'pha',
            departments:[
              {
                text:'Chem',
                value:'chem'
              },
              {
                text:'Computer Science Technology',
                value:'cst',
              },
              {
                text:'Geology',
                value:'geology'
              },
            ]
          },
          {
            text:'Social Science',
            value:'social_science',
            departments:[
              {
                text:'Public Administration',
                value:'palg',
              },
              {
                text:'Archiology',
                value:'archiology'
              }
            ]
          },
          {
            text:'Phy',
            value:'phy',
            departments:[
              {
                text:'Chem',
                value:'chem'
              }
            ]
          }
        ]
      }
    ],
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
      'getUser'
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
      console.log(e.target.files)
      if(e.target.files[0].type == 'image/jpeg' || 
        e.target.files[0].type == 'image/jpg' || 
        e.target.files[0].type == 'image/png'
        
      ){
        if(e.target.files[0].size < 1000){
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
      formData.append('upload_preset', this.cloudinary.upload_preset)
      formData.append('public_id', this.getUser.username + Date.now())
      try {
        let res = await api().post(`https://api.cloudinary.com/v1_1/${this.cloudinary.cloud_name}/upload`, formData)
        console.log(res.data)
        console.log(this.getToken)
        let res2 = await api().post('dashboard/updateProfile/photo', {
          username:this.getUser.username,
          imgSrc:res.data.secure_url,
          token:this.getToken
        })
        
        console.log(res2.data)
        this.$store.dispatch('setUser', {user:res2.data.user,token:res2.data.token})
        this.upload_text = 'Update photo'
        this.selected_file = null
        this.show_progress = false
      } catch (error) {
        console.log(error.response)
        alert('something went wrong. Please try again')
        this.upload_text = 'Update photo'
        this.selected_file = null
        this.show_progress = false
      }
    },
    async save(){
      //$eventBus.$emit('hide_profile_settings', {})
      try {
        this.saving = true
        this.disabled_btn = true
        console.log(this.form)
        let saved = await api().post('dashboard/updateProfile/details', {
          username:this.getUser.username,
          ...this.form,
          token:this.getToken
        })

        // preferences saved successfully
        this.$store.dispatch('setUser', {user:saved.data,token:this.getToken})
        this.$store.dispatch('setLoggedInUser', saved.data)
        console.log(saved.data)
        this.setCurrSettings(saved.data)
        this.saving = false
        this.disabled_btn = false
        //this.$eventBus.$emit('hide_profile_settings', {})
        this.$eventBus.$emit('Show_Snackbar', {show:true,message:'Settings updated successfully', color:'success'})
      } catch (error) {
        console.log(error)
        alert('something went wrong. Please try again')
        this.saving = false
        this.disabled_btn = false
      }
      
    },
    setCurrSettings(data){
      /*let res = await api().post(`dashboard/getUser/${this.$store.getters.getUser.username}`, {
        token:this.$store.getters.getToken
      })*/
      this.me = data
      console.log(this.me)
      if(this.me){
        this.form.notifications = this.me.notifications
        this.form.is_student = this.me.is_student
        this.form.school = this.schools.find(school => school.text == this.me.school)
        this.form.faculty = this.form.school.faculties.find(
          faculty => faculty.text == this.me.faculty
        )
        console.log(this.form.faculty)
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
  mounted(){
    this.setCurrSettings(this.getUser)
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
