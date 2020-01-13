import $store from '../store/store'
import {gun} from '@/plugins/gun'
import api from '@/services/api2'
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
  copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text); 

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {

      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
          return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      } catch (ex) {
          // console.warn("Copy to clipboard failed.", ex);
          return false;
      } finally {
          document.body.removeChild(textarea);
          return true
      }
    }
  },
  getRandomString(len=8){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < len; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },
  getRandomNumber(len=6){
    let num = "";
    let possible = "0123456789";

    for( let i=0; i < len; i++ )
      num += possible.charAt(Math.floor(Math.random() * possible.length));

    return num;
  },
  generateUUID() { // Public Domain/MIT -- StackOverflow
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
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

  sleep (limit=100) {
    return (new Promise((res, rej)=>{
      setTimeout(function(){
        res(limit)
      }, limit);
    }))
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
      throw new Error(error || error.response.data.message)
      
    }
  },
  async verifyTxn(data){

    if(!data) return;

    return new Promise((resolve,reject) => {

      api().post('/verifyTxn', {
        ref: data.ref,
        amount: data.amount
      })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        reject(err.response.data.message)
      })
  
    })


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

  followUser(follower, followee){
    return new Promise(async (resolve, reject)=>{
      // helper function to follow a user
      // followee is the one to be followed by follower
      
      try {
        
        let followeeRef = gun.get('users').get(followee.username)
        let followerRef = gun.get('users').get(follower.username)
        let followees_count = followee.followers_count || 0
        
        
        let is_following = await followeeRef.get('followers')
        .get(follower.username).then()
        console.log({is_following})
        
        // await this.sleep()
        if(is_following){
          // unfollow
          let ref = followeeRef
            .get('followers')
            .get(follower.username)
            .put(null)
  
            followeeRef.get('followers_count')
              .put(followees_count - 1)

            resolve({following: false})
  
        }
  
        else{
          
          // follow a user
  
          followeeRef
            .get('followers')
            .get(follower.username)
            .put(true)
            
          followeeRef.get('followers_count')
            .put(followees_count + 1)
          
          // followerRef.get('followers_count')
          //   .put(followers_count + 1)
          
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
  async uploadMedia({files, options={height:400,width:700}}){

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
              // transformation : [{ HEIGHT: options.height, WIDTH: options.width}]
            })

            console.log(imgUrl)
            
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
        throw new Error(error)
        
      }
    })
  },

}
