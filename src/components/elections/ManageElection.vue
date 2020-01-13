<template>
  <div>

		<vue-headful :title="title"/>

    <navigation :show_extension="true" color="purple"
      extension_height="50"
      :prominent="true"
      >
			<template v-slot:title>
        <span>Election Manager - {{currElection.title}}</span>
      </template>

      <template v-slot:img="{ props }">
        <v-img
          :src="require('@/assets/webinar.jpg')"
        ></v-img>
      </template>

      <template v-slot:extension>

        <v-tabs
          align-with-title
          v-model="tabs"
          background-color="transparent"
          >
          <v-tab href="#tab-1" class="text-capitalize"> Overview</v-tab>
          <v-tab href="#tab-2" class="text-capitalize"> General Settings</v-tab>
          <v-tab href="#tab-3" class="text-capitalize"> Contestants and roles</v-tab>
          <v-tab href="#tab-4" class="text-capitalize"> Voting and results</v-tab>
          <v-tab href="#tab-5" class="text-capitalize"> Scheduling </v-tab>
        </v-tabs>
      </template>
    </navigation>

		<transition name="fade" mode="out-in">
			
		<loading-bar v-if="!showUi" height="80vh"></loading-bar>
			
		<div v-if="showUi">

			<v-tabs-items v-model="tabs">
				<v-tab-item value="tab-1">
					
					<!-- == OVERVIEW == -->
					<v-container class="pb-0">
						<v-row>
							<v-col cols="12" md="8">
								<transition name="fade">
									<v-card color="" class="" 
										dark flat tile outlined>

										<v-list>
											<v-list-item  ref="list">
												<v-list-item-avatar color="teal">
													<img :src="currElection.logo" v-if="currElection.logo">
													<span v-else class="text-capitalize">{{currElection.title.charAt(0)}}</span>
												</v-list-item-avatar>
												<v-list-item-content>
													<v-list-item-title>{{currElection.title}}</v-list-item-title>
													<v-list-item-subtitle>{{currElection.official ? 'Official' : currElection.sch}}</v-list-item-subtitle>
												</v-list-item-content>
												<v-list-item-action>
													<v-menu offset-y>
														<template v-slot:activator="{on}">
															<v-icon @click="''" v-on="on">mdi-dots-vertical</v-icon>
														</template>
														<!-- <v-btn color="info" dark slot="activator">text</v-btn> -->
														<v-list dense>
															<v-list-item @click="''">
																<v-list-item-title>Copy election link</v-list-item-title>
															</v-list-item>
														</v-list>
													</v-menu>
												</v-list-item-action>
											</v-list-item>
										</v-list>
										
											<v-card-text  v-if="showUi">
												<!-- <h4  v-if="status.not_started">Election starts in</h4>
												<h4  v-if="status.inprogress" class="title error--text lighten-4">Election in progress</h4> -->

												<v-container justify-center fill-height>
													<v-row align-center justify-center>
														<v-col cols="12" sm="12">
															<v-card-text class="">
																<div class="d-block">

																	<div class="text-xs-left py-5" style="display:table;margin:auto;">
																		<h3 class="display-1">
																			{{electionStatus[0]}}
																		</h3>
																		</div>
																	
																</div>
																
															</v-card-text>
														</v-col>
													</v-row>
												</v-container>

											</v-card-text>
											<v-card-actions>
												<v-btn color="success" 
													depressed small 
													@click="changeElectionStatus('inprogress')"
													v-if="!currElection.timed && currElection.status == 'inRegistration'"
													class="text-capitalize">
													Start Election
												</v-btn>
												<v-btn color="purple" depressed 
													v-if="!currElection.timed && currElection.status == 'inprogress'"
													@click="changeElectionStatus('ended')"
													small class="text-capitalize">
													End Election
												</v-btn>
											</v-card-actions>

									</v-card>
                </transition>
							</v-col>
							<v-col cols="12" md="4">
								<v-card outlined class="pt-4" flat>
										
										<v-card-text class="pt-0">

											<v-list dense >
												<v-list-item>
													<v-list-item-action>
														<v-icon color="teal">mdi-clock</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Start Date</span>
														<span>{{electionStartDate}}</span>
													</v-list-item-title>
												</v-list-item>
												<v-list-item>
													<v-list-item-action>
														<v-icon color="teal">mdi-timer</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Duration</span>
														<span>{{currElection.duration}} hrs</span>
													</v-list-item-title>
												</v-list-item>
												
												<v-list-item>
													<v-list-item-action>
														<v-icon color="teal">mdi-school</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">School</span>
														<span>{{currElection.sch}}</span>
													</v-list-item-title>
													<v-list-item-action>
													</v-list-item-action>
												</v-list-item>

												<v-list-item v-if="currElection.level == 'Faculty'">
													<v-list-item-action>
														<v-icon color="teal">mdi-domain</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Faculty</span>
														<span>{{currElection.fac}}</span>
													</v-list-item-title>
												</v-list-item>

												<v-list-item v-if="currElection.level == 'Department'">
													<v-list-item-action>
														<v-icon color="teal">mdi-map-marker</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Department</span>
														<span>{{currElection.dept}}</span>
													</v-list-item-title>
												</v-list-item>

												<v-list-item>
													<v-list-item-action>
														<v-icon color="teal">mdi-adjust</v-icon>
													</v-list-item-action>
													<v-list-item-title class="ml-0">
														<span class="mr-3">Status</span>
														<span :class="[electionStatus[1] + '--text']">
															{{electionStatus[0]}}
														</span>
													</v-list-item-title>
												</v-list-item>

											</v-list>

										</v-card-text>

										<v-card-actions>
											<v-row justify="center" align="center">
												
												<div class="mr-10">
													<v-progress-circular
														:value="100"
														size="60" 
														color="success"
													>
													{{no_of_voters || 0}}
													</v-progress-circular>
													<span	class="d-sm-block mt-sm-2 text-center"> Voters</span>
												</div>

												<div class="ml-10 ">
													<v-progress-circular
														:value="80" size="60"
														color="purple lighten-2"
													>
													{{no_of_contestants || 0}}
													</v-progress-circular>
													<span	class="d-sm-block mt-sm-2">Contestants</span>
												</div>

											</v-row>
										</v-card-actions>

									</v-card>
							</v-col>
						</v-row>
					</v-container>

				</v-tab-item>

				<v-tab-item value="tab-2">
					<v-container>
						<v-row justify="center">
							<v-col cols="12" sm="8">
								<v-card outlined>
					
									<v-card-text class="pt-3">
										<v-subheader class="pl-0 font-weight-bold">Election title</v-subheader>
										<v-text-field
											class="mb-5"
											name="title" hide-details color="primary"
											label="Edit Title" outlined
											:value="currElection.title" v-model.trim="form.title"
										></v-text-field>

										<v-textarea
											class="mb-5"
											name="desc" hide-details color="primary"
											label="About election" outlined
											:value="currElection.about" v-model.trim="form.about"
										></v-textarea>
										
										<v-subheader class="pl-0 font-weight-bold">Election logo</v-subheader>
										<v-file-input 
											show-size outlined 
											v-model="logo"
											prepend-icon=""
											hide-details class="mb-3"
											append-icon="mdi-paperclip"
											:disabled="uploading_logo" 
											label="Select logo">
										</v-file-input>

										<v-btn depressed small color="primary" 
											v-if="logo" class="text-normal ml-0 mb-5"
											:loading="uploading_logo"
											@click="uploadLogo">
											Upload logo
										</v-btn>

										<v-textarea
											name="terms" outlined
											label="Terms and conditions"
											v-model="form.terms"
										></v-textarea>

										<v-list subheader three-line>
											<v-subheader class="font-weight-bold mb-0">Election interaction</v-subheader>
											<v-list-item >
												<v-list-item-action>
													<v-checkbox
														v-model="form.enable_forum"
														class="mt-0"
														color="success">
													</v-checkbox>
													
												</v-list-item-action>
												<v-list-item-content>
													<v-list-item-title>Enable chat forum</v-list-item-title>
													<v-list-item-subtitle>Check this to enable forum</v-list-item-subtitle>
													
												</v-list-item-content>
											</v-list-item>

											<v-subheader class="font-weight-bold mb-0">Manifestos</v-subheader>
											<v-list-item >
												<v-list-item-action>
													<v-checkbox
														v-model="form.allow_manifestos"
														class="mt-0"
														color="success">
													</v-checkbox>
													
												</v-list-item-action>
												<v-list-item-content>
													<v-list-item-title>Allow manifestos</v-list-item-title>
													<v-list-item-subtitle>Contestants can submit their manifestos</v-list-item-subtitle>
													
												</v-list-item-content>
											</v-list-item>
											
										</v-list>

									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="success"
											depressed
											:disabled="currElection.status == 'ended'"
											@click="updateGeneralSettings">
											Save Changes
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-col>
						</v-row>
					</v-container>
				</v-tab-item>

				<v-tab-item value="tab-3">
					<v-container>
						<v-row justify="center">
							<v-col cols="12" sm="10">
								<v-card outlined class="my-5" style="min-height:200px;">
									<v-card-text>
										<v-subheader class="font-weight-bold mb-2">Adding Contestants</v-subheader>
										<p class="ml-4">Who can contest for this election?</p>
										<v-radio-group class="ml-4" v-model="form.who_can_contest" mandatory>
											
											<v-radio label="Everyone" value="everyone"></v-radio>
											<v-radio label="Everyone with access token" value="everyone_with_access"></v-radio>
											<v-radio label="Manual selection" value="manual"></v-radio>
										</v-radio-group>

										<v-card outlined class="mb-3" v-if="form.who_can_contest == 'everyone_with_access'">
											<v-card-text>
												Lorem ipsum dolor sit amet consectetur adipisicing elit. 
												Nemo saepe, odio reiciendis laboriosam culpa sint
											</v-card-text>
											<v-card-actions>
												<input type="text" 
													v-if="access_token" 
													v-model="access_token" 
													@focus="copyAccessToken(access_token)">
												<v-btn color="info" dark small 
													@click="copyAccessToken(access_token)" depressed
													:disabled="!access_token">
													Copy
												</v-btn>
												<v-btn color="grey" dark small depressed @click="generateToken()">Generate</v-btn>
											</v-card-actions>
										</v-card>

										<v-divider v-else></v-divider>
										<v-toolbar light flat height="50px">
											<v-toolbar-title class="">Roles</v-toolbar-title>
											<v-spacer></v-spacer>
											<v-btn 
												color="primary" class="text-capitalize"
												depressed left text
												@click.native.stop="dialog = !dialog">
												<v-icon>mdi-plus</v-icon>
												New Role
											</v-btn>

											
										</v-toolbar>

										<v-dialog v-model="dialog" max-width="500px">
											<v-card>
												<v-card-title primary-title class="title mb-0 pb-0">Create A New Role</v-card-title>
												<v-card-text>
													<v-text-field label="Role title" v-model.trim="role_input" color="primary" 
														hint="e.g president, secretary, vice-chancellor"></v-text-field>
													<small class="grey--text"></small>
													<p>
														<small class="grey--text">* try not to use abbreviations</small>
													</p>
													<v-divider></v-divider>
													<v-textarea v-model.trim="role_input_desc"
														label="Role description (optional)" outlined
														name="name" color="primary" hint="e.g what this role can do"
													></v-textarea>
												</v-card-text>
												<v-card-actions>
													<v-spacer></v-spacer>
														<v-btn text @click.native="dialog = false">Cancel</v-btn>
														<v-btn text color="success" @click.native="addrole" :disabled="!role_input">Add role</v-btn>
												</v-card-actions>
											</v-card>
										</v-dialog>

										<v-select class="mt-4" deletable-chips
											v-model="form.roles"
											:items="form.roles" return-object
											item-text="title" cache-items
											item-disabled="disabled"
											color="primary"
											chips label="Roles"
											multiple outlined
										></v-select>
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="success" class="ml-3 text-capitalize" depressed
											@click="updateRoles">
											Save Changes
										</v-btn>
									</v-card-actions>
								</v-card>

							</v-col>
						</v-row>
					</v-container>

					<!-- CONTESTANTS -->
					<v-container>
						<v-row justify="center">

							<v-col cols="12" sm="10">
								<v-card class="round_top" outlined>
									<v-card-title primary-title>
										Contestants
										<v-spacer></v-spacer>
										<v-text-field
											v-model="search"
											append-icon="mdi-magnify"
											label="Search"
											single-line
											color="primary"
											hide-details
										></v-text-field>

										<v-dialog
											v-model="add_contestant_dialog"
											 
											persistent :overlay="false"
											max-width="500px"
											transition="dialog-transition">

											<template v-slot:activator="{on}">
												<v-btn color="info" v-on="on" 
													text class="ml-3 text-capitalize">
													<v-icon>mdi-plus</v-icon>
													Add contestant
												</v-btn>
											</template>

											<v-card flat>
												<div class="v-card__title">
													Add contestants
												</div>
												<v-card-text>
													<v-text-field
														name="username"
														label="Enter contestant username"
														v-model="form2.username"
													></v-text-field>

													<v-select
														:items="roles"
														v-model="form2.role"
														item-value="value"
														item-text="title"
														return-object
														label="Assign Role or position"
													></v-select>
												</v-card-text>
												<v-card-actions>
													<v-spacer></v-spacer>
													<v-btn @click="add_contestant_dialog = false" depressed>Close</v-btn>
													<v-btn color="info" :disabled="!form2.username || !form2.role"
														depressed :loading="loading"
														@click="addContestant">
														Add
													</v-btn>
												</v-card-actions>
											</v-card>
										</v-dialog>
									</v-card-title>
									
									<v-data-table
										:headers="headers"
										:items="contestants"
										:search="search"
										:loading='false'
										class="elevation-0"
									>
									<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
										<template v-slot:item.actions="{item}" >
											
											<td class="justify-center">
												
												<v-tooltip top>
													<template v-slot:activator="{on}">
														<v-icon v-on="on"
															class="mt-3" color="error" 
															small @click="culprit = item.author; 
															suspend_dialog = true"
															:disabled="item.suspended">
															mdi-cancel
														</v-icon>
													</template>
													<span>Disable contestant</span>
												</v-tooltip>
											</td>
										</template>
									</v-data-table>
								</v-card>
							</v-col>
							
							<!-- <v-col cols="12" sm="10">
								<v-card class="round" outlined>
									<v-list dense class="grey lighten-4">
										<v-list-item >
											<span class="font-weight-bold">Tokens</span>
										</v-list-item>
									</v-list>
									<v-divider></v-divider>
									<div class="" style="max-height:250px;overflow-y:auto;">
										<v-expansion-panels inset >
											<v-expansion-panel v-for="(role,i) in roles"
												:key="i">
												<v-expansion-panel-header>
													<div
														class="primary--text font-weight-bold text-uppercase" style="color:;">
														{{role.title}}
													</div>
												</v-expansion-panel-header>
												<v-expansion-panel-content>
													
													<v-card flat>
														<v-card-text>This token should be issued to contestants who wants to contest for the role of 
															<strong>{{role.title}}</strong> and has met your requirements
														</v-card-text>
													</v-card>
													<v-card-actions>
														<h4 class="pl-2">{{role.token}}</h4>
													</v-card-actions>
												</v-expansion-panel-content>
											</v-expansion-panel>
										</v-expansion-panels>
									</div>
								</v-card>
							</v-col> -->
							
						</v-row>
					</v-container>

				</v-tab-item>
				
				<v-tab-item value="tab-4">
					<v-container>
						<v-row justify="center">
							<v-col cols="12" sm="8">
								<v-card color="" outlined class="mb-5">
									<v-card-text>

										<v-subheader class="font-weight-bold mb-2">Who Can Vote</v-subheader>
										
										<v-radio-group class="ml-4" v-model="form.who_can_vote" mandatory>
											<v-radio 
												label="Anyone can vote ananymouosly" 
												value="anyone"></v-radio>
											<!-- <v-radio 
												label="Only those with access token can vote" 
												value="anyone_with_access"></v-radio> -->
											<v-radio 
												label="Only those added manually" 
												value="manual"></v-radio>
										</v-radio-group>

										<v-card outlined class="mb-3" v-if="form.who_can_vote == 'anyone_with_access'">
											<v-card-text>
												Lorem ipsum dolor sit amet consectetur adipisicing elit. 
												Nemo saepe, odio reiciendis laboriosam culpa sint
											</v-card-text>
											<v-card-actions>
												<input type="text" 
													@focus="copyAccessToken(voter_access_token)"
													v-model="voter_access_token" >
												<v-btn color="info" dark small 
													@click="copyAccessToken(voter_access_token)" depressed
													>
													Copy
												</v-btn>
											</v-card-actions>
										</v-card>

										<v-card v-if="form.who_can_vote == 'manual'" flat width="500" class="grey lighten-4">
											<v-card-text>
												
												<v-file-input
													v-model="file"
													placeholder="Upload csv"
													label="Voters list"
													outlined 
													:disabled="loading"
													prepend-icon=""
													append-icon="mdi-paperclip"
													accept=".csv"
												>
													<template v-slot:selection="{ text }">
														<v-chip
															small
															label
															color="primary"
														>
															{{ text }}
														</v-chip>
													</template>
												</v-file-input>
												<v-btn color="info" depressed small
													@click="uploadVoterList"
													:disabled="!file"
													:loading="loading">
													Upload New list
												</v-btn>

												<v-btn color="grey" depressed small
													class="ml-2" dark
													@click="view_list_dialog = true;"
												>
													View list
												</v-btn>
											</v-card-text>
										</v-card>

										<v-divider class="m"></v-divider>

										<v-list three-line subheader>
											<v-subheader class="font-weight-bold mb-0">Voting</v-subheader>
											<v-list-item 
												:disabled="currElection.type != 'Others'">
												<v-list-item-action>
													<v-checkbox 
														:disabled="currElection.type != 'Others'"
														v-model="form.allow_multiple_voting"
														class="mt-0"
														color="success">
													</v-checkbox>
													
												</v-list-item-action>
												<v-list-item-content>
													<v-list-item-title>Allow multiple voting</v-list-item-title>
													<v-list-item-subtitle>This is useful for peagentries, tv shows, and the likes</v-list-item-subtitle>
												</v-list-item-content>
											</v-list-item>
											
										</v-list>

										<v-divider></v-divider>
										<v-list three-line subheader>
											<v-subheader class="font-weight-bold mb-0">Result</v-subheader>
											<v-list-item>
												<v-list-item-action>
													<v-checkbox v-model="form.realtime_results"></v-checkbox>
												</v-list-item-action>
												<v-list-item-content>
													<v-list-item-title>Real-time results</v-list-item-title>
													<v-list-item-subtitle>Show results in real time as votes are casted, otherwise after the election.</v-list-item-subtitle>
												</v-list-item-content>
											</v-list-item>
											<v-list-item>
												<v-list-item-action>
													<v-checkbox v-model="form.results_visible_to_all"></v-checkbox>
												</v-list-item-action>
												<v-list-item-content>
													<v-list-item-title>Result visibility</v-list-item-title>
													<v-list-item-subtitle>Results are visible to all voters and contestants</v-list-item-subtitle>
												</v-list-item-content>
											</v-list-item>
										</v-list>
									
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" class="" 
											@click="updateVotingSettings" 
											:disabled="currElection.status == 'ended'"
											depressed>
											Save Changes
										</v-btn>
									</v-card-actions>
								</v-card>

							</v-col>
						</v-row>
					</v-container>
				</v-tab-item>

				<v-tab-item value="tab-5">
					<v-container>
						<v-row justify="center">
							<v-col cols="12" sm="8">
								<v-card class="mb-5 mr-1 ml-1 mt-3 pa-3" outlined max-width="800">
									<v-subheader class="title primary--text pl-0 mb-0">Schedule Election</v-subheader>
									
									<v-row>
										
										<v-col cols="6" sm="6">
											<v-subheader class="font-weight-bold mb-0 pl-0">Start date</v-subheader>

											<v-dialog ref="dialog" v-model="modal" :return-value.sync="form.date"
												persistent width="290px" >
												
												<template v-slot:activator="{on}">
													<v-text-field v-on="on" color="primary" v-model="form.date"
														label="Choose date" readonly outlined>
														<v-icon color="primary" slot="prepend-inner">mdi-calendar</v-icon>
													</v-text-field>
												</template>

												<v-date-picker v-model="form.date" 
													scrollable :allowed-dates="allowedDates" 
													header-color="primary">
													<v-spacer></v-spacer>
														<v-btn text   @click="modal = false">Cancel</v-btn>

														<v-btn text small outlined color="success" 
														@click="$refs.dialog.save(form.date)">OK
													</v-btn>
												</v-date-picker>
											</v-dialog>
										</v-col>

										<v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['mr-0','px-2'] : ['px-2']">
											<v-subheader class="mb-0 pl-0 font-weight-bold">Start time</v-subheader>

											<v-dialog ref="dialog2" v-model="modal2" :return-value.sync="form.time"
												persistent width="290px">

												<template v-slot:activator="{on}">
													<v-text-field  v-on="on" v-model="form.time"  
														label="Time" color="primary" readonly outlined>
														<v-icon color="primary" slot="prepend-inner">mdi-clock</v-icon>
													</v-text-field>
												</template>
												<v-time-picker v-if="modal2" format="ampm" 
													:allowed-hours="allowedHours" 
													v-model="form.time" header-color='primary'>
													<v-spacer></v-spacer>
														<v-btn text  @click="modal2 = false">Cancel</v-btn>
														<v-btn text color="success" 
															outlined 
															@click="$refs.dialog2.save(form.time)">
															OK</v-btn>
												</v-time-picker>
											</v-dialog>
										</v-col>

										<v-col cols="6" sm="6">
											<v-subheader class="font-weight-bold mb-0 pl-0">End date</v-subheader>

											<v-dialog ref="dialog6" v-model="modal3" :return-value.sync="form.enddate"
												persistent width="290px" >
												
												<template v-slot:activator="{on}">
													<v-text-field v-on="on" color="primary" v-model="form.enddate"
														label="Choose date" readonly outlined>
														<v-icon color="primary" slot="prepend-inner">mdi-calendar</v-icon>
													</v-text-field>
												</template>

												<v-date-picker v-model="form.enddate" 
													scrollable :allowed-dates="allowedDates2" 
													header-color="primary">
													<v-spacer></v-spacer>
														<v-btn text   @click="modal3 = false">Cancel</v-btn>

														<v-btn text small outlined color="success" 
														@click="$refs.dialog6.save(form.enddate)">OK
													</v-btn>
												</v-date-picker>
											</v-dialog>
										</v-col>

										<v-col cols="6" sm="6" :class="$vuetify.breakpoint.xsOnly ? ['mr-0','px-2'] : ['px-2']">
											<v-subheader class="mb-0 pl-0 font-weight-bold">End time</v-subheader>

											<v-dialog ref="dialog3" v-model="modal4" :return-value.sync="form.endtime"
												persistent width="290px">

												<template v-slot:activator="{on}">
													<v-text-field  v-on="on" v-model="form.endtime"  
														label="Time" color="primary" readonly outlined>
														<v-icon color="primary" slot="prepend-inner">mdi-clock</v-icon>
													</v-text-field>
												</template>
												<v-time-picker v-if="modal4" format="ampm" 
													:allowed-hours="allowedHours2"
													v-model="form.endtime" header-color='primary'>
													<v-spacer></v-spacer>
														<v-btn text  @click="modal4 = false">Cancel</v-btn>
														<v-btn text color="success" outlined @click="$refs.dialog3.save(form.endtime)">OK</v-btn>
												</v-time-picker>
											</v-dialog>
										</v-col>

										<v-col sm="12" style="padding-bottom:0px;">
											<v-subheader class="font-weight-bold pl-0 mb-0">Auto start </v-subheader>
											<v-switch 
												class="mt-0"
												v-model="form.timed" 
												label="Election begins and ends automatically at the selected date and time"
												color="success">
											</v-switch>
										</v-col>
									</v-row>

									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" depressed
											:disabled="currElection.status == 'ended'"
											@click="updateScheduleSettings">Save Changes
										</v-btn>
									</v-card-actions>
								</v-card>

							</v-col>
						</v-row>
						
					</v-container>
				</v-tab-item>

			</v-tabs-items>
			
		</div>
		</transition>
    
    <!-- suspend contestant dialog -->
    <v-dialog v-model="suspend_dialog" max-width="500px" persistent hide-overlay>
      <v-card min-height='200' flat>
        <v-card-title>
          <span class='headline text-capitalize'>Suspend {{culprit.electionId}}</span>
        </v-card-title>
        <v-card-text>
         Suspend this contestant to prevent him/her from contesting in this election. Suspended contestants
         won't appear on the election page and cannot be voted for during elections.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="suspend_dialog = false; loading = false">Cancel</v-btn>
          <v-btn color="orange" outlined @click="suspendContestant" :loading="loading">Suspend</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

		<v-dialog
			v-model="view_list_dialog"
			scrollable 
			:overlay="false"
			max-width="500px"
			transition="dialog-transition">
			<v-card min-height="400">
				<div class="v-card__title">
					Approved List
				</div>

				<v-card-text>
					<ol>
						<li v-for="(user,i) in approved_list" :key="i">
							{{user.name}}
						</li>
					</ol>
				</v-card-text>
			</v-card>
		</v-dialog>

  </div>
</template>
<script>
export default {
  data:()=>({
    showUi: false,
    flagged_user_dialog: false,
		flagged_user: {},
		tabs: 'tab-1',
		edit_dialog: false,
		view_list_dialog: false,
		role_input: '',
		role_input_desc: '',
		dialog: false,
		suspended: [],
		add_contestant_dialog: false,
		access_token: '',
		voter_access_token: '',
		file: null,
		form: {
      title: '',
      type: '',
      school: '',
			level: '',
			about: '',
      timed: true,
      faculty: '',
      department: '',
			date: '',
			enddate: '',
			endtime: '',
      time: '',
      electionDuration: 5,
      auto_enroll_admin: true,
			// public: true,
			access_token: '',
      roles: [],
      who_can_vote: 'anyone_with_access',
      voter_list: [],
      allow_multiple_voting: false,
      realtime_results: true,
      results_visible_to_all: true,
			verification_method: 'phone',
			terms: '',
			who_can_contest: 'everyone',
			unrestricted_contesting: false,
			manually_add_contestants: false,
			enable_forum: true,
			allow_manifestos: true,
		},
		approved_list: [],
		blob_url: '',
		logo: null,
		uploading_logo: false,
		saving_edit: false,
		modal: false,
    modal2: false,
		modal3: false,
		modal4: false,
    today: new Date().getTime(),
    contestants: [],
    currElection: {},
		regVoters: [],
		loading_more_voters: false,
		loading_more_activities: false,
		isLastVoter: false,
		isLastActivity: false,
		activities: [],
		regActivities: [],
		form2: {
			username: '',
			role: '',
		},
		chartData: {},
		chartOptions:{
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
                autoSkip: false,
            }
          }]
      }
    },
		tabledata: [],
		adminList: [],
    date_options: {
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    },
    search: '', // search contestants
    headers: [
      {
				text: 'Name',
				align: 'left',
				value: 'author.name'
      },
      {text:'Role', value: 'role.title'},
      {text:'Actions', value: 'actions'},
    ],
		loading: false,
		making_admin: false,
    suspend_dialog: false,
		culprit: {},
		roles: [],
		elecRef: '',
  }),
  props:['election', 'acts', 'voters', 'conts'],
	watch: {
		'curRoom': function(){
			this.setUp()
			this.prefillForm()
		},
		'election': function(){
			this.setUp()
			this.prefillForm()
		},
		'suspended.contestants': function(to, from){
			if(this.all_contestants){
        let suspended = to
        this.contestants = this.all_contestants.filter(item => !suspended.includes(item.uid))
      }
			this.setTableData(this.contestants)
		},
		'form.date': function(to,from){
			if(from){
				console.log({to,from})

				this.form.enddate = ''
				this.form.endtime = ''
			}
    },
    'form.enddate': function(to,from){
			if(from){

				this.form.endtime = ''
			}
    },
    'form.time': function(to,from){
			if(from){

				this.form.enddate = ''
				this.form.endtime = ''
			}
    }
	},
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
  computed:{
    ...mapGetters([
      'getUser',
    ]),
    ...mapState([
      'isSuperUser',
      'curRoom'
		]),
		title(){
			return `Election Manager | ${this.$appName}`
		},
		disabled_save(){
			return !this.form.title.trim() || !this.form.date.trim() || !this.form.time.trim()
		},
		no_of_voters(){
      let len = this.currElection.voters_count
        
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
			}
    },
    // purposely duplicated this instead of merging
    // it with above as a method bcs it should be reactive
    no_of_contestants(){
			let len = this.contestants.length
			
			switch (true){
				case len >= 1000000:
					return Math.round(len / 1000000) + 'M +'
				case len >= 1000:
					return Math.round(len / 1000) + 'K + '
				default:
					return len
			}
    },
		all_voters(){
			if(this.regVoters){

				return this.regVoters.map(voter => {
					let suspended = !!this.suspended.voters && this.suspended.voters.find(v => v == voter.uid)
					return {
						...voter,
						suspended
					}
				})
			}
		},
    electionStartDate(){
      let d = new Date(this.currElection.fullStartDate);
      return d.toLocaleString('en-US',{
        month: 'short',
        day: 'numeric',
        'year': 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    electionStatus(){
      // BEWARE THIS FUNCTION USES LOCAL TIME, WHICH MIGHT BE INACCURATE
      // Get the status of the current election
	
			if(this.currElection.timed){

				let start = new Date(this.currElection.fullStartDate).getTime();
				let end = new Date(this.currElection.endDate + ' ' + this.currElection.endTime).getTime();
				let one_hour = 1000 * 60 * 60
				let now = new Date().getTime()
	
				if(start > now){
					return ['Not Started', 'primary'] // not started
				}
				else if(end > now){
					return ['In Progress', 'success'] // in progress
				}
				else{
					return ['Ended','error'] // ended
				}
			}

			else {
				switch(this.currElection.status){
					case 'inprogress': return ['In Progress', 'success'];
					case 'ended': return ['Ended', 'error'];
					default: return ['Not Started', 'primary']
				}

			}
      
		},
		electionId(){
			return this.$route.params.electionId
		},
    
  },
  methods:{
		prefillForm(){
			// console.log(this.currElection)

			this.form = Object.assign({}, this.currElection)
			this.form.title = this.currElection.title
			this.form.date = this.currElection.startDate
			this.form.time = this.currElection.startTime
			this.form.enddate = this.currElection.endDate
			this.form.endtime = this.currElection.endTime
			this.form.electionDuration = this.currElection.duration

			this.form.roles = this.roles.map(role => {
				return {
					...role,
					disabled: true
				}
			})

			// bcs putting access_token in the form is not very reactive
			this.access_token = this.currElection.cont_access_token
			this.voter_access_token = this.currElection.voter_access_token
		},
		addrole(){
      if(this.role_input.length == 0){
        alert("Text should not be empty")
        return 
      }else{
        this.form.roles = [
					...this.form.roles,
					{
						title: this.role_input,
						value: this.role_input,
						description: this.role_input_desc,
						disabled: false,
					}
				]
				this.dialog = false;

        this.role_input = '' //empty it
        this.role_input_desc = ''
        }
      
		},
		async enrollFromPhoneList(phone_numbers){

			console.log(phone_numbers)
			let added = []
			let i = 1;
			
			let election = this.$gun.get('elections')
				.get(this.electionId)
			
			for (const num of phone_numbers) {
				
				let u = await this.$gun.get('phone_numbers').get(num).then()
				console.log({u})
				if(u){
					
					let user = this.$gun.get('users').get(u)
					// console.log({user})
	
					election.get('voters')
						.set(user)
							
					user.get('enrolled')
						.set(election)

					added.push(u)
				}

				if(i+1 == phone_numbers.length){
					this.$eventBus.$emit('Snackbar', {
						show: true,
						message: added.length + ' voters were enrolled',
						color: 'info'
					})

					this.loading = false
				}

				i++



			}
      
		},
		async saveApprovedList(phone_numbers){
			
			let election = this.$gun.get('elections')
				.get(this.electionId)
				election.get('approved_list').once(d => console.log({d}))

			let i = 0
			let added = []

			for (const num of phone_numbers) {
				
				let u = await this.$gun.get('phone_numbers').get(num).then()

				if(u){
					console.log(u)
					let user = this.$gun.get('users').get(u)
					
					election.get('approved_list')
						.set(user)
					
					added.push(u)
				}

				if(i+1 == phone_numbers.length){

					this.$eventBus.$emit('Snackbar', {
						show: true,
						message: added.length + ' voters were added',
						color: 'info'
					})

					this.loading = false
				}

				i++
			}
		},
		uploadVoterList(){
			
			this.loading = true

			let formData = new FormData()
			formData.append( 'file', this.file)
			api().post('/convertCSV', formData).then(r => {
				// console.log({r})
				let phone_numbers = r.data.map(item => item.phone)
				// this.enrollFromPhoneList(phone_numbers)
				this.saveApprovedList(phone_numbers)
			})
		},
		changeElectionStatus(new_status='inprogress'){
			if(!this.currElection.timed){

				this.$gun.get('elections')
					.get(this.electionId)
					.get('status').put(new_status)
					
				this.$eventBus.$emit('Snackbar', {
					show: true,
					message: 'Status Updated',
					color: 'success'
				})

			}
		},
		updateVotingSettings(){
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)

			elecRef.put({
				who_can_vote: this.form.who_can_vote,
				allow_multiple_voting: this.currElection.type != 'Others' ? false : this.form.allow_multiple_voting,
        realtime_results: this.form.realtime_results,
        results_visible_to_all: this.form.results_visible_to_all,
			})

			this.$eventBus.$emit('Snackbar', {
				show: 'true',
				message: 'Preferences updated',
				color: 'success'
			})
		},
		updateScheduleSettings(){
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)

			elecRef.put({
				startDate: this.form.date,
				startTime: this.form.time,
				endDate: this.form.enddate,
				endTime: this.form.endtime,
				duration: this.form.electionDuration,
				timed: this.form.timed
			})

			this.$eventBus.$emit('Snackbar', {
				show: 'true',
				message: 'Preferences updated',
				color: 'success'
			})

		},
		updateGeneralSettings(){
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)
			
			elecRef.put({
				title: this.$sanitize(this.form.title),
				about: this.$sanitize(this.form.about),
				terms: this.$sanitize(this.form.terms),
				enable_forum: this.form.enable_forum,
				allow_manifestos: this.form.allow_manifestos
			})

			this.$eventBus.$emit('Snackbar', {
				show: 'true',
				message: 'Preferences updated',
				color: 'success'
			})
		},
		updateRoles(){
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)

			let new_roles = this.form.roles.filter(r => r.disabled == false)

			new_roles.forEach(role => {

				let new_token = this.$uuidv4()

				elecRef.get('roles')
					.get(this.$uuidv4())
					.put({
						title: role.title,
						description: role.description,
						value: new_token,
						token: new_token
					})
			})

			let new_access_token = this.access_token

			elecRef.get('who_can_contest')
				.put(this.form.who_can_contest)

			if(this.form.who_can_contest == 'everyone_with_access'){
				
				elecRef.get('cont_access_token')
					.put(new_access_token)
			}

			this.$eventBus.$emit('Snackbar', {
				show: 'true',
				message: 'Preferences updated',
				color: 'success'
			})
		},
		async addContestant(){
			let has_contested = await this.hasContested(this.form2.username)
			let elecRef = this.$gun.get('elections')
				.get(this.electionId)

      console.log({has_contested})

      // check if user is in same sch, fac,dept; if election not started; if has enrolled
      let not_started = this.currElection.status == 'inRegistration'

      if(has_contested == false){
        
        // this.step = 2
        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Sorry, that account was not found',
          color: 'error'
        })
      }

      // check if user is already a contestant
      // else if(has_contested != undefined){
      //   this.$eventBus.$emit('Snackbar', {
      //     show: true,
      //     message:'Sorry, you are already a contestant in this election',
      //     color: 'error'
      //   })
      // }

      // check if contesting is still possible
      // else if(!not_started){
      //   this.$eventBus.$emit('Snackbar', {
      //     show: true,
      //     message:'Sorry, you cannot add contestants at this time',
      //     color: 'error'
      //   })
      // }


      // create a contestant
      else{
				this.loading = true
				elecRef.get('roles').map().once((m,k) => console.log(m,k))

        let data = {
          electionId: this.electionId,
          date_created: this.$Gun.state(),
          author: this.form2.username,
          suspended: false,
        }
      
        let contestant = elecRef
          .get('contestants')
          .get(this.form2.username)
          .put(data)

				let role_node = elecRef
					.get('roles')
					.get(this.form2.role.key)
				// console.log({role_node})

        contestant.get('role').put(role_node)

				elecRef.get('contestants_count')
					.put(this.currElection.contestants_count + 1)
					
        this.$gun
          .get(this.form2.username)
          .get('contests')
          .get(this.electionId)
          .put(contestant)

				this.loading = false
				this.add_contestant_dialog = false

        this.$eventBus.$emit('Snackbar', {
          show: true,
          message: 'Successfull',
          color: 'success'
        })


      }
		},
		hasContested(username){
			return new Promise((resolve,reject) => {

				let u;

				let userRef = this.$gun.get('users').get(username)
				this.$gun.get('users').get(username, async (ack)=> {
					if(ack.err || ack.put !== u){

						let contest = await userRef
							.get('contests')
							.get(this.electionId)
							.then()
						console.log(contest)
						resolve(contest)
					}
					else {

						console.log(ack.put)
						resolve(false)

					}
				})

			})

    },
		allowedDates(val){
			// only allow dates greater than or equal to today
			let today = this.today

			let toAllow = new Date(val).getTime()
	
			return today - toAllow - 24 * 60 * 60 * 1000 <= 0
    },
    allowedDates2(val){
			// only allow dates greater than or equal to today
			let startdate = new Date(this.form.date).getTime()
      
			let enddate = new Date(val).getTime()
	
			return startdate <= enddate
    },
    allowedHours(val){
      // only allow hours that are not yet past
			let curHour = new Date().getHours()
			let today = (new Date()).toISOString().substring(0,10)
      if(this.form.date == today){

				return curHour < val
			}
			else {
				return true
			}
    },
    allowedHours2(val){
    
      let starttime = this.form.time.split(':')[0]
      // console.log(starttime, val)

      if(this.form.date == this.form.enddate){
        return starttime < val
      }
      else {
        return true
      }
      
    },
    getRole(contestant){
      let ref = contestant.contestsRef
      .find(item=>item.electionRef == this.currElection.electionId)
      let role = this.currElection.roles.find(role=>role.value == ref.role).title
      return role
		},
		generateToken(){
			let text = "";
			let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for( let i=0; i < 16; i++ ){

				text += possible.charAt(Math.floor(Math.random() * possible.length));

				i == 15 ? this.access_token = text : ''
			}
			
		},
		copyAccessToken(access_token){
			this.$helpers.copyToClipboard(access_token)

			this.$eventBus.$emit('Snackbar', {
				show: true,
				message: 'Copied to clipboard',
				color: 'success'
			})
		},
		async uploadLogo(){
			
			this.uploading_logo = true
			
			return this.$helpers.uploadMedia({
				files: [this.logo],
				path: `logos/${this.currElection.electionId}`,
				file_name: `${this.currElection.title.split(' ').join('-')}-logo`
			}).then(res => {
				
				this.$gun.get('elections')
					.get(this.electionId)
					.get('logo')
					.put(res[0])

				this.uploading_logo = false
				
				this.$eventBus.$emit('Snackbar', {
					show: true,
					message: 'Logo uploaded',
					color: 'success'
				})
				return res
			})
			.catch(err => console.log(err))
			
		},
		async getContestants(){

			let elecRef = this.$gun.get('elections')
				.get(this.electionId)
				.get('contestants')
				.map().once(async c => {

					let author = await this.$gun.get('users')
						.get(c.author).then()

					let contestant = Object.assign({}, c)
					// console.log(contestant)
					contestant.author = author

					let role = this.roles.find(r => r.soul == c.role['#'])
					contestant.role = role
					// console.log(role.title, contestant.author.username)


					this.contestants.find(ct => ct.author.username == c.username) ? '' : 
					this.contestants.push(contestant)
					
				})
			
		},
    async setUp(){
      try {
				
        // Set current election
				this.$gun.get('elections')
        .get(this.electionId)
        .on( async election => {
          
          if(election){
						if(election.admin == this.getUser.username){
							this.currElection = election

							// get election roles
							this.$gun.get('elections').get(this.electionId)
								.get('roles').map().on((r,key) => {

									let rn = Object.assign({}, r)
									rn.key = key
									rn.soul = r['_']['#']
									// console.log(r, key)
									this.roles.find(rl => rl.value == rn.value) ? '' : 
									this.roles.push(rn)
								})

							setTimeout(() => {
								
								this.showUi = true
							}, 1000)
						}
						else {
							console.log('admin', election.admin)
							this.$router.push('/notFound')
						}
					}
					else {
						$router.push('/notFound')
					}

					this.prefillForm()
				})


				this.getContestants()
				.then(()=>{

				}).catch(err=>{
					// console.log(err)
				})

				// get approved list
				this.$gun.get('elections').get(this.electionId)
					.get('approved_list').map().on(l => {
						
						this.approved_list.find(i => i.username == l.username) ? '' :
						this.approved_list.push(l)
					})
				

      } catch (error) {
        // console.log(error)
      }
    },
    setTableData(contestants){
			this.tabledata = [] // to prevent multiple pushings
			
      contestants.forEach(cont=>{
        
        let myObj = {
          value: false,
          name: cont.name,
          email: cont.email,
          contId: cont.uid, // contestant id
          role: this.getRole(cont),
          department: cont.dept,
          faculty: cont.fac,
					suspended: !!this.suspended.contestants.find(item => item == cont.uid)
        }
        this.tabledata.push(myObj)
      })
		},
    isContestant(id){
      //console.log(id)
      return this.contestants.find(item => item.uid == id)
    },
    getColor(activity){
      switch (activity.type) {
        case 'voter_registered':
          return 'purple'
          break;
        case 'election_created':
          return 'primary'
          break
        case 'election_updated':
          return 'error'
          break
        case 'logo_updated':
          return 'primary'
          break
        case 'new_contestant':
          return 'teal'
          break
        case 'voter_registered':
          return 'orange'
          break
        case 'vote_casted':
          return 'success'
          break
        case 'contestant_suspended':
          return 'black'
          break
        case 'contestant_restored':
          return 'success'
          break
        default:
          return 'white'
          break;
      }
		},
		get_random_color() {
      var letters = 'A98DE'.split('');
      var color = '#';
      for (var i=0; i<3; i++ ) {
          color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
		async votersByDepartment(){
			// voter regisration by department
			
      this.chartData = {
        labels: Object.keys(this.currElection.votersByDept).map(key =>{
          return this.$helpers.truncateText(key)
        }),
        datasets: [{
          label:'Turnout by department',
          backgroundColor: Object.keys(this.currElection.votersByDept).map(item =>{
            return this.get_random_color()
          }),
          data: Object.values(this.currElection.votersByDept),
        }]
        
      }
    
    },
    async suspendContestant(){
      this.loading = true
     
			let elecRef = this.$gun.get('elections').get(this.currElection.electionId)

			elecRef.get('contestants').get(this.culprit.username)
			.get('suspended')
			.put(true)
			

			this.loading = false
			this.suspend_dialog = false
			
    },
    async restoreContestant(contestant){
      try {
        let index = this.tabledata.findIndex(item =>
          item.contId == contestant.contId
				)
				
        db.collection('suspended').doc(this.currElection.electionId)
				.update({
					contestants: firebase.firestore.FieldValue.arrayRemove(contestant.contId)
				})
				.then(() => {
					
				})
        
      } catch (error) {
        
        // console.log(error)
      }
      
    },
    
	},
	components:{
		LoadingBar,
		BarChart,
		Navigation
	},
  async mounted(){
    try {
      await this.setUp()
			let election = this.$gun.get('elections')
				.get(this.electionId)
				election.get('approved_list').once(d => console.log(d))
			
			// await this.recentRegActivities()
			// this.$gun.get('phone_numbers').map().once((p,k) => {
			// 	console.log(p,k)
			// })
      
    } catch (error) {
      // console.log(error)
		}
		
		this.$eventBus.$on('Selected_Files', data => {
			if(data.selected_files[0].size > 1000000){
				alert('Logo must be less than 1mb')
			}
			else {

				this.logo = data.selected_files[0],
				this.blob_url = data.imgSrc[0]
			}
		})
    
	},
	beforeDestroy(){
		// this.elecRef.off()
	}
}
import Navigation from '@/components/Navigation'
import api from '@/services/api2'
import {mapGetters, mapState} from 'vuex'
import LoadingBar from '@/spinners/LoadingBar'
import BarChart from '@/charts/barchart'
</script>
<style scoped>
  .linkify{
    cursor: pointer;
  }
  .v-card--offset {
    top: -70px;
    position: relative;
  }
</style>
