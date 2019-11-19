<template>
	<v-card flat>

		<v-card-text class="title pa-0">
			
			<v-carousel hide-delimiters :continuous="true" progress :cycle="cycle" :interval="3000"
				progress-color="black">
				<v-carousel-item
					v-for="(active, i) in sortByUid"
					:key="i + 'i'"
				>
					<v-sheet
						:color="active.color"
						height="100%"
						tile
					>

						<v-card-actions>
							<v-list dense class="py-0">
								<v-list-item >
									
									<v-list-item-avatar :color="$helpers.colorMinder(active.author.name.charAt(0))">
										<img :src="active.author.photoURL" v-if="active.author.photoURL">
										<span v-else class="white--text">{{active.author.name.charAt(0)}}</span>
									</v-list-item-avatar>

									<v-list-item-content>
										<v-list-item-title 
											@click="$helpers.openProfile($event, active.author)" 
											style="cursor: pointer;" class="text-capitalize font-weight-bold">

											{{active.author.name}}
										</v-list-item-title>
										<v-list-item-subtitle>
											{{$helpers.parseDate(active.date_created,true)}}
										</v-list-item-subtitle>
									</v-list-item-content>

								</v-list-item>
								
							</v-list>
							
							<v-spacer></v-spacer>

							<v-progress-circular color="secondary" >
								<v-btn icon small @click.native="cycle = !cycle">
									<v-icon> {{cycle ? 'mdi-pause' : 'mdi-play'}}</v-icon>
								</v-btn>
							</v-progress-circular>

							<v-btn text icon @click.native="showViewers"
								v-if="active.author.username == getUser.username">
								<v-icon>mdi-menu</v-icon>
							</v-btn>
						</v-card-actions>

						<v-row
							class="fill-height"
							align="center"
							justify="center"
						>
							<div class="display-3">Slide {{ i + 1 }}</div>
						</v-row>
					</v-sheet>
				</v-carousel-item>
			</v-carousel>
		</v-card-text>

		<!-- viewers list -->
		<!-- <v-navigation-drawer v-if="active.author.username == getUser.username"
			temporary absolute clipped-right
			v-model="drawer"
			right width="200" hide-overlay>

			<v-toolbar dense color="">
				<v-toolbar-title class="subheading">Viewers</v-toolbar-title>
				<v-spacer></v-spacer>
				<span class="subheading">{{viewers[active.docId] ? viewers[active.docId].length.toLocaleString() : ''}}</span>
			</v-toolbar>

			<v-progress-circular 
				v-if="loading_viewers" color="grey"
				class="d-block mx-auto mt-3" 
				:value="16" indeterminate>
			</v-progress-circular>

			<v-list dense class="" v-if="!loading_viewers && viewers[active.docId]">

				<v-list-item v-for="viewer in viewers[active.docId]" 
					:key="viewer.author.username" @click="$eventBus.$emit('ViewProfile', viewer.author)">

					<v-list-item-avatar :color="$helpers.colorMinder(viewer.author.name.charAt(0))">
						<img v-if="viewer.author.photoURL" :src="viewer.author.photoURL">

						<span v-else class="white--text">{{viewer.author.name.charAt(0)}}</span>
					</v-list-item-avatar>

					<v-list-item-content>

						<v-list-item-title 
							class="text-capitalize">
							{{viewer.author.name}}
						</v-list-item-title>

					</v-list-item-content>

				</v-list-item>
			</v-list>

			<v-subheader 
				v-if="!loading_viewers && viewers[active.docId] && viewers[active.docId].length == 0">
				0 views
			</v-subheader>
		</v-navigation-drawer> -->

		<!-- <v-card-text v-if="active.type == 'photo'" class="pa-0" style="overflow: auto; min-height: 480px; margin: auto;">
			<v-hover>
				<v-container grid-list-xs slot-scope="{ hover }" class="pa-0">
					
					<v-img :src="active.imgSrc" contain height="100%" max-height="480">
						<v-row slot="placeholder" fill-height align-center justify-center ma-0>
							<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
						</v-row>
						<v-expand-transition v-if="active.img_caption">
							<div v-if="hover" class="d-flex transition-fast-in-fast-out v-card--reveal display-5 white--text"
								style="height: 100%;">
								{{active.img_caption}}
							</div>
						</v-expand-transition>
					</v-img>
				</v-container>
			</v-hover>
		</v-card-text> -->

		<!-- <div class="next_left" style="width:50px;position:absolute;top:50%;left: 0" v-if="index > 0">
			<v-icon large color="#fff" @click="previous">mdi-chevron-left</v-icon>
		</div>

		<div class="next_right" style="width:50px;position:absolute;top:50%;right:0" v-if="index < campaigns.length -1">
			<v-icon large color="#fff" @click="next">mdi-chevron-right</v-icon>
		</div> -->
	</v-card>
	
</template>
<script>
import { mapGetters, mapState } from 'vuex';
// import {firebase, db, database} from '@/plugins/firebase'
export default {
	data(){
		return {
			date_options: {
				weekday: 'short', 
				year: 'numeric', 
				month: 'short', 
				hour: 'numeric', 
				minute: 'numeric'
			},
			index: 0,
			active: {},
			interval: {},
			cycle: true,
			play: true,
			drawer: false,
			loading_viewers: false,
			offset: '',
			viewers: {},
		}
	},
	props: ['selectedcampaign', 'campaigns'],
	watch: {
		'active': function(){
			this.countCampaignViews()
		}
	},
	computed: {
		...mapGetters([
			'getUser',
		]),
		...mapState([
			'curRoom',
			'isSuperUser'
		]),
		value(){
			return 10
		},
		sortByUid(){
			
			let f = this.campaigns.map(camp => {
				camp.username = camp.author.username
				return camp
			})
			
			// sort by date_created, then sort by username
			return f.sort((a,b) => {
				if(a.date_created > b.date_created) return -1
				if(a.date_created < b.date_created) return 1
				if(a.username > b.username) return 1
				if(a.username < b.username) return -1
			}
				// (b.uid > a.uid) ? 1 : ((a.uid > b.uid) ? -1 : 0)
			)
		},
	},
	methods:{
		initializeCarousel(){
			// console.log(this.selectedcampaign)
			this.index = this.selectedcampaign // don't mutate prop
			this.active = this.sortByUid[this.selectedcampaign] // to deal with the latency of 2sec
			// console.log(this.active, this.sortByUid())
		},
		player(){
			if (this.value == 100) {
				if(this.index >= this.campaigns.length - 1){
					clearInterval(this.interval)
					this.index = 0; //this.active = this.campaigns[0]
					this.value = 0
					this.$eventBus.$emit('HideCampaign')
				}
				this.value = 0
				this.index += 1
				this.active = this.sortByUid[this.index]
			}else{
				this.value += 20
			}
		},
		playSlides(){
			
			if(this.play){
				clearInterval(this.interval)
				this.play = !this.play
			}
			else{
				this.interval = setInterval(()=>{
					this.player()
				}, 1000)
				this.play = !this.play
			}
		},
		pause(){
			clearInterval(this.interval)
			this.play = false
		},
		previous(){
			if(this.index > 0){
				this.index -= 1
				this.value = 0
				this.active = this.sortByUid[this.index]
				this.play = true
				clearInterval(this.interval)

				this.interval = setInterval(()=>{
					this.player()
				}, 1000)
			}
		},
		next(){
			if(this.index < this.campaigns.length - 1){
				this.index += 1
				this.value = 0
				this.active = this.sortByUid[this.index]
				this.play = true
				
				clearInterval(this.interval)
				this.interval = setInterval(()=>{
					this.player()
				}, 1000)
			}
		},
		showViewers(){
			this.pause()
			this.drawer = !this.drawer;

			if(!this.viewers[this.active.docId]){
				this.loading_viewers = true

				db.collection('campaign_views')
				.where('campaignRef', '==', this.active.docId)
				.orderBy('tstamp', 'desc').get().then(querySnapshot => {
					let viewers = []
					querySnapshot.forEach(doc => {
						viewers.push(doc.data())
					})
					this.viewers[this.active.docId] = viewers
					// console.log(this.viewers)
	
					this.offset = querySnapshot.docs[querySnapshot.docs.length - 1]
					this.loading_viewers = false
				})
			}
			else{
				this.loading_viewers = false
			}
		},
		countCampaignViews(){
			if(this.active.author.username != this.getUser.username){
				let docId = `${this.getUser.uid}-${this.active.docId}-camp`
				let viewerRef = db.collection('campaign_views').doc(docId)
				let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = this.getUserInfo
				let onr = {
					name,
					photoURL,
					email,
					sch,
					fac,
					dept,
					uid,
					is_student
				}

				let batch = db.batch();

				batch.set(viewerRef, {
					// onr: onr,
					viewee: this.active.author.username,
					campaignRef: this.active.docId,
					tstamp: firebase.firestore.FieldValue.serverTimestamp()
				})

				batch.commit().then(()=> {
					// console.log('campaign viewed')
				})
			}
		}
	},
	beforeDestroy () {
		// clearInterval(this.interval)
		clearInterval(this.interval)
	},
	mounted(){

		// this.initializeCarousel()
		// this.interval = setInterval(() => {
		// 	this.player()
			
		// }, 1000)
	}
}
</script>

<style scoped>
	.v-overlay--active:before {
		opacity: 0.86;
	}

	.v-card--reveal {
    align-items: center;
		padding: 15px;
		line-height: 2rem;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
    cursor:pointer;
		background: rgba(0,0,0,.5)
  }

	.img_caption::-webkit-scrollbar {
		width: 0 !important;
	}
</style>
