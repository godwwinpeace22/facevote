<template>
	<v-card :color="active.color" v-if="active.onr" flat
		style="position:relative; overflow-x: hidden;" 
		class="white--text title text-xs-center">

		<v-toolbar card flat color="grey lighten-3">
			<v-list dense class="grey lighten-3">
				<v-list-tile avatar>
					<template v-if="$vuetify.breakpoint.smAndDown">

						<v-list-tile-action style="min-width: 20px;">
							
							<v-icon @click="$eventBus.$emit('HideCampaign')">chevron_left</v-icon>
						</v-list-tile-action>
						<v-divider vertical inset class="mr-2"></v-divider>
					</template>
					<v-list-tile-avatar :color="$helpers.colorMinder(active.onr.name.charAt(0))">
						<img :src="active.onr.photoURL" v-if="active.onr.photoURL">
						<span v-else class="white--text">{{active.onr.name.charAt(0)}}</span>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title 
							@click="$eventBus.$emit('ViewProfile', active.onr)" 
							style="cursor: pointer;" class="text-capitalize font-weight-bold">

							{{active.onr.name}}
						</v-list-tile-title>
						<v-list-tile-sub-title>{{$helpers.parseDate(active.tstamp,true)}}</v-list-tile-sub-title>
					</v-list-tile-content>

					<v-list-tile-action>
						<v-progress-circular color="secondary" :value="value">
							<v-btn icon small @click.native="playSlides">
								<v-icon v-if="play">pause</v-icon>
								<v-icon v-else>play_arrow</v-icon>
							</v-btn>
						</v-progress-circular>
					</v-list-tile-action>

					<v-list-tile-action v-if="active.onr.uid == getUser.uid">
						<v-btn flat icon @click.native="showViewers">
							<v-icon>menu</v-icon>
						</v-btn>
					</v-list-tile-action>
				</v-list-tile>
				
			</v-list>
		</v-toolbar>


		<v-card-text v-if="active.type == 'text'" class="title pa-5" style="overflow: auto; min-height: 480px; margin: auto;">
			<div style="width: 80%; margin: auto; line-height: 2em;">
				{{active.body}}
			</div>
		</v-card-text>

		<!-- viewers list -->
		<v-navigation-drawer v-if="active.onr.uid == getUser.uid"
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

				<v-list-tile avatar v-for="viewer in viewers[active.docId]" 
					:key="viewer.onr.uid" @click="$eventBus.$emit('ViewProfile', viewer.onr)">

					<v-list-tile-avatar :color="$helpers.colorMinder(viewer.onr.name.charAt(0))">
						<img v-if="viewer.onr.photoURL" :src="viewer.onr.photoURL">

						<span v-else class="white--text">{{viewer.onr.name.charAt(0)}}</span>
					</v-list-tile-avatar>

					<v-list-tile-content>

						<v-list-tile-title 
							class="text-capitalize">
							{{viewer.onr.name}}
						</v-list-tile-title>

					</v-list-tile-content>

				</v-list-tile>
			</v-list>

			<v-subheader 
				v-if="!loading_viewers && viewers[active.docId] && viewers[active.docId].length == 0">
				0 views
			</v-subheader>
		</v-navigation-drawer>

		<v-card-text v-if="active.type == 'photo'" class="pa-0" style="overflow: auto; min-height: 480px; margin: auto;">
			<v-hover>
				<v-container grid-list-xs slot-scope="{ hover }" class="pa-0">
					
					<v-img :src="active.imgSrc" contain height="100%" max-height="480" :lazy-src="activeThumbnail">
						<v-layout slot="placeholder" fill-height align-center justify-center ma-0>
							<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
						</v-layout>
						<v-expand-transition v-if="active.img_caption">
							<div v-if="hover" class="d-flex transition-fast-in-fast-out v-card--reveal display-5 white--text"
								style="height: 100%;">
								{{active.img_caption}}
							</div>
						</v-expand-transition>
					</v-img>
				</v-container>
			</v-hover>
		</v-card-text>

		<div class="next_left" style="width:50px;position:absolute;top:50%;left: 0" v-if="index > 0">
			<v-icon large color="#fff" @click="previous">chevron_left</v-icon>
		</div>

		<div class="next_right" style="width:50px;position:absolute;top:50%;right:0" v-if="index < campaigns.length -1">
			<v-icon large color="#fff" @click="next">chevron_right</v-icon>
		</div>
	</v-card>
	
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import {firebase, db, database} from '@/plugins/firebase'
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
			value: 0,
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
			'getUserInfo'
		]),
		...mapState([
			'curRoom',
			'isSuperUser'
		]),
		activeThumbnail(){
			if(this.active.type == 'photo'){
				let parts = this.active.imgSrc.split('upload/')
				return `${parts[0]}upload/c_thumb,g_face:center,w_200,h_200,q_10/${parts[1]}`
			}
		},
		sortByUid(){
			
			let f = this.campaigns.map(camp => {
				camp.uid = camp.onr.uid
				return camp
			})
			
			// sort by tstamp, then sort by uid
			return f.sort((a,b) => {
				if(a.tstamp.toMillis() > b.tstamp.toMillis()) return -1
				if(a.tstamp.toMillis() < b.tstamp.toMillis()) return 1
				if(a.uid > b.uid) return 1
				if(a.uid < b.uid) return -1
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
			if(this.active.onr.uid != this.getUser.uid){
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
					onr: onr,
					viewee: this.active.onr.uid,
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

		this.initializeCarousel()
		this.interval = setInterval(() => {
			this.player()
			
		}, 1000)
	}
}
</script>

<style>
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
