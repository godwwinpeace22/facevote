import {gun} from './gun'
import $store from '../store/store'
import $router from '../router'

const user = gun.user()

export default {

  user,
  gun,

  async signup(payload){
    try {
      

      let { name, username, password, 
        is_student, was_once_a_student, email, sch, dept, fac, photoURL, displayName } = payload
      // console.log(username, password)
      return user.create(username, password, async (ack) => {
        let this_user = gun.get('users').get(username).put({
          name,
          username,
          email,
          photoURL,
          is_student,
          was_once_a_student,
          sch,
          fac,
          dept,
          displayName
        })

        // gun.get('users').set(this_user)

        // login the user automatically
        await this.login(payload)

        return ack
      })
      
    } catch (error) {
      throw error
    }
  },

  login(payload){
    try {
      return new Promise((resolve, reject) => {

        let { username, password } = payload
        
  
        user.auth(username, password, function(at){
          
          if(at.err){
            reject(at.err)
          }
          else {
            // console.log(at)
            // user.recall({sessionStorage: true})
            
            gun.get('users').get(username).once((data, key)=>{
              
              console.log({data})
              
              $store.dispatch('setUser', data).then(() => {
                
                payload.returnTo ?
                $router.push(payload.returnTo) : 
                $router.push('/home')
              })

              resolve(data)
            })
          }
  
          
        })

      })
      // console.log(d)
    } catch (error) {
      throw error
    }
  }
}


// export {login, signup}