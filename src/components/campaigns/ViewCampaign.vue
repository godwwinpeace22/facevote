<template>
	<v-card height="500" v-if="showUi" dark>
		<VueSlickCarousel 
			v-bind="settings" 
			ref="slick_carousel"
			@afterChange="onAfterChange">

			<v-sheet
				:color="campaign.color"
				v-for="(campaign,i) in campaigns" :key="i"
				height="500" >

				<v-card-actions>
					<v-list dense class="py-0" :color="campaign.color">
						<v-list-item >
							
							<v-list-item-avatar :color="$helpers.colorMinder(campaign.author.name.charAt(0))">
								<img :src="campaign.author.photoURL" v-if="campaign.author.photoURL">
								<span v-else class="white--text">{{campaign.author.name.charAt(0)}}</span>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title 
									class="text-capitalize font-weight-bold">

									{{campaign.author.name}}
								</v-list-item-title>
								<v-list-item-subtitle>
									{{$helpers.parseDate(campaign.date_created,true)}}
								</v-list-item-subtitle>
							</v-list-item-content>

						</v-list-item>
						
					</v-list>
					
					<v-spacer></v-spacer>

					<v-progress-circular color="primary">
						<v-btn icon small @click.native="playSlides">
							<v-icon> {{play ? 'mdi-pause' : 'mdi-play'}}</v-icon>
						</v-btn>
					</v-progress-circular>

					<v-btn text icon @click.native="showViewers"
						v-if="campaign.author && campaign.author.username == getUser.username">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</v-card-actions>
				
				<div style="height: calc(100% - 72px);">

					<v-row
						class="fill-height"
						align="center"
						justify="center"
					>
						<div >
							<div v-if="campaign.type == 'text'" class="display-1">
								{{ campaign.body}}
								
							</div>
							<div v-if="campaign.type == 'photo'">
								<v-img 
									:src="campaign.imgSrc" 
									width="300px" height="200px" 
									max-height="300"
									@error="onError"
									@load="onImgLoad">
								</v-img>
							</div>
						</div>
					</v-row>
				</div>
			</v-sheet>
		</VueSlickCarousel>

		<!-- viewers list -->
		<!-- <v-navigation-drawer v-if="campaign.author.username == getUser.username"
			temporary absolute clipped-right
			v-model="drawer"
			right width="200" hide-overlay>

			<v-toolbar dense color="">
				<v-toolbar-title class="subheading">Viewers</v-toolbar-title>
				<v-spacer></v-spacer>
				<span class="subheading">{{viewers[campaign.docId] ? viewers[campaign.docId].length.toLocaleString() : ''}}</span>
			</v-toolbar>

			<v-progress-circular 
				v-if="loading_viewers" color="grey"
				class="d-block mx-auto mt-3" 
				:value="16" indeterminate>
			</v-progress-circular>

			<v-list dense class="" v-if="!loading_viewers && viewers[campaign.docId]">

				<v-list-item v-for="viewer in viewers[campaign.docId]" 
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
				v-if="!loading_viewers && viewers[campaign.docId] && viewers[campaign.docId].length == 0">
				0 views
			</v-subheader>
		</v-navigation-drawer> -->

	</v-card>
	
</template>
<script>
import { mapGetters, mapState } from 'vuex';
export default {
	data(){
		return {
			showUi: false,
			timeout: 3000,
			current_slide_index: null,
			play: true,
			drawer: false,
			loading_viewers: false,
			viewers: {},
		}
	},
	// props: ['campaigns'],
	props: {
		selectedcampaign: {
			default: 0
		},
		campaigns: {
			require: true,
		},
		start_slide: {
			default: 0,
			type: Number
		}
	},
	watch: {
		'campaigns': {
			immediate: true,
			handler: function(to,from){
				// console.log(to)
				if(this.campaigns.length > 0){
					
					this.showUi = true;
				}
			},
		},
		'start_slide': function(to, from){
			this.$refs.slick_carousel.goTo(to)
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
		settings() {
			return {
				arrows: true,
				dots: true,
				fade: true,
				autoplay: true,
				autoplaySpeed: this.timeout,
				infinite: false,
				start_slide: this.start_slide
			}
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
		playSlides(){
			
			if(this.play){
				this.$refs.slick_carousel.pause()
				this.play = !this.play
			}
			else{
				if(this.campaigns.length <= this.current_slide_index + 1){

					this.$refs.slick_carousel.play()
					this.play = !this.play
				}
			}
		},
		onError(e){
			console.log('onError: ', e)
			this.$refs.slick_carousel.pause()
		},
		onImgLoad(e){
			console.log('onimageload: ', e)
		},
		showViewers(){
			this.pause()
			this.drawer = !this.drawer;

			if(!this.viewers[this.active.docId]){
				// this.loading_viewers = true
				
			}
			else{
				this.loading_viewers = false
			}
		},
		onAfterChange(e){

			console.log(e)
			this.current_slide_index = e
			let current_campaign = this.campaigns[e]
			// pause slide if type is not 'text'
			// and resume after media loads (photo) or finish playing (video)
			if(current_campaign.type != 'text'){
				this.$refs.slick_carousel.pause()
			}
		}
	},
	mounted(){

		// this.campaigns = [
    //     {
    //       author: {
    //         name: 'Author One',
    //         username: 'author_one',
    //         photoURL: false,
		// 			},
		// 			username: 'author_one',
    //       docId: 'docId1',
    //       body: 'This is body1',
    //       type: 'text',
    //       color: 'primary',
    //       date_created: Date.now(),
    //     },
    //     {
    //       author: {
    //         name: 'Author Two',
    //         username: 'author_two',
    //         photoURL: false,
		// 			},
		// 			username: 'author_two',
    //       docId: 'docId2',
    //       imgSrc: 'https://lh3.googleusercontent.com/4LjAYgyaYswOY24hkwwX1_3lj_OePXW5pY7mUnwfUY4SgRKX-bqhkpDmU6OoRoLog-oDcKRL=w440-h280-e365',
    //       img_caption: 'caption 2',
    //       type: 'photo',
    //       color: 'success',
    //       date_created: Date.now(),
		// 		},
		// ]

		if(this.campaigns.length > 0){
			
			this.showUi = true;
		}
		
	},
	components: {
		VueSlickCarousel
	},
}

import {groupBy} from 'lodash'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
</script>

<style scoped>

	.slick__card--height {
		height: 500px;
		/* background-color: aqua; */
	}

	.v-overlay--active:before {
		opacity: 0.86;
	}


	.img_caption::-webkit-scrollbar {
		width: 0 !important;
	}
	/* .next {
		position: absolute;
		right: -20%;
		top: 54%;
	}
	.prev {
		position: absolute;
		left: -20%;
		top: 54%;
	} */

	/* animations */

.fadeInUp {
  animation: fadeInUp .5s ease-in both;
}
.fadeOutDown {
  animation: fadeOutDown .5s ease-in both;
}
.fadeInDown {
  animation: fadeInDown .5s ease-in both;
}
@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translate3d(0, -3%, 0);
	}
	to {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
}
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translate3d(0, 3%, 0);
	}
	to {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
}
@keyframes fadeOutDown {
	from {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
	to {
		opacity: 0;
		transform: translate3d(0, 3%, 0);
	}
}
</style>
