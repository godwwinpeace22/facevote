<template>
  <v-card tile color="grey lighten-3">
    <v-toolbar card dark color="teal">
      <v-btn icon dark class="hidden-md-and-up"
        @click.native="$eventBus.$emit('hide_profile_settings', {})">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn dark :small="$vuetify.breakpoint.xs" class="hidden-sm-and-down" tile color="grey lighten-1" :disabled="loading" outline @click.native="$eventBus.$emit('hide_profile_settings', {})">Cancel</v-btn>
      <v-btn depressed color="orange" @click.native="updateProfile" :loading="loading">Save</v-btn>
    </v-toolbar>

    <v-snackbar v-model="snackbar.show" dark :timeout="5000" 
      :color="snackbar.color" :vertical="$vuetify.breakpoint.xsOnly" top right>
      {{snackbar.message}}
      <v-btn dark flat :color="snackbar.color == 'error' ? 'black' : 'orange'" @click="snackbar.show = false"> Close</v-btn>
    </v-snackbar>
    
    <v-card-text class="pa-0">
      <v-layout row wrap>

        <v-flex sm4 xs12 order-sm2>
          <v-container :pa-0="$vuetify.breakpoint.xsOnly">
            <v-layout row justify-center>
              <v-flex xs12>
                
                <v-card tile :flat="$vuetify.breakpoint.xsOnly">
                  <v-hover :class="{profile_card: selected_file}">
                    <v-container slot-scope="{ hover }">
                      <v-img :src="blob_url || getUser.photoURL || `https://ui-avatars.com/api/?name=${getUser.displayName}&size=300`" max-height="250" @click="openFileSelect">
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
                  <v-card-actions class="ml-3">
                    <v-btn dark :color="uploading ? 'grey' : 'teal'" class="text-capitalize d-block" @click="updatePhoto"
                      v-if="selected_file" >{{upload_text}}
                    </v-btn>
                  </v-card-actions>
                  <v-container v-if="uploading" class="py-0 px-0">
                    <v-progress-linear :indeterminate="true" ></v-progress-linear>
                  </v-container>
                </v-card>
                
                <input type="file" style="visibility:hidden;position: absolute;" id="file" @change="onFileSelect($event)" accept="image/jpeg,image/png"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>

        <v-flex sm8 xs12>

          <v-container grid-list-md :pa-0="$vuetify.breakpoint.xsOnly">
            <v-layout row wrap>
              <v-flex xs12 sm10 offset-sm1>
                <v-card :flat="$vuetify.breakpoint.xsOnly">
                  <v-subheader>Basic Info</v-subheader>
                  <v-card-text>
                    <v-text-field class="mb-4" required small v-model="form.name" style="text-transform:capitalize"
                      color="secondary" browser-autocomplete="name" :placeholder="getUser.displayName" 
                      label="Your Name">
                    </v-text-field>

                    <v-text-field required small v-model="form.email" style="text-transform:capitalize"
                      color="secondary" browser-autocomplete="email" :placeholder="getUser.email" disabled
                      label="Your Email">
                    </v-text-field>

                    <v-text-field required small v-model="form.phone" style="text-transform:capitalize"
                      color="secondary" browser-autocomplete="tel" :placeholder="getUserInfo ? getUserInfo.phone : ''" 
                      label="Your Phone number">
                    </v-text-field>
                  </v-card-text>
                  
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>

          <v-container :pa-0="$vuetify.breakpoint.xsOnly">
            <v-layout row wrap justify-center>
              <v-flex xs12 sm10 offset-sm-3>
                <v-card tile :flat="$vuetify.breakpoint.xsOnly">
                  <v-card-title>School</v-card-title>
                  <v-card-text>
                    
                    <v-checkbox
                      :label="form.is_student ? 'I am a student' : 'I am not a student'"
                      v-model="form.is_student"
                    ></v-checkbox>
                  </v-card-text>
                  <v-container v-if="form.is_student">
                    <v-layout column>
                      <template v-if="getUserInfo && getUserInfo.was_once_a_student">
                        <v-flex xs8 d-flex>
                          <v-text-field class="mb-4" disabled small style="text-transform:capitalize"
                            color="secondary" :placeholder="getUserInfo ? getUserInfo.sch : ''" 
                            label="Your School">
                          </v-text-field>
                        </v-flex>
                        <v-flex xs8 d-flex>
                          <v-text-field class="mb-4" disabled small style="text-transform:capitalize"
                            color="secondary" :placeholder="getUserInfo ? getUserInfo.fac : ''" 
                            label="Your Faculty">
                          </v-text-field>
                        </v-flex>
                        <v-flex xs8 d-flex>
                          <v-text-field class="mb-4" disabled small style="text-transform:capitalize"
                            color="secondary" :placeholder="getUserInfo ? getUserInfo.dept : ''" 
                            label="Your Department">
                          </v-text-field>
                        </v-flex>
                      </template>
                      
                      <template v-else>
                        <v-flex xs8 d-flex>
                          <v-select required small 
                            v-model="form.school" :items="getSchools" item-text="text" color="secondary" 
                            label="School" >
                          </v-select>
                        </v-flex>
                        <v-flex xs8 d-flex>
                          <v-select required small 
                            v-model="form.faculty" :items="form.school.faculties" 
                            color="secondary" item-text="text" item-value="value" label="Select faculty" >
                          </v-select>
                        </v-flex>
                        <v-flex xs8 d-flex>
                          <v-select required small 
                            v-model="form.department" :items="form.faculty.departments"
                            item-text="text" item-value="value"
                            color="secondary" label="Select department">
                          </v-select>
                        </v-flex>
                      </template>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>

        </v-flex>

        
      </v-layout>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data:()=>({
    upload_text:'Update photo',
    snackbar:{},
    loading:false, // to show the loading state on the save btn
    uploading:false, // when image is being uploaded
    disabled_fields:false,
    form: {
      name:'',
      email:'',
      phone:'',
      is_student:true,
      school:'',
      faculty:'',
      department:'',
      work:'',
      work_role:'',
    },
    selected_file:null,
    blob_url:null,
    cloudinary:{
      cloud_name:'unplugged',
      upload_preset:'pe4iolek'
    }
  }),
  computed: {
    // Mix your getter(s) into computed with the object spread operator
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getSchools'
      // ...
    ]),
    ...mapState([
      'isSuperUser',
    ]),
    title(){
      return this.isSuperUser ? 'Settings' : 'My Profile'
    }
  },
  methods:{
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
      }
    },
    async updatePhoto(){
      this.upload_text = 'Updating photo...'
      this.uploading = true

      firebase.auth().currentUser.getIdToken(true).then(async idToken=>{

        let formData = new FormData()
        formData.append('file', this.selected_file)
        formData.append('idToken', idToken)

        try {
          let response = await api().post( 'dashboard/updateUserProfilePhoto',
            formData,{
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          )

          // console.log(response)

          // await this.otherUpdates({
          //   photoURL: response
          // }).then((done) => console.log(done))
          // .catch(err => console.log(err))

          firebase.auth().currentUser.getIdToken(true);
          this.selected_file = null
          this.upload_text = 'Update photo'
          this.uploading = false
          this.snackbar = {show:true,message:'Photo updated successfully',color:'black'}

          let docRef = db.collection('moreUserInfo').doc(this.getUser.uid)
          let doc = await docRef.get()
          // console.log(doc.data())
          this.$store.dispatch('setUserInfo',doc.data())

        } catch (error) {
          // console.log(error)
          
          this.snackbar = {show:true,message:"Upload failed. Please try again",color:"error"}
          this.upload_text = 'Update photo'
          this.uploading = false
          $NProgress.done()
        }
      })
    },
    async updateProfile(){
      try {
        this.loading = true
        firebase.auth().currentUser.updateProfile({
          displayName: this.form.name || this.getUser.displayName
        }).then(() => {

          let userRef = db.collection('moreUserInfo').doc(this.getUser.uid);
          if(this.getUserInfo.was_once_a_student){
            let data = {
              name: this.form.name || this.getUser.displayName,
              phone: this.form.phone || this.getUserInfo.phone,
              is_student: this.form.is_student
            }
            userRef.update({
              ...data
            }).then(async () => {

              // await this.otherUpdates({
              //   ...data,
              // }).then((done) => {
              //   console.log(done)
              // }).catch(err => console.log(err))

              let doc = await userRef.get()
          
              firebase.auth().onAuthStateChanged((user) => {
                if(user){
                  this.$store.dispatch('setUser', user)
                  this.$store.dispatch('setUserInfo',doc.data())

                  this.snackbar = {show:true,message:'Profile updated successfully', color:'black'}
                  this.loading = false
                }
      
              })
            })
            
          }
          else{
            let data = {
              name: this.form.name || this.getUser.displayName,
              //email:this.form.email || this.getUser.email,
              phone: this.form.phone || this.getUserInfo.phone,
              is_student: this.form.is_student,
              was_once_a_student: this.form.is_student,
              sch: this.form.school.text || this.getUserInfo.sch,
              fac: this.form.faculty.text || this.getUserInfo.fac,
              dept: this.form.department.text || this.getUserInfo.dept
            }
            userRef.update(data).then( async () => {

              // await this.otherUpdates({
              //   ...data,
              // }).then((done) => {
              //   console.log(done)
              // }).catch(err => console.log(err))

              let doc = await userRef.get()
          
              firebase.auth().onAuthStateChanged((user) => {
                if(user){
                  this.$store.dispatch('setUser', user)
                  this.$store.dispatch('setUserInfo',doc.data())
                  
                  this.snackbar = {show:true,message:'Profile updated successfully', color:'black'}
                  this.loading = false
                }

      
              })
            })
            // console.log(update)
          }
          
          
        })
        
      } catch (error) {
        // console.log(error)
        this.snackbar = {show:true,message:'Something went wrong', color:'error'}
        this.loading = false
      }
    },
    otherUpdates(onr){
      // get reference to all users posts
      // get reference to all users manifestos
      // get reference to all users broadcasts
      // update moreuserinfo
      return new Promise(( resolve, reject ) => {

        let postIds = []
        db.collection('posts').where('onr.uid','==',getUser.uid)
        .get().then(docs => {
          docs.forEach(doc => {
            postIds.push(doc.data().docId)
          })
        })

        let manifestoIds = []
        db.collection('manifestos').where('onr.uid','==',getUser.uid)
        .get().then(docs => {
          docs.forEach(doc => {
            manifestoIds.push(doc.data().docId)
          })
        })

        let broadcastIds = []
        db.collection('broadcasts').where('onr.uid','==',getUser.uid)
        .get().then(docs => {
          docs.forEach(doc => {
            broadcastIds.push(doc.data().docId)
          })
        })


        let batch = db.batch();

        postIds.forEach(docId => {
          let postRef = db.collection('posts').doc(docId)
          batch.update(postRef, onr)
        })
        manifestoIds.forEach(docId => {
          let manifestoRef = db.collection('posts').doc(docId)
          batch.update(manifestoRef, onr)
        })
        broadcastIds.forEach(docId => {
          let Ref = db.collection('broadcasts').doc(docId)
          batch.update(broadcastRef, onr)
        })

        batch.commit().then(() => {
          resolve('success')
        }).catch(err => reject('failed'))
      })


    },
    async allSchools(){
      try {
        let schls = await api().post('dashboard/getSchools')
        this.$store.dispatch('setSchools', schls.data)
      } catch (error) {
        // console.log(error)
        $NProgress.done()
      }
    },
    async setUp(data){
      try {
        if(!this.getUserInfo){
          let userDetails = db.collection('moreUserInfo').doc(this.getUser.uid);
          let getDoc = await userDetails.get()
          
          this.$store.dispatch('setUserInfo',getDoc.data())
        }
        
        
        if(this.getUserInfo && !this.getUserInfo.was_once_a_student){
          this.form.is_student = this.getUserInfo.is_student
          await this.allSchools()
          
        }
      } catch (error) {
        // console.log(error)
      }
      
    }
  },
  async created(){
    await this.setUp()
    
    
  },
  components:{
  }
}

import api from '@/services/api'
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
