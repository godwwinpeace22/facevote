/* global db: false */ // tells eslint to treat 'db' as a globally defined variable, and that it should not be written to
/* global firebase: false */

import $store from '../store/store'
export default {

  /**
   * Get a color base on the letter of the alphabet supplied.
   * @param {String} char - the letter of the alphabet (e.g. a)
   * @return A string representing the color (e.g. "yellow")
   */
  colorMinder(char){
    let groups = ['a','b','c','d','m','n','o','p','q','r','s','t',
    'e','f','g','h','u','v','w','x','i','j','k','l','y','z'];
    let charIndex = groups.indexOf(char.toLowerCase()) + 1;

    return charIndex <= 4 ? 'teal' :
    charIndex <= 8 ? 'purple' : 
    charIndex <= 12 ? 'success' : 
    charIndex <= 18 ? 'secondary' : 
    charIndex <= 24 ? 'orange' : 
    'primary'
  },
  capitalize(text){
    return text ? text.toLowerCase().split(' ')
      .map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ') : text
  },
  truncateText(text, length=18){
    return typeof text === 'string' ?
      text.length > length ?
      text.substr(0, length) + '...' :
      text : text
  },
  trigFileSelector(){
    document.getElementById('file_img').click()
  },
  parseDate(timestamp, show_date=false){
    // show_date is used to control which type of date to return - full date or only time
    // USING CLIENT TIME. MAYBE USE SERVER TIME ?
    // handle firebase timestamp object
    timestamp = typeof timestamp == 'object' ? timestamp.toMillis() : timestamp

    let d = new Date(timestamp)
    let now = Date.now()
    let diff = now - timestamp

    let one_sec = 1000
    let one_min = one_sec * 60
    let one_hour = one_min * 60
    let one_day = one_hour * 24

    let options = {hour:'numeric', minute:'numeric' };
    let options2 = {
      day: 'numeric', 
      year: 'numeric', 
      month: 'short', 
      hour:'numeric', 
      minute:'numeric'
    }
  
    if(diff < 1000){
      return 'just now'
    }
    if(diff > one_sec && diff < one_min){
      return 'a few seconds ago'
    }
    if(diff > one_min && diff < one_hour){
      return Math.floor(diff / one_min) + ' minutes ago'
    }
    if(diff >= one_hour && diff < 2 * one_hour){
      return 'an hour ago'
    }
    if(diff > one_hour && diff < one_day){
      return Math.floor(diff/one_hour)  + ' hours ago'
    }
    if(diff > one_day && diff < one_day * 2){
      return 'yesterday, ' + d.toLocaleString("en-US",options)
    }
    if(diff >= one_day * 2 && diff < one_day * 3){
      return '2d ago at ' + d.toLocaleString("en-US", show_date ? options2 : options)
    }
    return d.toLocaleString("en-US", show_date ? options2 : options)
  },
  async uploadImage(files,preset){
    // console.log(files, preset)
    try {
      let clUrl = `https://api.cloudinary.com/v1_1/${preset.cloud_name}/upload`
      let formData = new FormData()
      let uploaded = []
      for(let file of files){
        formData.append('file', file)
        formData.append('upload_preset', preset.upload_preset)

        let response = await api().post( clUrl,
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        )

        uploaded.push(response.data.secure_url)
      }
      // eslint-disable-next-line
      // console.log(uploaded)
      return uploaded
    } catch (error) {
      // eslint-disable-next-line
      // console.log(error)
      alert('Image upload failed')
      throw new Error(error || error.response)
      
    }
  },
  setCurRoom(rooms){
    // SETS THE DEFAULT OR CURRENT ROOM/ELECTION
    return new Promise((resolve, reject)=>{
      try {
        let found = rooms.find(room => room.electionId == $store.state.curRoomId)
        if(found){
          // why? bcs malicious user can change room from localstorage (bcs its persisted).
          // So we need to check if that room is actually valid (if it exists or user has access to it)
          $store.dispatch('curRoom', found)
          resolve(true)
        }else{
          // either room not set or modified and not matching any valid room
          $store.dispatch('curRoom', rooms[0])
          resolve(true)
        }
      } catch (error) {
        reject(error)
      }
    })
    
    
  },

  userDetails(user){
    
    return new Promise((resolve,reject)=>{
      if($store.state.userInfo){
        // eslint-disable-next-line
        resolve($store.state.userInfo)
      }
      else {
        
        db.collection('moreUserInfo').doc(user.uid).onSnapshot(doc =>{
          // console.log(doc.data())
          $store.dispatch('setUserInfo',doc.data())
          resolve(doc.data())
        }, err => reject(err))
      }
    })
    
  },

  myEnrolled(user,refresh){
    return new Promise((resolve, reject)=>{
      
      if(refresh){
        this.userDetails(user).then( async userInfo=>{

          let arr = []
          if(userInfo.enrolled){
    
            userInfo.enrolled.forEach(async electionId =>{
              // eslint-disable-next-line
              let doc = await db.collection('elections').doc(electionId).get()
              doc.exists ? arr.push(doc.data()) : ''
            })
          }
          $store.dispatch('setMyEnrolled', arr.sort((a,b)=> b.dateCreated - a.dateCreated))

          // set current room if there is none (and if there are rooms to set)
          if(arr && arr.length > 0){
            this.setCurRoom(arr).then(() => resolve(true))
          }
          else{ resolve(false) }
          
        }).catch(err => {
          /* eslint-disable-next-line */
          // console.log(err); 
          reject(err)
        })
      }

      else if($store.state.curRoom){
        // if curRoom exists already, do nothing
        resolve(true)
      }
      else{
        
        this.userDetails(user).then( async userInfo=>{

          let arr = []
          if(userInfo.enrolled){

            for(const electionId of userInfo.enrolled){
              // eslint-disable-next-line
              let doc = await db.collection('elections').doc(electionId).get()
              // if the election actually exists
              doc.exists ? arr.push(doc.data()) : ''
            }
          }

          $store.dispatch('setMyEnrolled', arr.sort((a,b)=> b.dateCreated - a.dateCreated))

          // set current room if there is none (and if there are rooms to set)
          if(arr && arr.length > 0){
            this.setCurRoom(arr).then(() => resolve(true))
          }
          else{ resolve(false) }
          
        }).catch(err => {
          /* eslint-disable-next-line */
          // console.log(err); 
          reject(err)
        })
      }
      
      
    })
      
  },

  followUser(follower, followee){
    return new Promise(async (resolve, reject)=>{
      // helper function to follow a user
      // followee is the one to be followed by follower

      let docId = `${follower.uid}-${followee.uid}-fol`
      let followerRef = db.collection('ufollowers').doc(docId)
      let userRef = db.collection('moreUserInfo').doc(followee.uid)
      let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = follower
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

      let is_following = followerRef.get()
        .then(doc =>{
          return doc.exists
        }).catch(err => reject(err))

      if(await is_following){
        // unfollow

        let batch = db.batch();
        batch.delete(followerRef)
        
        batch.update(userRef, {
          followers: firebase.firestore.FieldValue.increment(-1)
        })

        batch.commit().then(()=> resolve({following: false}))
        .catch(err => reject(err))
      }

      else{

        let batch = db.batch();

        batch.set(followerRef, {
          onr: onr,
          follower: follower.uid, // add this for convenience
          followee: followee.uid,
          tstamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        batch.update(userRef, {
          followers: firebase.firestore.FieldValue.increment(1)
        })

        batch.commit().then(()=> resolve({following: true}))
        .catch(err => reject(err))
      }
    })
    
  },

  likePost(user, post){
    return new Promise(async (resolve, reject)=>{
      // helper function to follow a user
      // followee is the one to be followed by follower
      let docId = `${user.uid}-${post.docId}-post`
      let postRxnRef = db.collection('post_reactions').doc(docId)
      let postRef = db.collection('posts').doc(post.docId)

      let has_reacted = postRxnRef.get()
        .then(doc =>{
          return doc.exists
        }).catch(err => reject(err))

      if(await has_reacted){
        // un react
        let batch = db.batch();

        batch.delete(postRxnRef)
        batch.update(postRef, {
          reactions: firebase.firestore.FieldValue.increment(-1)
        })

        batch.commit().then(()=> resolve({reacted: false}))
        .catch(err => reject(err))
        
      }

      else{
       
        let batch = db.batch()

        batch.set(postRxnRef, {
          onr: user.uid,
          postRef: post.docId
        })

        batch.update(postRef, {
          reactions: firebase.firestore.FieldValue.increment(1)
        })

        batch.commit().then(()=> resolve({reacted: true}))
        .catch(err => reject(err))
      }
    })
    
  },

  profileViewsCounter(viewer, viewee){
    /* eslint-disable-next-line */
    // console.log({viewee,viewer})
    // update profile views count
    return new Promise(async (resolve, reject)=>{
      let docId = `${viewer.uid}-${viewee.uid}-pviews`
      /* eslint-disable-next-line */
      // console.log(docId)
      let vieweeRef = db.collection('moreUserInfo').doc(viewee.uid)
      let profileViewsRef = db.collection('profile_views').doc(docId)

      let has_viewed = profileViewsRef.get().then(doc=>{
        return doc.exists
      })

      if(await has_viewed){
        resolve({success: false})
      }
      else{
        let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = viewer
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

        // New batch operating
        let batch = db.batch()
        batch.set(profileViewsRef, {
          onr: onr,
          viewer: viewer.uid,
          viewee: viewee.uid,
          tstamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        batch.update(vieweeRef, {
          profile_views: firebase.firestore.FieldValue.increment(1)
        })
        batch.commit().then(()=>{
          resolve({success: true})
        })
        .catch(err => reject(err))
      }
    })
  },


  campaignViewsCounter(viewer, campaign){
    // update campaign views count
    return new Promise(async (resolve, reject)=>{
      let docId = `${viewer.uid}-${campaign.docId}-camp`
      let campaignRef = db.collection('campaigns').doc(campaign.docId)
      let campaignViewsRef = db.collection('profile_views').doc(docId)
      let {name, photoURL = false, email, sch=false, fac=false, dept=false, uid, is_student} = viewer
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

      let has_viewed = campaignViewsRef.get().then(doc=>{
        return doc.exists
      })

      if(await has_viewed){
        resolve({success: false})
      }
      else{

        // Create new write batch
        let batch = db.batch()

        batch.set(campaignViewsRef, {
          onr: onr,
          viewer: viewer.uid,
          campaignRef: campaign.docId,
          tstamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        batch.update(campaignRef, {
          views: firebase.firestore.FieldValue.increment(1)
        })
        
        batch.commit().then(()=> resolve({success: true}))
        .catch(err => reject(err))
      }
    })
  }

}

import api from '@/services/api'