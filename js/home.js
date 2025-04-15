import { fetchUserInfo, getCookie } from "./login.js"
import { transactionTableByUserId } from "../request.js";


export async function homePage(){
    document.body.innerHTML = ''

    let profileDiv = document.createElement('div');
    profileDiv.id = 'profile';

    let token = getCookie('authToken');
    let id_user = getCookie('id');

    let user_info = await fetchUserInfo(token)

    let data_transaction = transactionTableByUserId(token, id_user);

    data_transaction.then(function(result){
        console.log(result)
    })
    
    profileDiv.textContent = `Welcome to the Home Page! ${user_info.login}`;
    
    document.body.appendChild(profileDiv);

}