<template>
  <div>
    <navigation/>
    
    <vue-headful
      :title="title"
      :description="description"
    />
    
    <transition name="fade" mode="out-in">
      <loading-bar v-if="!show_when_ready" height="65vh"></loading-bar>

      <div v-else >

      <!-- ==DETAILS== -->
      <v-container :pa-1="$vuetify.breakpoint.xsOnly" class="">
        <v-card :flat="$vuetify.breakpoint.xsOnly">
          <v-layout row wrap>
            <v-flex sm12 md8 d-flex class="mb-0">
              <v-card dark flat tile class="ma-0">
                <v-list>
                  <v-list-tile avatar ref="list">
                    <v-list-tile-avatar>
                      <img :src="currElection.logo || 'https://res.cloudinary.com/unplugged/image/upload/v1557568933/logo-unn.png'" v-if="currElection.logo || currElection.sch == 'University of Nigeria'">
                      <span v-else class="black--text text-capitalize">{{currElection.title.charAt(0)}}</span>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{currElection.title}}</v-list-tile-title>
                      <v-list-tile-sub-title>{{currElection.official ? 'Official' : currElection.sch}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action v-show="$vuetify.breakpoint.smAndUp">
                      
                      <v-tooltip top class="d-inline">
                        <small slot="activator">Current Time</small>
                        <v-icon small color="red"  class="pr-2">mdi-alert-box</v-icon>
                        <span>Check that your time matches with this time</span>
                      </v-tooltip>
                      <iframe src="https://free.timeanddate.com/clock/i6svkufx/n1972/fs12/fcddd/tc424242/pc424242/ahr/tt0/tw0/tm1/ts1/ta1/tb1" frameborder="0" width="189" height="16"></iframe>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              
                <loading-bar spinnerType='circle' height="40vh" v-if="!timer_ready"></loading-bar>
                
                  <transition name="fade">
                    <v-card-text  v-if="timer_ready" ref="time">
                      <h4  v-if="status.not_started">Election starts in</h4>
                      <h4  v-if="status.inprogress" class="title error--text lighten-4">Election in progress</h4>

                      <v-container justify-center fill-height>
                        <v-layout align-center justify-center>
                          <v-flex xs12 sm12>
                            <v-card-text class="pa-0">
                              <div id="time" class="d-block" ref="div">

                                <vac :end-time="endTime" ref="countdown" :start-time="start" @onFinish="onFinish" @onProcess="onProcess">

                                  <span slot="process" slot-scope="{ timeObj }">

                                    <div class="verticalChart">

                                      <div class="singleBar">
                                        <div class="bar">
                                          <div class="value elevation-4" style="height: 38%;background:teal;">
                                            <span id="ontop">{{timeObj.d}}</span>
                                            <span>DAYS</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div class="singleBar">
                                        <div class="bar">
                                          <div class="value" style="height: 70%;background:#8bc34a;">
                                            <span id="ontop">{{timeObj.h}}</span>
                                            <span>HOURS</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="singleBar">
                                        <div class="bar">
                                          <div class="value" style="height: 90%;background:#ee44aa;">
                                            <span  id="ontop">{{timeObj.m}}</span>
                                            <span>MINUTES</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="singleBar">
                                        <div class="bar">
                                          <div class="value" style="height: 50%;background:#5192c5;">
                                            <span id="ontop">{{timeObj.s}}</span>
                                            <span>SECONDS</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                  </span>
                                  <span slot="finish">
                                    <div class="text-xs-left py-5" style="display:table;margin:auto;">
                                      <h3 class="display-1">Election Ended</h3>
                                      <small>at 
                                      {{new Date(endTime).toLocaleString('en-Us',{day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric',minute:'numeric'})}}</small>
                                    </div>
                                  </span>
                                </vac>
                                
                              
                              </div>
                              
                            </v-card-text>
                          </v-flex>
                        </v-layout>
                      </v-container>

                    </v-card-text>

                  </transition>

                  <transition name="fade" appear>
                    <!-- VOTE, ENROLL, FORUM, ACTIONS -->
                    <v-card-actions v-if="timer_ready">
                      <v-btn @click="show_results_dialog = true" color="pink" class="mr-3"
                        dark v-if="!status.not_started" small>
                        View Results
                      </v-btn>
                      <v-btn  color="teal" class="mr-3" dark @click="show_voting_dialog = true" small
                        v-if="canVote">
                        Vote 
                      </v-btn>

                      <v-tooltip right>
                        <v-btn  color="red" slot="activator" class="mr-3 text-capitalize" dark to="/verify" small
                          v-if="!is_verified">
                          Verify Your account
                        </v-btn>
                        <span>You need to verify your account before you can enroll to vote</span>
                      </v-tooltip>

                      <v-tooltip right v-if="status.not_started && is_verified" class="mr-3">
                        <v-btn  color="success" slot="activator" small dark @click="enroll_dialog = true" 
                            v-if="status.not_started && !hasEnrolled && is_verified">
                          Enroll
                        </v-btn>
                        <span>Enroll to vote</span>
                      </v-tooltip>

                      <!-- <v-tooltip right class="mr-3">
                        <v-btn  color="success" slot="activator" small dark 
                          to="/forum">
                          <v-icon>forum</v-icon>
                          <span class="ml-2">Forum</span>
                        </v-btn>
                        <span>Join the conversation for this election</span>
                      </v-tooltip> -->

                      <v-tooltip right v-if="isAdmin" class="hidden-xs-only">
                        <v-btn  color="secondary" slot="activator" small dark
                          @click="show_manager = !show_manager" v-if="isAdmin">
                          <v-icon>mdi-wrench</v-icon>
                          <span class="ml-2">Election Manager</span>
                        </v-btn>
                        <span>Election Manager</span>
                      </v-tooltip>
                    </v-card-actions>
                  </transition>
                

              </v-card>
            </v-flex>

            <!-- Election DETAILS> -->
            <v-flex sm12 md4 d-flex class="mb-0">
              <v-card tile flat>
                
                <v-toolbar color="success" dark dense card>
                  <v-toolbar-title>Election Info</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip right v-if="isAdmin" class="hidden-sm-and-up">

                    <v-btn slot="activator" 
                       flat outline
                      class="dark white--text text-capitalize"
                      @click="show_manager = !show_manager" v-if="isAdmin"
                    >
                      <v-icon>mdi-wrench</v-icon>
                      <span class="ml-2">Election Manager</span>
                    </v-btn>
                    <span>Election Manager</span>
                  </v-tooltip>
                </v-toolbar>
                <v-list dense>
                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-clock</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Start Time</span>
                      <span>{{(new Date(currElection.fullStartDate)).toLocaleString('en-Us',{day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric',minute:'numeric'})}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                  
                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-timer</v-icon>   
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Duration</span>
                      <span>{{currElection.duration}} hrs</span>
                    </v-list-tile-title>
                  </v-list-tile>
                  
                  <v-list-tile @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-play</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Status</span>
                      <span v-if="!timer_ready">Checking...</span>
                      <span v-else>{{status.not_started ? 'Not started' : status.inprogress ? 'In progress' : 'Ended'}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.type == 'School'" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-school</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">School</span>
                      <span>{{currElection.sch}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-layers</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Level</span>
                      <span>{{currElection.level}} Election</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.type == 'School' 
                    && (currElection.level != 'General')" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-domain</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">Faculty</span>
                      <span>{{currElection.fac}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.level == 'Department'" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">mdi-map-marker</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">Department</span>
                      <span>{{currElection.dept}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
                <v-card-actions>
                  <v-layout row wrap justify-center>
										
										<v-flex shrink class="mr-5 text-xs-center">
											<v-progress-circular
												:value="100"
												size="80"
												color="success"
											>
											{{no_of_voters || 0}}
											</v-progress-circular>
											<span class="d-block mt-2"> Voters</span>
										</v-flex>

										<v-flex shrink class="text-xs-center">
											<v-progress-circular
												:value="80" size="80"
												color="purple lighten-2"
											>
											{{no_of_contestants}}
											</v-progress-circular>
											<span class=" d-block ml-1 mt-2"> Contestants</span>
										</v-flex>

									</v-layout>
                </v-card-actions>
              </v-card>
            </v-flex>

          </v-layout>
        </v-card>
      </v-container>
      <v-divider class="hidden-sm-and-up"></v-divider>

      <!-- VOTE -->
      <v-dialog v-model="show_voting_dialog" v-if="show_voting_dialog" lazy scrollable fullscreen :transition="switchTransition">
        <v-card>
          <v-toolbar card dense dark color="success">
            <v-btn icon dark @click.native="isNotVoting; show_voting_dialog = false;">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-toolbar-title>Vote: {{currElection.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
              <v-btn dark flat @click.native="isNotVoting; show_voting_dialog = false;">Cancel</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="pa-0">
            <vote :currElection='currElection' :contestants='contestants' :rawVotes='rawVotes'></vote>
          </v-card-text>
          
        </v-card>
      </v-dialog>

      <!-- RESULTS -->
      <v-dialog v-model="show_results_dialog" scrollable
        fullscreen :transition="switchTransition" lazy>
        <v-card flat>
          <v-toolbar dense card flat dark color="success">
            <v-btn flat icon v-if="$vuetify.breakpoint.xsOnly"
              @click.native="show_results_dialog = false;">
              <v-icon>mdi-chevron-left</v-icon> 
            </v-btn>
            <v-divider vertical inset light v-if="$vuetify.breakpoint.xsOnly"></v-divider>

            <v-toolbar-title >Election Results: {{currElection.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
              <v-btn icon @click.native="show_results_dialog = false;">
                <v-icon >mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <results v-if="!status.not_started" :id='currElection._id' :chartData3='chartData' :allVotes='allVotes' :currElection='currElection' 
            :contestants='contestants' :regVoters='regVoters' :roles='currElection.roles' :rawVotes="rawVotes"
            :status="status" :startTime="startDate" :endTime="endTime2">
            </results>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- VOTERS, ACTIVITIES, ACTIONS -->
      <v-container class='election_details' grid-list-lg :pa-2="$vuetify.breakpoint.xsOnly">
        <v-layout row wrap>
          <v-flex sm12 md3 d-flex  mb-0>
            <v-card>
              <v-tabs left color="teal" dark show-arrows>
                <v-tabs-slider color="orange"></v-tabs-slider>

                <v-tab href="#tab-1" class="text-capitalize"> Voters </v-tab>

                <v-tab href="#tab-2" class="text-capitalize"> Activity </v-tab>

                <v-tab href="#tab-3" class="text-capitalize"> Manifestos</v-tab>

                <v-tab-item value="tab-1">
                  
                  <v-container class="my-2 pt-1 px-1">
                    <div style="height:320px;overflow-y:auto;">
                      <v-subheader v-if="regVoters.length == 0">No voters yet</v-subheader>
                      <v-list two-line dense v-if="regVoters.length > 0" key="list">
                        <template v-for="(voter, index) in regVoters">
                          <v-list-tile  :key="voter.name + 'reg_voters'" avatar @click="$eventBus.$emit('ViewProfile', voter)" :color="voter.online ? 'default' : 'grey'">
                            
                            <v-list-tile-avatar :color="$helpers.colorMinder(voter.name.charAt(0))">
                              <img  :src="voter.photoURL" v-if="voter.photoURL">
                              
                              <span v-else class="white--text headline">{{voter.name.charAt(0)}}</span>
                              
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                              <v-list-tile-title  class="text-capitalize text-truncate">
                                <span class="online_badge" :class="voter.online ? 'success' : 'orange'"></span>
                                {{voter.name}}
                              </v-list-tile-title>
                              <!--v-list-tile-sub-title v-html="voter.username" ></v-list-tile-sub-title-->
                              <v-list-tile-sub-title v-if="!isVoting(voter.uid)">
                                <span style=''>
                                  {{voted(voter) ? 'Voted' : 'Not Voted'}}
                                </span>
                                
                              </v-list-tile-sub-title>
                              <v-list-tile-sub-title v-else color="green"><span style='color:green;'>voting...</span></v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-divider  :inset="true" :key="index + 'votrsi'"></v-divider>
                        </template>
                      </v-list>
                      <v-btn color="secondary" flat small @click="moreVoters" v-if="regVoters.length > 25 && currElection.voters > regVoters.length"
                        :loading="loading_more_voters" style="text-transform: initial">
                        See more
                      </v-btn>
                    </div>
                  </v-container>
                </v-tab-item>
                
                <v-tab-item value="tab-2">
                  <v-subheader>Recent activities</v-subheader>
                  <v-divider></v-divider>
                  <div class="pt-2 my-2">
                    <div style="height:350px;overflow-y:auto;">
                      <v-timeline align-top dense>
                        <v-timeline-item :color="getColor(activity)" small v-for="(activity, i) in activities" :key="i + 'activity'">
                          <v-layout pt-3>
                            <v-flex>
                              <strong>
                                <span class="secondary--text linkify" @click="$eventBus.$emit('ViewProfile', activity.onr)">
                                  {{activity.onr.uid == currElection.admin ? 'Admin' : 
                                  activity.onr.name}}
                                </span>
                                {{activity.body}}</strong>
                              <div class="caption">{{new Date(activity.tstamp.toMillis()).toDateString('en-Us',{day:'numeric'})}}</div>
                            </v-flex>
                          </v-layout>
                        </v-timeline-item>
                      </v-timeline>
                    </div>
                    <v-btn color="secondary" flat small @click="moreActivities" v-if="activities.length > 25"
                      :loading="loading_more_activities" style="text-transform: initial">
                      See more
                    </v-btn>
                  </div>
                </v-tab-item>

                <v-tab-item value="tab-3">
                  <v-container class="pa-0 my-2">
                    <!-- <v-subheader>Manifestos</v-subheader> -->
                    <v-list dense style="height:320px;overflow-y:auto;">
                      <v-subheader v-if="manifestos.length == 0">No manifestos</v-subheader>
                      <template v-for="(manifesto, i) in manifestos">
                        <v-list-tile avatar  :key="i + '_manifesto'"
                          @click="viewManifesto(manifesto)">
                          <v-list-tile-avatar :color="$helpers.colorMinder(manifesto.onr.name.charAt(0))">
                            <img :src="manifesto.onr.photoURL" v-if="manifesto.onr.photoURL">
                            <span v-else class="white--text">{{manifesto.onr.name.charAt(0)}}</span>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>{{manifesto.title}}</v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider :key="'man_key' + i"></v-divider>
                      </template>
                    </v-list>
                  </v-container>
                </v-tab-item>

              </v-tabs>
              
            </v-card>
          </v-flex>
          <v-flex sm12 md9  d-flex mb-0>
            <v-card style="min-height:400px;width:100%;">
              <v-container>
                <v-toolbar flat dense color="white">
                  <v-toolbar-title><h5><v-icon color="orange">mdi-equalizer</v-icon> Stats</h5></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn small flat color="success" 
                    outline  @click="show_summary_dialog = true; title_string = `Election Results`" 
                    :disabled="!status.election_ended">
                    Results Summary
                  </v-btn>
                  
                </v-toolbar>
                <bar-chart :chart-data="chartData" :options="chartOptions" ></bar-chart>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- ===CONTESTANTS=== -->
      <v-container grid-list-md :pa-2="$vuetify.breakpoint.xsOnly">
        <v-card class="pa-4" :flat="$vuetify.breakpoint.xsOnly" :class="{round:$vuetify.breakpoint.smAndUp}" style="min-height:150px;">
          <v-subheader class="font-weight-bold">Contestants</v-subheader>
          <v-subheader v-if="contestants && contestants.length == 0">No contestants</v-subheader>

          <carousel v-if="showCarousel && contestants && contestants.length > 0" :nav='true' :responsive="{0:{items:1,nav:false},600:{items:3,nav:true},800:{items:5,nav:true}}" >
    
            <v-card class="round_top mr-2 mb-2 grey lighten-4"
              height="300" v-for="contestant in contestants" :key="contestant.email" style="position: relative">
              <v-sheet width="100%" height="80" :color="$helpers.colorMinder(contestant.name.charAt(0)) + ' lighten-3'">

              </v-sheet>
              <v-sheet width="61%" height="120" style="position: absolute;top: 25px;left: 20%;" color="transparent">
                <v-avatar class="d-block mx-auto"
                  size="100"
                  :color="$helpers.colorMinder(contestant.name.charAt(0))"
                >
                  <img :src="contestant.photoURL" :alt="contestant.name" v-if="contestant.photoURL">
                  <span v-else style="padding-top: 28px;" class="d-block white--text display-2 text-capitalize">{{contestant.name.charAt(0)}}</span>
                </v-avatar>
              </v-sheet>

              <v-card-text style="margin-top: 60px;" class="px-1 text-xs-center" 
                @click.stop="$eventBus.$emit('ViewProfile', contestant)">
                <div class="subheading font-weight-bold mb-0 text-capitalize .text-truncate hover">
                  {{contestant.name}}
                  <span class="online_badge success" v-if="contestant.online"></span>
                </div>
                <div>
                  <i>for</i> {{getRole(contestant)}}
                </div>
              </v-card-text>
              <v-card-actions>

                <v-tooltip top class="mx-auto" v-if="contestant.uid != getUser.uid">
                  <v-btn :color="$helpers.colorMinder(contestant.name.charAt(0))" slot="activator" outline dark 
                    class="mx-auto text-capitalize"  
                    :disabled='!!disabled.find(uid => uid == contestant.uid)'
                    @click="follow($event,contestant)" :id="contestant.uid">
                    {{(contestant.followers || 0).toLocaleString()}} Followers
                  </v-btn>
                  <span :ref="contestant.uid">{{contestant.followers}} Followers</span>
                </v-tooltip>

                <v-btn :color="$helpers.colorMinder(contestant.name.charAt(0))" outline dark 
                  class="mx-auto text-capitalize" v-if="contestant.uid == getUser.uid" 
                  @click="''">
                  {{(contestant.followers || 0).toLocaleString()}} Followers
                </v-btn>
              </v-card-actions>
            </v-card>
            
          </carousel>
        </v-card>
      </v-container>

      <!-- MANAGE ELECTION DIALOG -->
      <v-dialog v-model="show_manager" fullscreen lazy
        hide-overlay transition="dialog-bottom-transition" scrollable>
        <v-card tile>
          <v-toolbar card color="secondary" flat dark>
            <v-toolbar-title>Election Manager</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="" icon @click="show_manager = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text class="pa-0">
            <manage-election :election='currElection' :voters="regVoters" :acts="activities" :conts="all_contestants"/>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- VIEW MANIFESTO -->
      <v-dialog v-model="show_manifesto_dialog" content-class="white view_dialog"
        v-if="show_manifesto_dialog" max-width="500" lazy scrollable :transition="switchTransition"
          :fullscreen="$vuetify.breakpoint.xsOnly || fullscreen">
        <v-card style="min-height: 450px;">
          <v-list dense dark :class="[$helpers.colorMinder(viewing.onr.name.charAt(0))]">
            <v-list-tile avatar>
              <v-list-tile-action class="hidden-sm-and-up" style="min-width: 30px;">
                <v-btn flat icon @click="show_manifesto_dialog = false">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-avatar :color="!viewing.photoURL ? viewing.onr.name.charAt(0) : ''">
                <img v-if="viewing.onr.photoURL" :src="viewing.onr.photoURL">
                <span v-else class="white--text">{{viewing.onr.name.charAt(0)}}</span>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="text-capitalize">{{viewing.onr.name}}</v-list-tile-title>
                <v-list-tile-sub-title>{{$helpers.parseDate(viewing.tstamp)}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action class="hidden-xs-only">
                <v-btn flat icon @click="fullscreen = !fullscreen">
                  <v-icon>{{fullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen"}}</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action class="hidden-xs-only">
                <v-btn flat icon @click="show_manifesto_dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>

          <v-card-text>
            <v-container grid-list-xs>
              <v-layout row wrap justify-center>
                <v-flex shrink>
                  <v-card flat class="grey lighten-5 pa-3">
                    <div v-html="viewing.body"></div>
                    
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- SUMMARY OF RESULTS -->
      <v-dialog
        v-model="show_summary_dialog"
        fullscreen hide-overlay scrollable
        transition="dialog-transition"
        lazy
      >
        <v-card class="grey lighten-4">
          <v-toolbar card color="teal" dark>
            <div class="title">Summary of Results</div>
            <v-spacer></v-spacer>
            <v-btn flat icon @click.native="printResult" class="hidden-sm-and-down">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
            <v-btn flat icon @click.native="show_summary_dialog = false; title_string = 'Vote'">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pa-0">
            <results-summary 
              :curr-election="currElection" 
              :raw-votes="rawVotes" 
              :get-admin="getAdmin" 
              :status="status"
              :timer_ready="timer_ready"
              :contestants="contestants"
              :all-votes="allVotes">
            </results-summary>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- ENROLL DIALOG -->
      <v-dialog
        v-model="enroll_dialog"
        :persistent="enrolling"
        :overlay="false"
        max-width="350px"
        transition="dialog-transition"
      >
        <v-card>
          <v-toolbar card dense>
            Enroll
          </v-toolbar>
          <v-card-text>
            Enroll in this election to be able to vote or participate in the forum
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" flat @click="enroll_dialog = false" :disabled="enrolling">Cancel</v-btn>
            <v-btn color="success" depressed @click.native="enroll" :loading="enrolling">Enroll</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>

      </div>
    </transition>
    </div>
  </template>
<script>
export default {
  data:()=>({
    title_string: 'Vote',
    description: '',
    show_when_ready: false,
    timer_ready: false,
    time_lag: 0,
    endTime: 0,
    endTime1: 0, // countdown b4 start of election
    endTime2: 0, // countdown b4 end of election
    start: 0,
    manifestos: [],
    voters_offset: '',
    activities_offset: '',
    loading_more_voters: false,
    loading_more_activities: false,
    enroll_dialog: false,
    enrolling: false,
    disabled: [],
    allVotes: [],
    myEnrolledElc: [], 
    elecRef: '', // primarilly to detatch listeners
    moreUserInfoRef: '', // primarilly to detatch listeners
    votesRef: '', // primarilly to detatch listeners
    contestantsRef: '',
    activityRef: '', // primarilly to detatch listeners
    currElection:{}, // contains the current election
    regVoters:[], // contains registered voters for the current election
    activities: [],
    startDate:'',
    countDownDate:'',
    interval:'',
    showCarousel:true,
    electionTime:'',
    date_options:{
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    status: {}, // the election progress - notstarted, inprogress, ended
    voterprofile: {},
    contestants: [], // contestants not suspended
    all_contestants: [], // all the contestants for this election
    rawVotes: [], // contains all the raw votes made for the current election
    votingList: [], // list of people currently voting for the current election
    show_voting_dialog: false, // whether to show the voting window/ dialog
    show_results_dialog: false, // whether to show the results window/ dialog
    show_manifesto_dialog: false,
    show_summary_dialog: false,
    viewing: {}, // manifesto in view
    fullscreen: false, // read manifesto in fullscreen mode
    show_manager: false,
    chartData: {},
    data: [],
    labels:[],
    bgdColor:[],
    chartOptions:{
      responsive: true, maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: true
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
    tabledata: [],
    
  }),
  props:['electionId'], // this prop is from the vue-router params
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      let arr = []
      value.split(' ').map((item,index)=>
        arr.push(item.charAt(0).toUpperCase() + item.slice(1))
      )
      return arr.toString().split(',').join(' ')
    }
  },
  watch:{
    $route:function(to,from){
      
    },
    curRoom: function(){
      this.contestants = []
      this.curRoom && this.getUserInfo ? this.setup() : ''
      // Rerender the contestants carousel
      this.showCarousel = false
      setTimeout(()=>this.showCarousel = true, 2000)
    },
    getUserInfo: function(){
      this.getUserInfo && this.curRoom ? this.setup() : ''
    },
    timer_ready: function(to, from){
      // console.log(this.$refs)
    }
  },
  computed:{
    title(){
      return `${this.title_string} | ${this.$appName}`
    },
    getStartDate(){
      return new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
    },
    suspendedContestants(){
      let suspended = this.currElection.suspended ? this.currElection.suspended.length : 0

      return suspended > 0 ? suspended + ' contestants suspended' : 'No contestant suspended'
    },
    totalVotes(){
      let totalVotes = 0
      this.allVotes.forEach(vote =>{
        totalVotes += vote.score
      })
      return totalVotes
    },
    no_of_voters(){
      let len = this.currElection.voters
        
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
			}
    },
    no_of_contestants(){
			let len = this.currElection.contestants
			
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
			}
    },
    styleObj(){
      if(this.$vuetify.breakpoint.smAndDown){
        return {
          height:'100vh',
          backgroundColor:'#fff'
        }
      }
    },
    canVote(){
      return this.status.inprogress && 
      !this.voted(this.getUserInfo) &&
      this.hasEnrolled && 
      this.is_verified
    },
    switchTransition(){
      return this.$vuetify.breakpoint.smAndDown ? 
      'slide-x-reverse-transition' : 
      'dialog-bottom-transition'
    },
    isAdmin(){
      return this.currElection.admins.includes(this.getUser.uid)
    },
    getAdmin(){
      //console.log(this.regVoters)
      let found = this.regVoters.find(voter => voter.uid == this.currElection.admin)
      return found ? found : this.currElection.admin
    },
    hasEnrolled(){
      ////console.log(this.regVoters)
      return this.getUserInfo && this.getUserInfo.enrolled ? 
      !!this.getUserInfo.enrolled.find(elec => elec == this.currElection.electionId) : false
    },
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getSchools',
      // ...
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser',
      'is_verified'
    ])
  },
  methods:{
    async setup(){
      // get election
      // console.log(this.curRoom)
      // No, get election afresh, so you can watch the changes
      this.show_when_ready = false

      this.getCurElection().then(async ()=>{

        await this.allContestants()
        await this.getVoters()
        await this.getVotes()
        this.open()
      })
      

      this.getActivities()
      
      this.getManifestos()
      // console.timeEnd('watch')
      
    },
    getCurElection(){
      return new Promise((resolve, reject) => {
        this.elecRef = db.collection('elections').doc(this.curRoom.electionId)
        .onSnapshot(doc => {
          this.currElection = doc.data()
          // console.log(doc.data())
          resolve(doc.data())
        }, err => {})
      })
    },
    getVoters(){
      return new Promise((resolve, reject)=>{
        // get registered voters
        this.moreUserInfoRef = db.collection('moreUserInfo')
        .where('enrolled','array-contains', this.curRoom.electionId)
        .limit(25).onSnapshot(async querySnapshot=>{
          let regVoters = []
          querySnapshot.forEach(doc=>{
            //console.log(doc.id, " => ", doc.data());
            regVoters.push(doc.data())
          })
          this.regVoters = regVoters
          this.voters_offset = querySnapshot.docs[querySnapshot.docs.length -1]
          resolve(regVoters)
        }, function(err){
          // console.log(err)
          reject(err)
        })
      })
    },
    getVotes(){
      return new Promise((resolve, reject)=>{
        // get raw votes for this election
        this.votesRef = db.collection('votes')
        .where('elecRef', '==', this.curRoom.electionId)
        .onSnapshot(async querySnapshot=>{
          let arr = []
          querySnapshot.forEach(doc=>{
            arr.push(doc.data())
          })
          this.rawVotes = arr // the raw votes
          // console.log(this.rawVotes)
          this.allVotes = await this.getScores(await this.sortByRoles(this.rawVotes))
          resolve(arr)
        }, error=>{
          // console.log(error)
          reject(error)
        })
      })
    },
    getActivities(){
      return new Promise((resolve, reject)=>{

        this.activityRef = db.collection('activities')
        .limit(25).orderBy('tstamp', 'desc')
        .where('elecRef', '==', this.curRoom.electionId)
        .onSnapshot(async querySnapshot=>{
          let acts = []
          querySnapshot.forEach(doc=>{
            acts.push(doc.data())
          })
          this.activities_offset = querySnapshot.docs[querySnapshot.docs.length - 1]
          this.activities = acts
          resolve(acts)
        }, err => reject(err))
      })
    },
    printResult(){
      window.print()
    },
    async allContestants(){
      // get contestants
      
      let contestantsRef = db.collection('moreUserInfo')
      .where('contests', 'array-contains', this.currElection.electionId)
      .onSnapshot(querySnapshot =>{
        let contestants = []
        let contestants2 = []

        querySnapshot.forEach(doc =>{
          // show only contestants that are not suspended. therefore they can't be voted for
          let isSuspended = this.currElection.suspended ?
            this.currElection.suspended.includes(doc.data().uid) : 
            false

          isSuspended ? '' : 
          contestants.push(doc.data())

          contestants2.push(doc.data())
        })

        // console.log({contestants})

        this.contestants = contestants
        this.all_contestants = contestants2
        // this.getLabels()
        // this.setTableData()
      })

    },
    async getManifestos(){
       db.collection('manifestos')
      .where('elecRef','==',this.curRoom.electionId)
      .get().then(querySnapshot=>{
        let manifestos = []
        querySnapshot.forEach(doc => {
          manifestos.push(doc.data())
        });
        this.manifestos = manifestos
        //console.log(this.manifestos)
      }, err=>{
        // console.log(err)
      })
    },
    viewManifesto(manifesto){
      // console.log(manifesto)
      this.viewing = manifesto
      this.show_manifesto_dialog = true
    },
    async sortByRoles(votes){
      let resultsByRoles = {};
      if(votes.length > 0){
        for(let item of Object.keys(votes[0].choices)){
          // console.log({item})
          resultsByRoles[item] = [];
        }

        
        votes.map((item,index)=>{
          for(let i=0;i<Object.keys(item.choices).length;i++){
            let f = Object.keys(item.choices)[i] // each key
            // console.log(resultsByRoles)
            resultsByRoles[f].push(item.choices[f])
          }
          
        })
        //console.log(resultsByRoles)
        /* => {
                president:['contestant1id','contestant2id']
              }
        */
        return resultsByRoles
      }
    },
    async getScores(results){
      let scores = [];
      //console.log('resultsByRoles: ', results)
      for(let role in results){
        
        // sort the array of contestant ids in 'results[role]' by the ids
        // so that duplicate ids are grouped together
        //E.g ==> president:['contestant1id','contestant1id','contestant2id']
        let sortedVal = results[role].sort()
        sortedVal.forEach(id=>{
          if(!scores.find(item=> item.id === id)){
            let firstPos = sortedVal.indexOf(id);
            let lastPos = sortedVal.lastIndexOf(id);
            let score = lastPos - firstPos + 1;
            scores.push({id:id,score:score,role:role});
          }
        })
      }
      //console.log('scores: ', scores)
      return scores;
    },
    async open(){
      try{

        this.show_when_ready = false

        if(this.currElection.timed){
          this.timer_ready = false;
          // if the election is a timed election
          // this.getServerTime().then(resp=>{
            //console.log(resp.time - Date.now())
            let serverTime = (new Date()).getTime() // resp.time
            this.time_lag = serverTime - (new Date()).getTime()

            this.countDownTimer()
          // }).catch(err=> {
          //   // console.log(err,err.response)
          // })
        }
        else{
          this.status = {
            inprogress: true,
            not_started: false
          }
        }
        this.getLabels()
        // this.setTableData()
        this.show_when_ready = true
      }catch(error){
        // console.log(error)
      }

    },
    async enroll(){
      this.enrolling = true

      firebase.auth().currentUser.getIdToken().then((token)=>{
        api().post('enroll',{
          electionId: this.currElection.electionId,
          idToken: token
        }).then(result =>{
          
          this.$eventBus.$emit('Snackbar', {
            show: true,
            message: 'Enrollement successfull!',
            color: 'success'
          })

          this.enrolling = false
          this.enroll_dialog = false
        }).catch(error=>{
          this.$Nprogress.done()
          this.enrolling = false
          this.enroll_dialog = false

          if(error.response){
            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: error.response.data.message,
              color: 'error'
            })
          }else{
            this.$eventBus.$emit('Snackbar', {
              show: true,
              message: 'Something went wrong, check your internet connection and try again',
              color: 'error'
            })
          }
          
        })
      })
    },
    moreVoters(){

      this.loading_more_voters = true
      db.collection('moreUserInfo')
      .where('enrolled','array-contains', this.currElection.electionId)
      .startAfter(this.voters_offset).limit(25)
      .get().then(querySnapshot =>{
        querySnapshot.forEach(doc =>{
          this.regVoters.push(doc.data())
        })
        this.voters_offset = querySnapshot.docs[querySnapshot.docs.length -1]
        this.loading_more_voters = false
      })
    },
    moreActivities(){

      this.loading_more_activities = true
      db.collection('moreUserInfo')
      .where('enrolled','array-contains', this.currElection.electionId)
      .startAfter(this.activities_offset).limit(25)
      .get().then(querySnapshot =>{
        querySnapshot.forEach(doc =>{
          this.activities.push(doc.data())
        })
        this.activities_offset = querySnapshot.docs[querySnapshot.docs.length - 1]
        this.loading_more_activities = false
      })
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      let found = this.currElection.roles.find(role=>role.value == ref.role)
      return found ? found.title : false
    },
    async getServerTime(){
  
      return new Promise((resolve,reject)=>{

        firebase.auth().currentUser.getIdToken()
        .then(async (token)=>{
          
          api().post('serverTimestamp', { idToken: token }).then(resp=>{
            resolve(resp.data)
          }).catch(err=>reject(err))
        })
      })
      
    },
    onFinish(v){
        let now = (new Date()).getTime() + this.time_lag;

        if(now > this.endTime2){
          // Election ended
          // console.log('ended-ended')
          this.status = {
            inprogress: false,
            not_started: false,
            election_ended: true
          }
        }
        
        else {
          // still in progress or not started
          // console.log('not started or inprogress')
          this.countDownTimer()
        }
      
    },
    onProcess(v){
      // console.log('process', v)
    },
    countDownTimer(){
      
      this.timer_ready = false
      this.startDate = (new Date(this.currElection.fullStartDate)).getTime();
      let now = (new Date()).getTime() + this.time_lag;
    
      this.start = now + this.time_lag;

      this.endTime1 = this.startDate
      this.endTime2 = this.startDate + this.currElection.duration * 1000 * 60 * 60
      // console.log(this.endTime1, new Date(this.currElection.fullStartDate))
      if(now < this.endTime1){ // not started yet
      
        this.endTime = this.endTime1
        this.status = {
          inprogress: false,
          not_started: true,
          election_ended: false
        }
        setTimeout(()=> {
          this.timer_ready = true
        }, 1000)
      }
      else if(now > this.endTime1 && now < this.endTime2){ // started
        
        this.endTime = this.endTime2
        this.status = {
          inprogress: true,
          not_started: false,
          election_ended: false
        }
        setTimeout(()=> {
          this.timer_ready = true
        }, 1000)
      }

      else {
        
        this.endTime = this.endTime2
        this.status = {
          inprogress: false,
          not_started: false,
          election_ended: true
        }

        setTimeout(()=> {
          this.timer_ready = true
        }, 1000)
      }
        

    },
    voted(voter){
      if(this.currElection){
        let voted = voter.voted ? voter.voted.find(eId => eId == this.currElection.electionId) : false
        return voted ? true : false
      }
      else{
        return false
      }
    },
    isNotVoting(){
      //console.log('closed voting dialog')
      this.votingList.splice(this.votingList.indexOf(this.getUser.uid), 1)
    },
    getLabels(){
      
      this.labels = []
      this.data = []
      this.bgdColor = []
      // console.log(this.contestants)
      this.contestants.map(contestant=>{
        if(this.allVotes && this.contestants.length > 0){ // if there are votes
        
        // get votes for a particular contestant
        let foo = this.allVotes.filter(vote=> {
          return contestant.uid == vote.id
        })
        let contestant_name = this.$helpers.capitalize(contestant.name)
        this.labels.push(this.$helpers.truncateText(contestant_name))

        this.data.push(foo[0] ? foo[0].score > 0 ? foo[0].score : 0 : 0)
        
        let random1 = Math.floor(Math.random() * Math.floor(255))
        let random2 = Math.floor(Math.random() * Math.floor(255))
        let random3 = Math.floor(Math.random() * Math.floor(255))
        this.bgdColor.push(`rgba(${random1}, ${random2},  ${random3}, 0.5)`)
        
        }
      })
      this.renderChart()
    },
    renderChart(){
      this.chartData = {
        labels: this.labels,
        datasets :[
          {
            label: '# of votes',
            backgroundColor: this.bgdColor,
            data: this.data,
          }
        ]
      }
    },
    getColor(activity){
      switch (activity.type) {
        case 'voter_registered':
          return 'purple'
        case 'election_created':
          return 'primary'
        case 'election_updated':
          return 'error'
        case 'logo_updated':
          return 'secondary'
        case 'new_contestant':
          return 'teal'
        case 'voter_registered':
          return 'orange'
        case 'vote_casted':
          return 'success'
        case 'contestant_suspended':
          return 'black'
        case 'contestant_restored':
          return 'success'
        default:
          return 'white'
      }
    },
    isFollowing(contestant){
      return contestant.followers.indexOf(this.getUser.uid) == -1 ? false : true
    },
    follow(event,contestant){

      this.disabled.push(contestant.uid)

      this.$helpers.followUser(this.getUserInfo, contestant)
      .then(data =>{
        this.disabled.splice(this.disabled.indexOf(contestant.uid),1)
        // console.log(this.$refs)
        if(data.following){
          // contestant.followers += 1

          this.$refs[contestant.uid][0].innerText = `You are following ${contestant.name}`
        }
        else{
          // contestant.followers -= 1
          this.$refs[contestant.uid][0].innerText = `Follow ${contestant.name}`
        }
      })
      .catch(err => {
        // console.log(err)
        // contestant.followers += 1
        this.disabled.splice(this.disabled.indexOf(contestant.uid),1)
      })
       
    },
    follow_election(){
      ////console.log(this.getUser)
      let this_user = this.getUser
      this.disabled.push(this_user.uid)
      if(this.currElection.followers.find(data=> data == this_user.uid)){
        // is following
        this.currElection.followers.splice(this.currElection.followers.indexOf(this_user),1)
        db.collection('elections').doc(this.currElection.electionId).update({
          followers:firebase.firestore.FieldValue.arrayRemove(this_user.uid)
        }).then(res=>{
          this.disabled.splice(this.disabled.indexOf(this_user.uid),1)
          
        })
      }
      else{
        // not following
        this.currElection.followers.push(this_user.uid)
        db.collection('elections').doc(this.currElection.electionId).update({
          followers:firebase.firestore.FieldValue.arrayUnion(this_user.uid)
        }).then(res=>{
          
          this.disabled.splice(this.disabled.indexOf(this_user.uid),1)
          
        })
      }
    },
    isVoting(id){
      return this.votingList.indexOf(id) == -1 ? false : true
    },
    isContestant(voterId){
      let found = this.contestants.find(contId =>
      contId == voterId)
      return !!found
    }
  },
  mounted(){
    // console.log(this.curRoom, 'mounted')
    this.curRoom ? this.getUserInfo ? this.setup() : '' : ''

    this.$eventBus.$on('Suspend_Contestant', data => {
      this.contestants = this.contestants.filter(cont => cont.uid != data)
      this.currElection.suspended.push(data)
      this.getLabels()
    })
    this.$eventBus.$on('Restore_Contestant', data => {
      let contestant = this.all_contestants.find(cont => cont.uid == data)
      this.contestants.push(contestant)
      this.currElection.suspended.splice(this.currElection.suspended.indexOf(data),1)
      this.getLabels()
    })
  },
  async created(){
    // get the elections the user enrolled in
    try {

      this.$eventBus.$on('Hide_Profile', data=>{
        this.viewprofile = false
      })
      
      this.$eventBus.$on('Close_Voting_Dialog', data=>{
        this.show_voting_dialog = false
      })
     
    } catch (error) {
      //console.log(error)
      
    }
  },
  destroyed(){
    this.elecRef ? this.elecRef() : ''
    this.moreUserInfoRef ? this.moreUserInfoRef() : ''
    this.votesRef ? this.votesRef() : ''
  },
  components:{
    //ViewProfile,
    LoadingBar,
    Vote,
    Results,
    BarChart,
    carousel,
    Navigation,
    // Manifesto,
    ManageElection,
    ResultsSummary
  },
}
import api from '@/services/api'
  import {mapGetters, mapState} from 'vuex'
  //import ViewProfile from '@/components/ViewProfile'
  import Results from '@/components/Results'
  import Vote from '@/components/Vote'
  import BarChart from '@/charts/barchart'
  import carousel from 'vue-owl-carousel'
  import Navigation from '@/components/Navigation'
  import LoadingBar from '@/spinners/LoadingBar'
  import ResultsSummary from '@/components/ResultsSummary'
  // import Manifesto from '@/components/Manifesto'
// import { setTimeout } from 'timers';
import ManageElection from '@/components/ManageElection'
import {firebase, db, database} from '@/plugins/firebase'
</script>
<style lang="scss" scoped>
  @mixin borderRadius($radius) {
    border-radius: $radius;
    -webkit-border-radius:$radius;
    -moz-border-radius:$radius;
    -o-border-radius:$radius;
  }
  $mainBgColor:#1c1f35;

  .v-dialog--fullscreen{
    background:#fff !important;
  }
  #bar_chart{
    width:100%;
  }

  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
  .linkify{
    cursor: pointer;
  }
  .round_top {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    -webkit-border-top-right-radius: 10px;
    -webkit-border-top-left-radius: 10px;
    -moz-border-top-right-radius: 10px;
    -moz-border-top-left-radius: 10px;
    -o-border-top-right-radius: 10px;
    -o-border-top-left-radius: 10px;
    -ms-border-top-right-radius: 10px;
    -ms-border-top-left-radius: 10px;
  }
  @media (min-width: 0){
    .flex.xs12 {
      margin-bottom: 15px;
      padding:0;
    }
    .election_details .pr-2{
      padding-right:0 !important;
    }
    .election_details .pl-1{
      padding-left:0 !important;
    }
    #tslshow .flex.xs12{
      width:45vh !important;
    }
    
  }
  .online_badge{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 5px;
  }
  .hover{
    &:hover{
      cursor: pointer;
    }
  }

  .following{
    color:#4CAF50,
  }
  .following::before{
    border:1px solid #4CAF50
  }
  #first{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  #last{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .timer{
    //display:inline-block;
    //padding:5px;
    color:#fff;
    background:teal;
    background:#000;
    box-shadow: 1px 4px 9px 0px #1b1a1a;
    //margin-right:2px;
  }
  
  body {
  background-color: #2D89EF;
  font-family: "Titillium Web", Helvetica, Arial, sans-serif;
}
.verticalChart {
  width:100%;
  .singleBar {
    width:23%;
    float:left;
    margin-left:0.5%;
    margin-right:0.5%;
    .bar {
      position:relative;
      height:200px;
      //background:rgba(255,255,255,0.2);
      overflow:hidden;
      .value {
        position:absolute;
        bottom:0;
        width:100%;
        background:#ffffff;
        color:#ffffff;
        span {
          position:absolute;
          font-size:12px;
          bottom:0;
          width:100%;
          height:20px;
          color:#fff;
          display:block;
          text-align:center;
        }
        #ontop{
          bottom:58px;
          font-size: 3em;
        }
      }
    }
  }
}

  /* --scrollbar --*/
.scrollbar::-webkit-scrollbar {
    width: 8px;
    background-color: #d7d7df ;
    @include borderRadius(10px)
  }
.scrollbar_thin::-webkit-scrollbar {
    width: 2px;
    background-color: #d7d7df ;
    @include borderRadius(10px)
  }
.scrollbar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #d7d7df ;
  @include borderRadius(10px)
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color:#87899c ;
  @include borderRadius(10px);
}
</style>
