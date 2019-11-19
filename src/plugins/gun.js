import Gun from 'gun/gun'
import 'gun/sea'
import 'gun/nts.js'
import 'gun/lib/then'
import 'gun/lib/time.js'
import 'gun/lib/not'
import 'gun/lib/unset'
import 'gun/lib/promise'
// import $router from '../router'

// const gun = Gun(['http://localhost:8080','http://localhost:8765/gun'])
const gun = Gun()

// console.log(gun.time.is(), Gun.text.random(5))
export {gun, Gun}