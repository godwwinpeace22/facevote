<template>
  <div>
    <v-container grid-list-xs :px-2="$vuetify.breakpoint.xsOnly">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card height="" class="round_top" style="border-top: 4px solid gold">
            <v-toolbar class="white" flat card dense>
              <v-subheader>Who Viewed Your Profile</v-subheader>
              <v-spacer></v-spacer>
              <v-icon color="#FFC107" class="pr-2">mdi-flash-circle</v-icon>
              <span class="font-weight-bold">Premium</span>
            </v-toolbar>

            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12 sm4>
                  <v-card flat>
                    <pie-chart :chart-data="chartdata" :chartOptions="chartOptions"></pie-chart>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-card flat>
                    <bar-chart :chart-data="chartdata2" :options="chartOptions2"></bar-chart>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-card flat class="round_top" style="border: 1px solid #eee;">
                    <v-toolbar flat card dense light color="grey lighten-3">
                      <v-subheader class="pl-0 font-weight-bold black--text">Your Profile Viewers</v-subheader>
                      
                    </v-toolbar>
                    <v-card-text class="pa-0" style="height: 300px; overflow:auto;">
                      <v-list two-line dense>
                        <v-subheader v-if="profileViews.length == 0">0 profile views</v-subheader>
                        <template v-for="(item, index) in profileViews">
                          <v-list-tile avatar :key="index" @click="$eventBus.$emit('ViewProfile', item.onr)">
                            <v-list-tile-avatar :color="$helpers.colorMinder(item.onr.name.charAt(0))">
                              <img :src="item.onr.photoURL" v-if="item.onr.photoURL">
                              <span v-else class="white--text">{{item.onr.name.charAt(0)}}</span>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title >
                                {{$helpers.capitalize(item.onr.name)}}
                              </v-list-tile-title>
                              <v-list-tile-sub-title>
                                {{item.onr.dept}}
                              </v-list-tile-sub-title>
                              
                            </v-list-tile-content>
                          </v-list-tile>
                        </template>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data: ()=>({
    profileViews: [],
    chartdata: {},
    offset: '',
    more_profile_views: false,
    chartdata2: {},
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false
    },
    chartOptions2:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true,
            }
          }],
          xAxes: [{
            ticks: {
                beginAtZero: true,
                autoSkip:false,
            }
          }]
      }
    },
    labels: [
      '12am',
      '3am',
      '6am',
      '9am',
      '12pm',
      '3pm',
      '6pm',
      '9pm'
    ],
    value: [
      200,
      675,
      410,
      390,
      310,
      460,
      250,
      240
    ]
  }),
  computed: {
    ...mapGetters([
      'getUser',
      'getUserInfo'
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
    ])
  },
  methods: {
    moreProfileViews(){

    },
    async getProfileViewers(){
      // get profile views by voters in curRoom
      db.collection('profile_views').where('viewee', '==', this.getUser.uid)
      .get().then(querySnapshot =>{
        let views = []
        querySnapshot.forEach(doc => views.push(
          doc.data())
        )
        this.profileViews = views

        this.profileViewsByDept()
        this.profileViewsByFac()
      })
    },
    get_random_color() {
      var letters = 'ABCDE'.split('');
      var color = '#';
      for (var i=0; i<3; i++ ) {
          color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
    profileViewsByDept(){
      
      let byDept = {}
      this.profileViews.forEach(view =>{
        
        byDept[view.onr.dept] ? 
        byDept[view.onr.dept] = byDept[view.onr.dept]++ : 
        byDept[view.onr.dept] = 1
      })

      this.chartdata = {
        labels: Object.keys(byDept).map(item =>{
          return this.$helpers.truncateText(item)
        }),
     
        datasets: [
        {
          label: 'Your profile views by department',
          backgroundColor: Object.keys(byDept).map(item =>{
            return this.get_random_color()
          }),
          data: Object.values(byDept)
        }]
      }
    },
    profileViewsByFac(){
      
      let byFac = {}
      this.profileViews.forEach(view =>{
        
        byFac[view.onr.fac] ? 
        byFac[view.onr.fac] = byFac[view.onr.fac]++ : 
        byFac[view.onr.fac] = 1
      })

      this.chartdata2 = {
        labels: Object.keys(byFac).map(item =>{
          return this.$helpers.truncateText(item)
        }),

        datasets: [
        {
          label: 'Your profile views by faculty',
          backgroundColor: Object.keys(byFac).map(item =>{
            return this.get_random_color()
          }),
          data: Object.values(byFac)
        }]
      }
    }
  },
  created(){
    this.getProfileViewers()
  },
  components: {
    PieChart,
    BarChart
  }
}
import PieChart from '@/charts/piechart'
import BarChart from '@/charts/barchart'
import { mapGetters, mapState } from 'vuex';
import {firebase, db, database} from '@/plugins/firebase'
</script>
