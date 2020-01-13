import {gun} from './gun'
import $store from '../store/store'

const user = gun.user()

export default {

  user,
  gun,

  async signup(payload){
    try {
      

      let { name, username, password, 
        is_student=false, was_once_a_student=false, 
        email=false, phone=false, sch=false, 
        dept=false, 
        fac=false, photoURL=false, token=false} = payload

      return user.create(username, password, async (ack) => {
        gun.get('users').get(username).put({
          name,
          username,
          email,
          phone,
          photoURL,
          is_student,
          was_once_a_student,
          sch,
          fac,
          dept,
          token
        })

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

            let user = gun.get('users').get(username)
            user.put({
              name: payload.name,
              username: payload.username,
              photoURL: payload.photoURL,
              email: payload.email,
              is_online: true
            })

            user.once((data, key)=>{
              
              $store.dispatch('setUser', data)

              resolve(data)
            })
          }
  
          
        })

      })
      
    } catch (error) {
      throw error
    }
  },
  async aliasIsTaken (alias){
    // check that alias does not exist already

    let u = await gun.get('users').get(alias).then()

    return !!u

  },
  updateUser(payload){
    gun.get('users').get(payload.username)
      .put(payload)

    this.login(payload)
  }
}


// export {login, signup}