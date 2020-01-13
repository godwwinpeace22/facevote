<template>
  <div>
    <v-card-text>
      <p>
        Certain contests require verification before participation.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident cum.
        <a href="https://support.voteryte.com" target="blank">Find out more </a>
        <v-icon small class="ml-1">mdi-open-in-new</v-icon>
      </p>
      <v-text-field
        name="bvn" type="number"
        label="Enter your BVN"
        v-model.number="form.bvn"
        counter="11" outlined
        hint="bvn must match your registered phone number"
      ></v-text-field>

      <small>
        Your BVN is used for verification purposes only. We don't 
        store your BVN or share it with any third-party.
      </small>
    </v-card-text>

    <v-card-actions>
      <!-- <v-spacer></v-spacer> -->

      <v-btn color="success" depressed
        @click="verify"
        :loading="loading"
        ripple class="mx-auto"
        block :disabled="disabled_btn"
        v-if="!is_verified">
        Verify
      </v-btn>
      <v-btn color="success" depressed
        v-else block>
        Your account is verified
        <v-icon>mdi-check</v-icon>
      </v-btn>

    </v-card-actions>
        
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      bvn: ''
    },
    loading: false,
  }),
  computed: {
    ...mapState([
      'is_verified'
    ]),
    ...mapGetters([
      'getUser'
    ]),
    disabled_btn(){
      return !this.form.bvn || this.form.bvn.toString().length != 11 
      
    }
  },
  methods: {
    async verify(){

      try {
        
        let f = localStorage.getItem('vr-lv')
        let c = localStorage.getItem('vr-lt')
        let wait_for = ((c*1 + 30*60*1000) - Date.now())/(1000 * 60)

        if(f >= 54 && wait_for > 0){
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: `Too many trials. Wait for ${wait_for.toFixed()} minutes`,
            color: 'error'
          })
        }
        else {
          this.loading = true
  
          let resp = await api().post('verifyBVN', {
            bvn: this.form.bvn,
            phone: this.getUser.phone,
            token: this.getUser.token
          })
          
          // console.log(resp) 
          // BVN verified; mark user as verified
          this.$gUser.get('is_verified')
            .put(true)
  
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Your account has been verified',
            color: 'success'
          })
  
          this.loading = false
          
        }

      } catch (error) {

        console.log(error)
        this.loading = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: error.response ? error.response.data.message : 'Something went wrong',
          color: 'error'
        })

        // try to prevent abuse of the API
        if(error.response && error.response.data.success == false){

          let f = localStorage.getItem('vr-lv')
          
          f ? localStorage.setItem('vr-lv', f*1+1) : localStorage.setItem('vr-lv', 1)
          localStorage.setItem('vr-lt', Date.now())
        }

      }
    }
  }
}


import { mapState, mapGetters } from 'vuex'
import api from '@/services/api2'
</script>

<style>

</style>