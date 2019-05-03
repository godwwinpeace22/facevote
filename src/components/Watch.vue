<template>
  <div>

    <navigation>
      <span slot="title">Vote</span>
      <h1 slot="extended_nav" v-if="$vuetify.breakpoint.smAndUp && currElection">{{currElection.title}}</h1>
    </navigation>

    <vue-headful
      :title="title"
      :description="description"
    />
    
    <transition name="fade" mode="out-in">
      <loading-bar v-if="!show_when_ready" height="65vh"></loading-bar>

      <div v-else >

      <!-- ==DETAILS== -->
      <v-container :pa-1="$vuetify.breakpoint.xsOnly" class="grey lighten-2">
        <v-card :flat="$vuetify.breakpoint.xsOnly">
          <v-layout row wrap>
            <v-flex xs12 sm8 d-flex class="mb-0">
              <v-card dark flat tile class="ma-0">
                <v-list>
                  <v-list-tile avatar>
                    <v-list-tile-avatar>
                      <img src="http://elearning.unn.edu.ng/img/logo-silouette.png">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{currElection.title}}</v-list-tile-title>
                      <v-list-tile-sub-title>Election Id: {{currElection.electionId}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
                <!-- <v-card-title class="headline">{{currElection.title}}</v-card-title>
                <small class="pl-3 d-block" style="color:#eee;">Electi Id: {{currElection.electionId}}</small> -->
              
                <loading-bar spinnerType='circle' height="40vh" v-if="!timer_ready"></loading-bar>
                
                  <transition name="fade">
                    <v-card-text  v-if="timer_ready">
                      <h4  v-if="status.not_started">Election starts in</h4>
                      <h4  v-if="status.inprogress" class="title error--text lighten-4">Election in progress</h4>

                      <v-container justify-center fill-height>
                        <v-layout align-center justify-center>
                          <v-flex xs12 sm12>
                            <v-card-text class="pa-0">
                              <div id="time" class="d-block">

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
                                      {{new Date(endTime).toLocaleString('en-Us',date_options)}}</small>
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
                      <v-tooltip right v-if="status.not_started" class="mr-3">
                        <v-btn  color="success" slot="activator" small dark :to="`/enroll`" 
                            v-if="status.not_started && !hasEnrolled">
                          Enroll
                        </v-btn>
                        <span>Enroll to vote</span>
                      </v-tooltip>

                      <v-tooltip right class="mr-3">
                        <v-btn  color="success" slot="activator" small dark 
                          to="/forum">
                          <v-icon>forum</v-icon>
                          <span class="ml-2">Forum</span>
                        </v-btn>
                        <span>Join the conversation for this election</span>
                      </v-tooltip>

                      <v-tooltip right v-if="isAdmin" class="hidden-xs-only">
                        <v-btn  color="secondary" slot="activator" small dark
                          @click="show_manager = !show_manager" v-if="isAdmin">
                          <v-icon>build</v-icon>
                          <span class="ml-2">Election Manager</span>
                        </v-btn>
                        <span>Election Manager</span>
                      </v-tooltip>
                      <!--v-btn color="secondary" class="ml-3" small v-if="getUser.uid == currElection.admin"
                        :to="`/elections/manage/${currElection.electionId}`">
                        <v-icon>settings</v-icon>
                        <span class="ml-2">Manager</span></v-btn-->
                    </v-card-actions>
                  </transition>
                

              </v-card>
            </v-flex>

            <!-- Election DETAILS> -->
            <v-flex xs12 sm4 d-flex class="mb-0">
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
                      <v-icon>build</v-icon>
                      <span class="ml-2">Election Manager</span>
                    </v-btn>
                    <span>Election Manager</span>
                  </v-tooltip>
                </v-toolbar>
                <v-list dense>
                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">schedule</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Start Time</span>
                      <span>{{(new Date(getStartDate)).toLocaleString('en-Us',{hour:'numeric',minute:'numeric'})}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                  
                  <v-list-tile v-if="currElection.timed" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">timer</v-icon>   
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Duration</span>
                      <span>{{currElection.duration}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                  
                  <v-list-tile @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">adjust</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Status</span>
                      <span v-if="!timer_ready">Checking...</span>
                      <span v-else>{{status.not_started ? 'Not started' : status.inprogress ? 'In progress' : 'Ended'}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.type == 'School'" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">school</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">School</span>
                      <span>{{currElection.sch}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">layers</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      <span class="mr-3">Level</span>
                      <span>{{currElection.level}} Election</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.type == 'School' 
                    && (currElection.level != 'General')" @click="''">
                    <v-list-tile-action>
                      <v-icon color="teal">domain</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">Faculty</span>
                      <span>{{currElection.fac}}</span>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile v-if="currElection.level == 'Department'" @click="''">
                    <v-list-tile-action>
                      <v-icon>place</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title class="text-capitalize">
                      <span class="mr-3">Department</span>
                      <span>{{currElection.dept}}</span>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
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
              <v-icon>chevron_left</v-icon>
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
              <v-icon>chevron_left</v-icon> 
            </v-btn>
            <v-divider vertical inset light v-if="$vuetify.breakpoint.xsOnly"></v-divider>

            <v-toolbar-title >Election Results: {{currElection.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
              <v-btn icon @click.native="show_results_dialog = false;">
                <v-icon >close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <results v-if="!status.not_started" :id='currElection._id' :chartData3='chartData' :allVotes='allVotes' :currElection='currElection' 
            :contestants='contestants' :regVoters='regVoters' :roles='currElection.roles' :rawVotes="rawVotes"
            :status="status" :startTime="startDate" :endTime="endTime">
            </results>
          </v-card-text>
        </v-card>
      </v-dialog>


      <!-- ==SMALL CARDS== -->
      <v-container :pa-2="$vuetify.breakpoint.xsOnly" grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm4 md3 v-for="(flashNumber,i) in flashNumbers" :key="i + 'flash'">
            <v-card class="mt-3 mx-auto round" :class="{'mt-4': $vuetify.breakpoint.xsOnly}">
              <v-sheet
                class="v-sheet--offset ml-3" 
                :color="flashNumber.color" elevation="3"
                max-width="35%" height="80">
                <v-icon class='mx-auto d-block ma-auto' 
                  style="width:50px;padding-top:15%;" size="50" color="white">
                  {{flashNumber.icon1}}
                </v-icon>
              </v-sheet>

              <v-card-text class="pt-0">
                <div class="subheading font-weight-light grey--text mb-2">{{flashNumber.text}}</div>
                <div class="subheading font-weight-light text-xs-right">{{(flashNumber.number).toLocaleString()}}</div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>{{flashNumber.icon2}}</v-icon>
                <span class="caption grey--text font-weight-light">{{flashNumber.sub}}</span>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

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
                      <transition-group name="list">
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
                      </transition-group>
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
                  <v-toolbar-title><h5><v-icon color="orange">equalizer</v-icon> Stats</h5></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn small flat color="success" 
                    outline  @click="show_summary_dialog = true" 
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
                  size="120"
                  :color="$helpers.colorMinder(contestant.name.charAt(0))"
                >
                  <img :src="contestant.photoURL" :alt="contestant.name" v-if="contestant.photoURL">
                  <span v-else style="padding-top: 36px;" class="d-block white--text display-2">{{contestant.name.charAt(0)}}</span>
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
                    {{(contestant.followers).toLocaleString()}} Followers
                  </v-btn>
                  <span :ref="contestant.uid">{{contestant.followers}} Followers</span>
                </v-tooltip>

                <v-btn :color="$helpers.colorMinder(contestant.name.charAt(0))" outline dark 
                  class="mx-auto text-capitalize" v-if="contestant.uid == getUser.uid" 
                  @click="''">
                  {{(contestant.followers).toLocaleString()}} Followers
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
              <v-icon>close</v-icon>
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
                  <v-icon>chevron_left</v-icon>
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
                  <v-icon>fullscreen</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action class="hidden-xs-only">
                <v-btn flat icon @click="show_manifesto_dialog = false">
                  <v-icon>close</v-icon>
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
      >
        <v-card class="grey lighten-4">
          <v-toolbar card color="teal" dark>
            <div class="title">Summary of Election Results</div>
            <v-spacer></v-spacer>
            <v-btn flat icon @click="show_summary_dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pa-0">
            <v-container grid-list-sm fluid>
              <v-layout row wrap justify-center>
                <v-flex sm12 md8>
                  <v-card class="round">
                    <v-card-title primary-title>
                    </v-card-title>
                    
                    <v-data-table
                      :headers="headers"
                      :items="tabledata"
                      :loading='false'
                    >
                    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                      <template slot="items" slot-scope="props">
                        <td>{{ props.item.name | capitalize}}</td>
                        <td class="text-xs-left">{{ props.item.role }}</td>
                        <td class="text-xs-left">{{ props.item.department }}</td>
                        <td class="text-xs-left">{{ props.item.faculty }}</td>
                        <td class="text-xs-left">{{props.item.score}}</td>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      </div>
    </transition>
    </div>
  </template>
<script>
export default {
  data:()=>({
    title: 'Vote | Facevote',
    description: '',
    show_when_ready: false,
    timer_ready: false,
    time_lag: 0,
    endTime: 0,
    start: 0,
    manifestos: [],
    voters_offset: '',
    activities_offset: '',
    loading_more_voters: false,
    loading_more_activities: false,
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
    headers: [
      {
      text: 'Name',
      align: 'left',
      sortable: false,
      value: 'name'
      },
      {text:'Role', value:'role'},
      {text:'Department', value:'department'},
      {text:'Faculty', value:'faculty'},
      {text:'Votes', value:'score'},
    ],
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
      this.setup()
      // Rerender the contestants carousel
      this.showCarousel = false
      setTimeout(()=>this.showCarousel = true, 2000)
    }
  },
  computed:{
    getStartDate(){
      return new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
    },
    flashNumbers(){
      return [
        {
          text:'Registerd voters',
          number: this.currElection.voters,
          icon1: 'trending_up',
          icon2: 'timer',
          sub: this.lastRegistration,
          color: 'teal'
        },
        {
          text:'Contestants',
          number: this.contestants.length,
          icon1: 'equalizer',
          icon2: 'block',
          sub: this.suspendedContestants,
          color: 'orange'
        },
        {
          text: 'Votes',
          number: this.totalVotes,
          icon1: 'how_to_vote',
          icon2: 'timer',
          sub: this.lastVotedTime,
          color: 'primary'
        },
        // {text:'Followers',number:this.currElection.followers.length,icon1:'people',icon2:'timer',sub:'opps sub'}
      ]
    },
    lastRegistration(){
      // TAKE NOTE: ITS POSIBLE THAT THE ACTIVITIES RETRIEVED DOES NOT CONTAIN 
      // A REGISTRATION ACTIVITY. SO YOU MIGHT WANT TO DO A SEARCH SPECIALLY FOR THAT
      // KIND OF ACTIVITY

      let regActivities = this.activities.filter(
        activity => activity.type == 'voter_registered'
      )
      ////console.log(regActivities[0])

      if(regActivities && regActivities.length > 0){
        // console.log(regActivities.length)
        let the_last_reg_time = regActivities[0].tstamp.toMillis()
        let now = Date.now()
        let oneMin = 60 * 1000
        let oneHour = 60 * oneMin
        let oneDay = 24 * oneHour
        let oneWeek = oneDay * 7
        let time_difference = now - the_last_reg_time
        //console.log(now,the_last_reg_time,time_difference)
        return time_difference < oneMin ?
        'Last registration a few seconds ago' :
        time_difference < oneHour ? 'Last registration ' + Math.floor(time_difference/oneMin) + ' minutes ago' :
        time_difference < oneDay ? 'Last registration ' + Math.floor(time_difference/oneHour) + ' hours ago' :
        time_difference < oneWeek ? 'Last registration ' + Math.floor(time_difference/oneDay) + ' days ago' :
        'Last registration ' + new Date(the_last_reg_time).toLocaleString('en-Us',{year:'numeric', month: 'short',day: 'numeric'})
      }
      else{
        return 'No registrations yet'
      }
    },
    suspendedContestants(){
      let suspended = this.currElection.suspended ? this.currElection.suspended.length : 0

      return suspended > 0 ? suspended + ' contestants suspended' : 'No contestant suspended'
    },
    lastVotedTime(){
      if(this.rawVotes && this.rawVotes.length > 0){
        let sortedVotes = this.rawVotes.sort((a,b)=>b.tstamp.toMillis() - a.tstamp.toMillis())
        let the_last_vote_time = sortedVotes[0].tstamp.toMillis()
        let now = Date.now()
        let oneMin = 60*1000
        let oneHour = 60*oneMin
        let oneDay = 24*oneHour
        let oneWeek = oneDay * 7
        let time_difference = now - the_last_vote_time
        
        return time_difference < oneMin ?
        'Last vote a few seconds ago' :
        time_difference < oneHour ? 'Last vote ' + Math.floor(time_difference/oneMin) + ' minutes ago' :
        time_difference < oneDay ? 'Last vote ' + Math.floor(time_difference/oneHour) + ' hours ago' :
        time_difference < oneWeek ? 'Last vote ' + Math.floor(time_difference/oneDay) + ' days ago' :
        'Last vote ' + new Date(the_last_vote_time).toLocaleString('en-Us',{year:'numeric', month: 'short', day: 'numeric'})
      }
      else{
        return 'No votes yet'
      }
      
    },
    totalVotes(){
      let totalVotes = 0
      this.allVotes.forEach(vote =>{
        totalVotes += vote.score
      })
      return totalVotes
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
      this.hasEnrolled
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
      return this.getUserInfo.enrolled.find(elec => elec == this.currElection.electionId) ? true : false
    },
    ...mapGetters([
      'getUser',
      'getUserInfo',
      'getSchools',
      // ...
    ]),
    ...mapState([
      'curRoom',
      'isSuperUser'
    ])
  },
  methods:{
    async setup(){
      // get election

      this.currElection = this.curRoom
      
      // get registered voters
      this.moreUserInfoRef = db.collection('moreUserInfo')
      .where('enrolled','array-contains', this.currElection.electionId)
      .limit(25)
      .onSnapshot(async querySnapshot=>{
        this.regVoters = []
        querySnapshot.forEach(doc=>{
          //console.log(doc.id, " => ", doc.data());
          this.regVoters.push(doc.data())
        })
        this.voters_offset = querySnapshot.docs[querySnapshot.docs.length -1]
        await this.allContestants()
        //console.log('allcontestants')
        this.open()
      }, function(err){
        // handle listening errors
        // console.log(err)
      })


      // get raw votes for this election
      this.votesRef = db.collection('votes')
      .where('elecRef', '==', this.currElection.electionId)
      .onSnapshot(async querySnapshot=>{
        let arr = []
        querySnapshot.forEach(doc=>{
          arr.push(doc.data())
        })
        this.rawVotes = arr // the raw votes
        // console.log(this.rawVotes)
        this.allVotes = await this.getScores(await this.sortByRoles(this.rawVotes))
        // console.log(this.allVotes)
        // this.getLabels()
        // this.$store.dispatch('allVotes', arr)
      }, error=>{
        // console.log(error)
      })
      

      // Get activities
      this.activityRef = db.collection('activities')
      .limit(25)
      .orderBy('tstamp', 'desc')
      .where('elecRef','==',this.currElection.electionId).onSnapshot(async querySnapshot=>{
        let acts = []
        querySnapshot.forEach(doc=>{
          acts.push(doc.data())
        })
        this.activities_offset = querySnapshot.docs[querySnapshot.docs.length - 1]
        this.activities = acts
      })
      
      this.getManifestos()
      // console.timeEnd('watch')
      
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

        this.contestants = contestants
        this.all_contestants = contestants2
        this.getLabels()
        this.setTableData()
      })

    },
    async getManifestos(){
       db.collection('manifestos')
      .where('elecRef','==',this.currElection.electionId)
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
          resultsByRoles[item] = [];
        }

        
        votes.map((item,index)=>{
          for(let i=0;i<Object.keys(item.choices).length;i++){
            let f = Object.keys(item.choices)[i] // each key
            ////console.log(f)
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
    setTableData(){
      this.tabledata = [] // to prevent multiple pushings
      if(this.allVotes && this.contestants.length > 0){

        this.contestants.forEach(cont=>{
          
          // get votes for a particular contestant
          let foo = this.allVotes.filter(vote=> {
            return cont.uid == vote.id
          })
  
          let myObj = {
            value: false,
            name: cont.name,
            email: cont.email,
            contId: cont.uid, // contestant id
            role: this.getRole(cont),
            department: cont.dept,
            faculty: cont.fac,
            score: foo[0] ? foo[0].score > 0 ? foo[0].score : 0 : 0
          }
          this.tabledata.push(myObj)
        })
      }
    },
    async open(){
      try{
        if(this.currElection.timed){
          this.timer_ready = false;
          // if the election is a timed election
          this.getServerTime().then(resp=>{
          //console.log(resp.time - Date.now())
          let serverTime = resp.time
          let time_lag = serverTime - Date.now()
          this.time_lag = time_lag

          this.countDownTimer()
        }).catch(err=> {
          // console.log(err,err.response)
        })
        }else{
          this.status = {
            inprogress: true,
            not_started: false
          }
        }
        
        // this.getLabels()
        this.show_when_ready = true
      }catch(error){
        // console.log(error)
      }

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
      // === TODO: MAKE SURE YOU SECURE THIS ENDPOINT! ===
      return new Promise((resolve,reject)=>{
        api().post('dashboard/serverTimestamp').then(resp=>{
          resolve(resp.data)
        }).catch(err=>reject(err))
      })
      
    },
    onFinish(v){
      let newDate = this.startDate + this.currElection.duration * 1000 * 60 * 60
      let now = new Date().getTime() + this.time_lag;
      // console.log('finished', now)
      if(now > newDate){
        // console.log('completed')
        this.status = {
          inprogress: false,
          not_started: false,
          election_ended: true
        }
      }
      // if(this.currElection.voters >= this.rawVotes.length){
        
      //   this.timer_ready = false;
      //   let timeout = setTimeout(()=>{
      //     console.log('all caught-up')
      //     this.endTime = new Date('2001-01-01').getTime()
      //     this.status = {
      //       inprogress: false,
      //       not_started: false,
      //       election_ended: true
      //     }
      //     this.timer_ready = true
      //     // this.$refs.countdown.startCountdown('restart')
      //   }, 1000)
      // }
      else{
        this.timer_ready = false;
        let timeout = setTimeout(()=>{
          // console.log('progress')
          this.endTime = newDate
          this.start = new Date().getTime() + this.time_lag;
          this.status = {
            inprogress: true,
            not_started: false,
            election_ended: false
          }
          this.timer_ready = true
          // this.$refs.countdown.startCountdown('restart')
        }, 2000)

        
      }
      
    },
    onProcess(v){
      // console.log(v)
      let now = new Date().getTime() + this.time_lag;

      if(now < this.startDate){ // not started yet
        this.status = {
          inprogress: false,
          not_started: true,
          election_ended: false
        }
      }
      if(now > this.startDate && v.timeObj.leftTime > 0){ // started
       
        this.status = {
          inprogress: true,
          not_started: false,
          election_ended: false
        }
      }
      // if(this.currElection.voters == this.rawVotes.length){
      //   this.$refs.countdown.stopCountdown()
      //   this.timer_ready = false;
      //   let timeout = setTimeout(()=>{
      //     console.log('all caught-up', this.$refs)
      //     this.endTime = new Date('2001-01-01').getTime()
      //     this.status = {
      //       inprogress: false,
      //       not_started: false,
      //       election_ended: true
      //     }
      //     this.timer_ready = true
          
      //   }, 1000)
      // }
    },
    countDownTimer(){
      this.startDate = new Date(this.currElection.startDate + ' ' + this.currElection.startTime).getTime();
      let now = new Date().getTime()

      // if(this.startDate > Date.now()){
      //   console.log('not_started')
      //   this.endTime = this.startDate

      //   this.status = {
      //     inprogress: false,
      //     not_started: true,
      //     election_ended: false
      //   }
      // }
      // if(now > this.startDate){
      //   console.log('completed')
      //   this.status = {
      //     inprogress: false,
      //     not_started: false,
      //     election_ended: true
      //   }
      // }
      // else{
      //   console.log('inprogress')
      //   this.endTime = this.startDate + this.currElection.duration * 1000 * 60 * 60
      //   this.status = {
      //     inprogress: true,
      //     not_started: false,
      //     election_ended: false
      //   }
      // }
      
      this.endTime = this.startDate
      this.start = now + this.time_lag;
      
      // this.timer_ready = true
      setTimeout(()=> {
        this.timer_ready = true
      }, 1000)
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
        case 'election_edited':
          return 'success'
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
    // isAdmin(voterId){
    //   return voterId === this.currElection.admin
    // },
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
    // console.log(this.$parent)
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
      // console.log('watch components')
      // console.time('watch')
      this.curRoom ? this.setup() : ''

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
    this.moreUserInfoRef();
    this.votesRef();
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
    ManageElection
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
  // import Manifesto from '@/components/Manifesto'
import { setTimeout } from 'timers';
import ManageElection from '@/components/ManageElection'
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
