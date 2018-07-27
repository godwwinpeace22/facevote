import axios from 'axios'
export default()=>{
    return axios.create({
        baseURL: 'http:/' + '/localhost:3000'//"https:/" + "/securepoll.herokuapp.com"
    })

}