import $store from '../store/store'
import gun from '@/plugins/gun'
import api from '@/services/api'
import Nprogress from 'nprogress'
import ImageKit from 'imagekit-javascript'

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
    charIndex <= 18 ? 'primary' : 
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

  /**
   * Upload files to storage
   * @param options file upload options
   * @returns String fd
   */
  upload(options){
    return new Promise((resolve, reject ) => {
      
      try {
        
        let {files, path, file_name=false } = options
        
        Promise.all(
          
          Array.from(files).map((file, index) => uploadOne(file,index))

        ).then((urls) => {

          resolve(urls)
          
        }).catch((error) => {

          reject(error)
          
        });
        
        function uploadOne(file,index) {
          
          return storage.ref(`${path}/${file_name ? file_name : file.name}`).put(file)
          .then(async (snapshot) => {
            
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              
            $store.dispatch('uploadProgress', {
              progress: Math.round(progress * 100) / 100,
              no_of_files: files.length,
              no_uploaded: index + 1,
              no_remaining: files.length - index -1
            })
            return await snapshot.ref.getDownloadURL()

          }).catch((error) => {
            // console.log(error)
          });
        }

      } catch (error) {
        reject(error)
        // console.log(error)
      }
    })
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
      // console.log(error.response.data)
      // alert('Image upload failed')
      Nprogress.done()
      throw new Error(error || error.response.data.message)
      
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
      
      try {
        
        let followeeRef = gun.get(followee.username)
        let followerRef = gun.get(follower.username)
        let followings_count = followee.followings_count || 0
        let followers_count = follower.followers_count || 0
  
        
        
        let arr = []
        followeeRef.get('followers')
          .get(follower.username)
          .once((p,k) => {
            p ?
            arr.push(p) : ''
            
          })
        
        console.log(arr)
        let is_following = arr.find(u => u.username == follower.username)
        console.log({is_following})
  
        if(is_following){
          // unfollow
          let ref = followeeRef
            .get('followers')
            .unset(followerRef)
            
            
            followerRef.get('following')
            .unset(followeeRef)
            
            followerRef.get('followings_count')
              .put(followings_count ? followings_count - 1 : 0)
  
            followeeRef.get('followers_count')
              .put(followers_count ? followers_count - 1 : 0)

            resolve({following: false})
  
        }
  
        else{
  
          // follow a user
  
          followeeRef
            .get('followers')
            .set(followerRef) // so that unfollowing can work
            // .put(followerRef)
          
          followerRef
            .get('following')
            .set(followeeRef)
            
          followeeRef.get('followings_count')
            .put(followings_count + 1)
          
          followerRef.get('followers_count')
            .put(followers_count + 1)
          
            resolve({following: true})
        }
      } catch (error) {
        console.log(error)
        reject({success: false})
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
      // let vieweeRef = db.collection('moreUserInfo').doc(viewee.uid)
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
        // batch.update(vieweeRef, {
        //   profile_views: firebase.firestore.FieldValue.increment(1)
        // })
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
  },

  openProfile(event, profile){
    
    profile.x = event.x
    profile.y = event.y
    $store.dispatch('openProfile', profile)
  },
  async uploadMedia({files,path}){

    return new Promise((resolve, reject) => {

      console.log(files)
      try {
  
        var imagekit = new ImageKit({
          publicKey : "public_UFN7xUAq01gwavZjCcqsFPb/384=",
          urlEndpoint : "https://ik.imagekit.io/voteryte",
          authenticationEndpoint : "http://localhost:5000/api/sign",
      })
  
      let uploaded = []
  
      for(let i = 0; i < files.length; i++){
  
        imagekit.upload({
          file : files[i],
          fileName : files[i].name,
          // tags : ["tag1"]
        }, function(err, result) {

          if(err){
            console.log(err)
            reject(err)
          }

          else {
            
            console.log(arguments);
            let imgUrl =imagekit.url({
              src: result.url,
              transformation : [{ HEIGHT: 400, WIDTH: 700}]
            })
            
            uploaded.push(imgUrl)

            if(i == files.length -1){
              resolve(uploaded)
            }
          }
        })

        
      }
      
        
      } catch (error) {
        // eslint-disable-next-line
        console.log(error)
        reject(error)
        alert('Image upload failed')
        Nprogress.done()
        throw new Error(error)
        
      }
    })
  },

}
