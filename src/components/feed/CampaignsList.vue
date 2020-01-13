<template>
  <div>
    <v-container pa-0>
      <v-row column>
        <v-col cols="12">
          <v-card flat class="bgd lighten-1">
            <div style="overflow-y:auto;">
              <v-subheader class="font-weight-bold">Campaigns</v-subheader>
              
              <v-list dense class="bgd lighten-1">
                <v-list-item  @click="newCampaign" v-if="isSuperUser">
                  <v-list-item-avatar color="grey">
                    <v-avatar size="45" color="grey">
                      <v-icon small color="white">mdi-plus</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="primary--text">
                      Add Your Campaign</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-list two-line dense class="bgd lighten-1">
                <v-list-item  v-for="(campaign,i) in sortCampaigns" :key="i" @click="selectCampaign(campaign)">
                  <v-list-item-avatar size="45" :color="$helpers.colorMinder(campaign.author.name.charAt(0))">
                    <img :src="campaign.author.photoURL" v-if="campaign.author.photoURL" alt="alt">
                    <span v-else small class="white--text">{{campaign.author.name.charAt(0)}}</span>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="primary--text text-capitalize">
                      {{campaign.author.name}}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{$helpers.parseDate(campaign.latest)}}
                      <v-icon small color="primary" class="pr-1">mdi-chart-donut</v-icon>{{campaign.count}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <!-- <v-card-actions>
              <v-btn text small v-if="getCampaigns.length >= 15"
                color="primary" class="text-capitalize"
                @click="moreCampaigns" :loading="loading_more_campaigns">See More</v-btn>
            </v-card-actions> -->
          </v-card>
        </v-col>
        
      </v-row>
    </v-container>

    <!-- NEW CAMPAIGN DIALOG -->
    <v-dialog v-model="new_campaign"   scrollable persistent
      max-width="500px" :fullscreen="breakpoint.smAndDown">
      <v-card flat>
        <v-toolbar dense flat>
          <span>Create a Campaign</span>
          <v-spacer></v-spacer>
          <v-btn text icon @click="new_campaign = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          
          <new-campaign v-if="isSuperUser"/>
          <div v-else class="pa-2">
            upgrade your account
          </div>
        </v-card-text>
        
      </v-card>
      
    </v-dialog>

    <!-- VIEW CAMPAIGN -->
    <v-dialog v-model="view_campaign" content-class="white view_dialog" 
       max-width="500"
      :fullscreen="breakpoint.smAndDown" scrollable hide-overlay>

      <view-campaign :selectedcampaign="selected_campaign" :campaigns='getCampaigns'/>
        
      
    </v-dialog>

  </div>
</template>
<script>
export default {
  data: () => ({
    selected_campaign: {},
    view_campaign: false,
    new_campaign: false,
  }),
  props: {
    campaigns: {
      required: true,
    },
    sorted: {
      required: true,
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom',
    ]),
    breakpoint(){
      return this.$vuetify.breakpoint
    },
    getCampaigns(){
      let sorted = this.campaigns.sort((a,b)=>
       
        b.date_created - a.date_created
      )
      return sorted
    },
    sortCampaigns(){
      // group campaigns by user
      const uniqueArray = this.getCampaigns.filter((thing,index) => {
        return index === this.getCampaigns.findIndex(obj => {
          return obj.docId === thing.docId;
        })
      })

      let uniques = []
      // console.log(uniques, this.campaigns)
      uniqueArray.forEach((item,i) =>{
        if(!uniques.find(camp => camp.author.username == item.author.username)){
          let user_campaigns = uniqueArray.filter(u => u.author.username == item.author.username)
          uniques.push({
            ...item,
            latest: user_campaigns[0].date_created, // the latest by the user
            count: user_campaigns.length // number of 
            // campaigns by this user
          })
        }
      })
      // console.log({uniques})
      // this.sorted = uniques
      return uniques
    },
  },
  methods: {
    selectCampaign(campaign){
      
      let index = this.getCampaigns.findIndex(camp => {
        return camp.author.username == campaign.author.username
      })
      // // console.log({campaign, index})
      this.selected_campaign = index
      // this.view_campaign = true;

      this.$router.push(`/campaigns?n=${index}`)
    },
    newCampaign(){
      this.isSuperUser ?
      this.new_campaign = true : 
      this.$eventBus.$emit('Open_Upgrade_Dialog')
    },
  },
  components: {
    NewCampaign,
    ViewCampaign,
  },
  mounted(){
    // console.log(this.sorted)
  }
}
import { mapState, mapGetters } from 'vuex'
import NewCampaign from '@/components/campaigns/NewCampaign'
import ViewCampaign from '@/components/campaigns/ViewCampaign'
</script>