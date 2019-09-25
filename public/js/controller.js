
import { loginAuth } from '../../auth/login.js';

async function login()
{
    var email = document.getElementById('email').nodeValue(),
     password = document.getElementById('password').nodeValue(),
     response = await loginAuth.authenticate(email, password);
     console.log(response);
}

document.getElementById('btnsumbit').addEventListener("click", login());