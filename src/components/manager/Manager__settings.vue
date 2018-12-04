<template>
  <div>
    <v-container grid-list-xs>
      <v-layout row wrap justify-center>
        <v-flex sm6>
          <v-card height="200">
            <h3 class="text-xs-center font-weight-bold primary-title pt-2 pb-4" style="color:#8c8484;">Election Settings</h3>
            <v-layout row wrap justify-space-around>
              <v-flex xs5>
                <v-subheader class="font-weight-bold">Election Icon</v-subheader>
              </v-flex>
              <v-flex xs4>
                <v-tooltip right>
                  <v-btn color="success" slot="activator" depressed small 
                    @click="triggerFileSelect">Change</v-btn>
                  <span>Change this election's icon</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-around>
              <v-flex xs5>
                <v-subheader class="font-weight-bold">Election Details</v-subheader>
              </v-flex>
              <v-flex xs4>
                <v-tooltip right>
                  <v-btn color="success" depressed slot="activator" small 
                    @click="settings_modal = true">
                    <v-icon size="15">mode_edit</v-icon> Edit</v-btn>
                  <span>Edit this election</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    
    <!-- logo upload dialog -->
    <v-dialog v-model="logo_dialog" max-width="400" hide-overlay style="">
      <v-card style="background:#fff;" class="mt-0">
        <v-card-title primary-title class="font-weight-bold">Change Election Logo</v-card-title>
        <v-divider class="mb-2"></v-divider>
        <v-avatar color="teal" size="150" class="d-block" style="margin:auto;">
          <img :src="imgSrc" alt="alt">
        </v-avatar>
        <v-spacer></v-spacer>
        <v-btn outline small color="success" @click="uploadLogo" :loading="loading">Upload file</v-btn>
      </v-card>
      
    </v-dialog>
    <input id="logo_img" type="file" ref="logo_img" accept="image/jpeg, image/png"
      style="visibility:hidden" @change="openFileModal($event)" />

    <!-- election settings dialog -->
    <v-dialog v-model="settings_modal" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
      <v-card>
        <v-toolbar color="success">
          <v-toolbar-title class="white--text">Edit Election</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="settings_modal = false" depressed>Close</v-btn>
        </v-toolbar>
        <v-card-text>
          <edit-election></edit-election>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data:()=>({
    settings_modal:false,
    file:null,
    logo_dialog:false,
    imgSrc:'',
    loading:false,
    cloudinary: {
      uploadPreset: 'r9tlxvid',
      cloudName: 'unplugged'
    },
  }),
  methods:{
    triggerFileSelect(){
      //console.log('upload a file')
      document.getElementById('logo_img').click()
      
    },
    openFileModal(e){
      //console.log(e.target.files)
      this.file = e.target.files[0]
      this.imgSrc = URL.createObjectURL(e.target.files[0])
      this.logo_dialog = true
      //console.log(e.target.files)
      document.getElementById('logo_img').value = ''
    },
    async uploadLogo(){
      let formData = new FormData()
      formData.append('file', this.file);
      formData.append('upload_preset', this.cloudinary.uploadPreset);
      this.loading = true
      // first upload image to cloudinary and retrieve the url
      try{
        let res = await api().post(`https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/upload`, formData)
        console.log(res.data)
        
        //this.submit(this.file.file_message,res.data.secure_url)
        await api().post(`dashboard/updateLogo/${this.currElection.electoinId}`, {
          token:this.$store.getters.getToken,
          imgSrc:res.data.secure_url
        })
        this.loading = false

        // TODO
        // LIMIT UPLOAD SIZE; HANDLE ERRORS
      }
      catch(err){
        //this.dispatchError(err)
        console.log(err)
        alert('Upload failed')
        this.loading = false
        //this.clearMessage()
      }
    }
  },
  components:{
    EditElection
  }
}
import api from '@/services/api'
import EditElection from '@/components/EditElection'
</script>
