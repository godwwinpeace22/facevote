<template>
	<v-card :color="active.color" v-if="active.onr" flat
		style="height:400px;position:relative;" 
		class="white--text title text-xs-center">
		<v-toolbar card flat color="grey lighten-3">
			<v-list dense class="grey lighten-3">
				<v-list-tile avatar>
					<template v-if="$vuetify.breakpoint.xsOnly">

						<v-list-tile-action style="min-width: 20px;">
							
							<v-icon @click="$eventBus.$emit('HideCampaign')">chevron_left</v-icon>
						</v-list-tile-action>
						<v-divider vertical inset class="mr-2"></v-divider>
					</template>
					<v-list-tile-avatar :color="$helpers.colorMinder(active.onr.name.charAt(0))">
						<img :src="active.onr.photoURL" v-if="active.onr.photoURL">
						<span v-else>{{active.onr.name.charAt(0)}}</span>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title @click="$eventBus.$emit('ViewProfile', active.onr)" style="cursor: pointer;" class="text-capitalize font-weight-bold">{{active.onr.name}}</v-list-tile-title>
						<v-list-tile-sub-title>{{$helpers.parseDate(active.tstamp,true)}}</v-list-tile-sub-title>
					</v-list-tile-content>

					<v-list-tile-action >
						<v-btn icon small @click.native="playSlides">
							<v-icon v-if="play">pause</v-icon>
							<v-icon v-else>play_arrow</v-icon>
						</v-btn>
					</v-list-tile-action>
					<v-list-tile-action>
						<v-progress-circular color="secondary" :value="value"></v-progress-circular>
					</v-list-tile-action>
				</v-list-tile>
				
			</v-list>
		</v-toolbar>
		<v-card-text v-if="active.type == 'text'" class="title pa-2">
			{{active.body}}
		</v-card-text>
		<v-card-text v-if="active.type == 'photo'" class="pa-0">
			<v-img :src="active.imgSrc" width="100%" height="100%"/>
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
export default {
	data(){
		return {
			date_options:{
				weekday: 'short', 
				year: 'numeric', 
				month: 'short', 
				hour:'numeric', 
				minute:'numeric'
			},
			index: 0,
			active: {},
			interval: {},
			value: 0,
			play: true
		}
	},
	props:['selectedcampaign', 'campaigns'],
	methods:{
		extractUser(uid){
      let found = this.students.find(student => student.uid == uid)
      //console.log(found)
      return found ? found : {}
		},
		initializeCarousel(){
			this.index = this.selectedcampaign // don't mutate prop
			this.active = this.campaigns[this.selectedcampaign] // to deal with the latency of 2sec
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
				this.active = this.campaigns[this.index]
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
		previous(){
			if(this.index > 0){
				this.index -= 1
				this.value = 0
				this.active = this.campaigns[this.index]
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
				this.active = this.campaigns[this.index]
				this.play = true
				
				clearInterval(this.interval)
				this.interval = setInterval(()=>{
					this.player()
				}, 1000)
			}
		}
	},
	beforeDestroy () {
		// clearInterval(this.interval)
		clearInterval(this.interval)
	},
	mounted(){
		// console.log(this.index,this.selectedcampaign,this.active)
		
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
</style>
