<template>
	<div>
		<!-- <v-snackbar	v-model="snackbar.show">
			{{snackbar.message}}
			<v-btn flat :color="snackbar.color" @click.native="snackbar.show = false">Close</v-btn>
		</v-snackbar> -->

		<v-card flat tile>
			<v-card-text>
				<!-- <v-radio-group v-model="manifesto_type" row class="mt-0">
					<v-radio class="mr-2"
						label="Text"
						color="teal"
						value="text"
					></v-radio>
					<v-radio class="mr-2"
						label="Photo"
						color="secondary"
						value="photo"
					></v-radio>
				</v-radio-group> -->
				<v-text-field	label="Manifesto title" class="mb-3" v-model="manifesto_title" color="secondary" outline>

				</v-text-field>

				<template v-if="manifesto_type == 'text'">
					<quill v-model="manifesto_text" :config="config" output="html"></quill>
					
        </template>
				<!-- <template v-if="manifesto_type == 'photo'">
					<v-card flat contenteditable="false" v-if="imgSrc" color="" class="mb-2 jusity-center fill-height" height="200">
						<v-img height="100%" width="80%" style="margin:auto;" :src="imgSrc"/>
					</v-card>
					<v-btn v-else color="grey mb-3" depressed block style="padding:10%;" @click="$helpers.trigFileSelector">
						<div style="margin-top:-25px;">
							<v-icon color="white" large>add</v-icon>
							<span class="d-block white--text">Add photo</span>
						</div>
					</v-btn>
				</template> -->

			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="grey" depressed dark @click="$helpers.trigFileSelector" v-if="imgSrc" :disabled="loading">
					Change photo</v-btn>
				<v-btn color="secondary" @click="submit" :disabled="disabled" :loading="loading">Submit</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>
<script>
export default {
	data(){
		return {
			loading: false,
			snackbar: {},
			color: 'red',
			config: { // config for rich text editor
				placeholder: 'Compose an epic...',
				modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],        // toggled buttons
					['blockquote'],
					[{ 'list': 'ordered'}, { 'list': 'bullet' }],
					[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

					[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

					[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
					[{ 'font': [] }],
					[{ 'align': [] }]
				]
			},
			},
			manifesto_type: 'text',
			manifesto_text: '',
			manifesto_title: '',
			img_caption: '',
			video_link: '',
			imgSrc: null,
			selected_file: null,
			group: '',
			cloudinary:{
				cloud_name:'unplugged',
				upload_preset:'pe4iolek'
			},
		}
	},
	props:['mycontests'],
	computed:{
		disabled(){
			let doc = document.getElementById('manifesto_text')
			let text = doc ? doc.innerText.trim() : null
			if(this.manifesto_type == 'text'){
				return !this.manifesto_text.trim() || !this.manifesto_title.trim()
			}
			// if(this.manifesto_type == 'photo'){
			// 	return !this.imgSrc || !this.manifesto_title.trim()
			// }
			// if(this.manifesto_type == 'video'){
			// 	return !this.video_link.trim() || !this.manifesto_title.trim()
			// }
		},
		...mapGetters([
      'isAuthenticated',
      'getUser',
      'getUserInfo',
      'getFeedFilter',
      'getMyEnrolled'
		]),
		...mapState([
			'curRoom',
			'isSuperUser'
		])
	},
	methods:{
  
		async submit(){
			this.loading = true
			console.log(this.manifesto_text)
			if(this.manifesto_type == 'photo'){
				let image = await this.$helpers.uploadImage(this.selected_file, this.cloudinary)
				this.createManifesto(image[0])
			}
			else{
				this.createManifesto()
			}
		},
		createManifesto(image){
			let docRef = db.collection('manifestos').doc(`${this.getUser.uid}-${this.curRoom.electionId}-man`)
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

			docRef.set({
				onr: onr,
				tstamp: firebase.firestore.FieldValue.serverTimestamp(),
				elecRef: this.curRoom.electionId,
				body: this.manifesto_text.trim(),
				title: this.manifesto_title
				
			}).then(done=>{
				this.loading = false
				this.$eventBus.$emit('CloseNewManifestoDialog')
				this.snackbar = {
					show: true,color:'dark',
					message: 'Campaign created successfully'
				}
			}).catch(err=>{
				this.loading = false
				this.snackbar = {
					show: true,color:'error',
					message: 'Something went wrong, try again'
				}
			})
		}
	},
	mounted(){
		this.$eventBus.$on('Selected_Files', data=>{
			this.selected_file = data.selected_files
			this.imgSrc = data.imgSrc[0]
		})
		console.log(this.manifesto_text)
	}
}
import api from '@/services/api'
import {mapGetters, mapState} from 'vuex'
import {firebase, db, database} from '@/plugins/firebase'
</script>
<style lang="scss">
	@import url(https://cdn.quilljs.com/1.2.6/quill.snow.css);
	#manifesto_text div{
		margin-top:5px;
	}
</style>
