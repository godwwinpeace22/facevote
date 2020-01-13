<template>
  <div>
    <v-card  v-for="(post,i) in welcome_posts" :key="i + 'w_posts'"
      class="mb-3 pb-2 elevation-1">
      
      <v-list two-line dense>
        <v-list-item>
          <v-list-item-avatar :color="$helpers.colorMinder(post.author.name.charAt(0))">
            <img :src="post.author.photoURL" v-if="post.author.photoURL">
            <span class="white--text headline" v-else>{{post.author.name.charAt(0)}}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="primary--text text-capitalize font-weight-bold linkify" style="width:fit-content" 
              @click="''">
              {{post.author.name}}
            </v-list-item-title>
            <v-list-item-subtitle>Founder of Voteryte</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-card-text>
        <span style="white-space: pre-wrap;">{{post.body}}</span>
      </v-card-text>

      <v-divider class="mx-3"></v-divider>
      <v-card-actions>
        <div style="width:fit-content;" class="text-xs-center">
          
          <v-btn depressed icon class="ml-1" small>
            <v-icon color="primary" small>mdi-thumb-up</v-icon>
          </v-btn>
          <span class="">0 Likes</span>

          <v-btn icon dark class="ml-3" depressed small>
            <v-icon color="primary" small>mdi-comment</v-icon>
          </v-btn>
          <span class="linkify">0 Comments</span>

        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>

export default {
  data: () =>({

  }),
  props: [],
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    welcome_posts(){
      return [
        {
          author: {
            name: 'Godwin Gabriel',
            is_student: false,
            photoURL: 'https://res.cloudinary.com/unplugged/image/upload/v1556894107/contestr/profile_avatars/imgSrcsmhPFNdktRNXLSe858h2YrW5Mqt2.jpg',
          },
          body: `Hi ${this.getUser.name}. I want to personally welcome you onboard. You’re joining thousands of users who use Voteryte to select their next set of leaders. Thank you for chosing us.

You can create posts, campaigns, manifestos, or interact with other voters in the forum. 
We are here to help if you need any help. Feel free to chat with us.`
        }
      ]
    }
  }
}

import { mapGetters} from 'vuex';
</script>
