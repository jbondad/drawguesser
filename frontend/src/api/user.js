import axios from "axios";




export async function registerUser(user){
    let response = await axios.post('http://localhost:8888/user/register', user);
    let data = response.data;
    return data;
}