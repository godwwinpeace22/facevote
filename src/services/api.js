/* global $NProgress: false */
import axios from 'axios'
//import NProgress from 'nprogress'

const instance = axios.create({
    // baseURL: 'http://localhost:5000',// "https:/" + "/securepoll.herokuapp.com"
    baseURL: "https://securepoll.herokuapp.com"
    //baseURL: "https://secure-citadel-58191.herokuapp.com/"
    //timeout:3000
})

// Start nprogress before request is made
instance.interceptors.request.use(config => {
    $NProgress.start()
    return config
})

    // Stop nprogress before response is returned
instance.interceptors.response.use(response => {
    $NProgress.done()
    return response
})
export default ()=>{
    return instance

}