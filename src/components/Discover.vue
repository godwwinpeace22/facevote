<template>
  <div class="white">
    <navigation :show_extension="true" color="primary"
      extension_height="90"
      :prominent="true"
      extension_img="https://picsum.photos/1920/1080?random">
      <template v-slot:title>
        <span></span>
      </template>
      <template v-slot:extension>

        <v-row justify="center" align="center">
          <v-col cols="12" md="9"  class="text-center mt">
            <h2 class="headline">Discover elections, people, and events</h2>
            <v-text-field
              outlined class="mb-12 mt-5"
              name="search"
              @keyup.enter="search"
              append-icon="mdi-magnify"
              append-icon-cb="search"
              label="Enter election Id, username, or event"
              v-model.trim="query" hide-details
            >
              <!-- <template v-slot:append-outer>
                <v-icon color="white" class="" @click="search" :loading="searching">
                  mdi-magnify
                </v-icon>
              </template> -->
            </v-text-field>
            
          </v-col>
        </v-row>

      </template>
    </navigation>

    <v-container>

      <v-card outlined :loading="searching">
        <v-tabs 
          v-model="tab"
          background-color="white"
          color="deep-purple accent-4"
          right
        >
          <v-tab href="#elections">Elections</v-tab>
          <v-tab href="#people">People</v-tab>
          <v-tab href="#events">Events</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item value="elections">
            <v-container>
              <v-card flat min-height="300">
                <v-row>
                  <v-col cols="12" v-if="elections.length > 0">
                    <v-subheader>Search results</v-subheader>
                  </v-col>
                  <v-col v-for="(election, i) in elections" :key="election.electionId + i" cols="6" sm="4">
                    <v-card max-width="344" outlined>
                      <v-list-item three-line :to="`elections/${election.electionId}`">
                        <v-list-item-content>
                          <v-list-item-title class="title mb-0">{{election.title}}</v-list-item-title>
                          <v-list-item-subtitle>{{election.electionId}}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar
                          size="35" tile
                          color="grey lighten-3"
                        >
                          <img :src="election.logo" v-if="election.logo" alt="election_logo"/>
                          <span v-else>{{election.title ? election.title.charAt(0) : ''}}</span>
                        </v-list-item-avatar>
                      </v-list-item>

                      <v-card-actions>
                        <v-btn text small>
                          <v-icon class="pr-1" small>mdi-account-group-outline</v-icon>
                          {{election.contestants_count.toLocaleString()}}
                        </v-btn>

                        <v-btn text small>
                          <v-icon class="pr-1" small>mdi-vote-outline</v-icon>
                          {{election.voters_count.toLocaleString()}}
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn text small class="text-capitalize">
                          <span class="online_badge mr-1"
                          :class="election.status == 'ended' ? 'orange' :
                            election.status == 'inprogress' ? 'success' : 'primary'">
                          </span>
                          {{election.status == 'ended' ? 'Closed' : election.status == 'inprogress' ? 'in progress' : 'Not started'}}
                        </v-btn>

                      </v-card-actions>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="10">
                    <v-subheader class="font-weight-bold">Elections your enrolled in</v-subheader>
                    <v-row>
                      
                      <v-col v-for="(election,i) in getMyEnrolled" :key="election.title + i" cols="6" sm="4">
                        <v-card max-width="344" outlined>
                          <v-list-item three-line :to="`elections/${election.electionId}`">
                            <v-list-item-content>
                              <v-list-item-title class="title mb-0">{{election.title}}</v-list-item-title>
                              <v-list-item-subtitle>{{election.electionId}}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-avatar
                              size="35" tile
                              color="grey lighten-3">

                              <img :src="election.logo" v-if="election.logo" alt="logo"/>
                              <span v-else>{{election.title.charAt(0)}}</span>
                            </v-list-item-avatar>
                          </v-list-item>

                          <v-card-actions>
                            <v-btn text small>
                              <v-icon class="pr-1" small>mdi-account-group-outline</v-icon>
                              {{election.contestants_count.toLocaleString()}}
                            </v-btn>

                            <v-btn text small>
                              <v-icon class="pr-1" small>mdi-vote-outline</v-icon>
                              {{election.voters_count.toLocaleString()}}
                            </v-btn>

                            <v-spacer></v-spacer>

                            <v-btn text small class="text-capitalize">
                              <span class="online_badge mr-1"
                              :class="election.status == 'ended' ? 'orange' :
                               election.status == 'inprogress' ? 'success' : 'primary'">
                              </span>
                              {{election.status == 'ended' ? 'Closed' : election.status == 'inprogress' ? 'in progress' : 'Not started'}}
                            </v-btn>

                          </v-card-actions>
                        </v-card>
                      </v-col>

                    </v-row>
                  </v-col>
                </v-row>
                
              </v-card>
            </v-container>
          </v-tab-item>

          <v-tab-item value="people">
            <v-container>
              <transition name="fade" appear>
                <v-card min-height="300" flat v-if="!searching">
                  <v-subheader class="font-weight-bold">People</v-subheader>
                  <v-subheader v-show="people.length == 0">No results for your search</v-subheader>
                  <v-row>
                    <v-col v-for="(person, i) in people" :key="person.username + i" cols="6" sm="3">
                      <!-- <v-card max-width="344" outlined>
                        <v-list-item three-line :to="`users/${person.username}`">
                          <v-list-item-content>
                            <div class="overline mb-4">People</div>
                            <v-list-item-title class="title mb-0">{{person.name}}</v-list-item-title>
                            <v-list-item-subtitle>@{{person.username}}</v-list-item-subtitle>
                          </v-list-item-content>

                          <v-list-item-avatar
                            size="35" 
                            color="grey"
                          >
                            <img :src="election.logo" v-if="person.photoUrl" alt="election_logo"/>
                            <span v-else class="white--text text-capitalize">{{person.name ? person.name.charAt(0) : ''}}</span>
                          </v-list-item-avatar>
                        </v-list-item>

                        <v-card-actions>
                          <v-btn text small>
                            <v-icon class="pr-1" small>mdi-account-group-outline</v-icon>
                            23K
                          </v-btn>

                          <v-btn text small>
                            <v-icon class="pr-1" small>mdi-group</v-icon>
                            23K
                          </v-btn>

                        </v-card-actions>
                      </v-card> -->

                      <v-card class="round_top mr-2 mb-2" 
                        outlined
                        height="320" 
                        style="position: relative">

                        <v-sheet width="100%" height="80" 
                          
                          :color="$helpers.colorMinder(person.name.charAt(0)) + ' lighten-3'">
                          <img :src="`https://picsum.photos/seed/${person.username}/234/82?random`" width="100%" height="80" alt="altText"/>

                        </v-sheet>
                        
                        <div style="width: 41%; height: 100px;" class="mx-auto mt-n12" color="transparent">
                          <v-avatar
                            size="90"
                            :color="$helpers.colorMinder(person.name.charAt(0))"
                          >
                            <img :src="person.photoURL || `https://picsum.photos/seed/${i}/100/90?random`">
                            <!-- <span v-else class="white--text display-1 text-capitalize">
                              {{person.name.charAt(0)}}
                            </span> -->
                          </v-avatar>
                        </div>

                        <v-card-text class="px-1 text-center" :id="person.username + 'cont'"
                        >
                          <div class="subheading font-weight-bold mb-0 text-capitalize .text-truncate hover">
                            {{person.name}}
                            <span class="online_badge success" v-if="person.online"></span>
                          </div>
                          
                        </v-card-text>
                        <v-card-actions>

                          <v-btn color="primary lighten-3" dark small outlined
                            class="mx-auto text-capitalize" 
                            >
                            {{(person.followers_count || 0).toLocaleString()}} Follow
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </transition>
            </v-container>
          </v-tab-item>

          <v-tab-item value="events">
            <v-container>
              <v-card min-height="300" flat>
                <v-subheader>Events</v-subheader>
                <v-subheader>No events found for your search</v-subheader>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-card>

    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    showUi: false,
    query: '',
    searching: false,
    tab: 'elections',
    elections: [],
    people: [],
    events: [],
  }),
  computed: {
    ...mapGetters([
      'getMyEnrolled'
    ]),
    ...mapState([
      'auth'
    ])
  },
  methods: {
    initialize(){

    },
    sleep (limit=100) {
      return (new Promise((res, rej)=>{
        setTimeout(res, limit);
      }))
    },
    async search(){
      // let resulst = [
        this.searching = true;

        await this.searchElection()
        await this.searchPeople()
        await this.searchEvents()

        // setTimeout(() => {
          this.searching = false;
        // }, 3);
        
    },
    async searchElection(){
      // search for an election using the electionId
      
      try {
        
        // grab all the elections
        let elections = async ()=>{
          let arr = []
          this.$gun.get('elections')
            .map()
            .once(elec => {
              // console.log({elec})
              if(elec){
                arr.find(e => e.electionId == elec.electionId) ? '' : 
                arr.push(new Promise((res,rej) => {
                  res(elec)
                }))
              }
    
            })
  
            await this.sleep()
  
            return Promise.all(arr)
        }
  
        let data_list = (await elections())
  
        this.elections = this.fuseSearch(data_list, ['title','electionId'])
  

      } catch (error) {

        console.log(error)
      }

      
    },
    async searchPeople(){
      

        // grab all the elections
        let people = async ()=>{
          let arr = []
          this.$gun.get('users')
            .map()
            .once(d => {
              // console.log(d)

              if(d){
                arr.find(p => p.username == d.username) ? '' : 
                arr.push(new Promise((res,rej) => {
                  res(d)
                }))
              }

            })
  
            await this.sleep()
  
            return Promise.all(arr)
        }

        let data_list = (await people())
  
        this.people = this.fuseSearch(data_list, ['name', 'sch','dept','fac','username'])

    },
    async searchEvents(){
      // this.$gun.get('events')
      //   .get(this.query)
      //   .once(person => {
      //     // console.log({elec})
      //     if(person){
      //       this.people.find(p => p.username == person.username) ? '' : 
      //       this.people.push(person)
      //     }
          
      //   })
    },
    fuseSearch(data_list, keys=['name','title']){

      let fuseOptions = {
				shouldSort: true,
				tokenize: true,
				threshold: 0.6,
				location: 0,
        distance: 100,
        keys
      }
      
      let fuse = new Fuse(data_list, fuseOptions)
      
      return fuse.search(this.query)
    }
  },
  mounted(){
    this.initialize()
    
  },
  components: {
    Navigation
  }
}

import Navigation from '@/components/Navigation'
import { mapState, mapGetters } from "vuex";
import Fuse from 'fuse.js'
</script>

<style>

</style>