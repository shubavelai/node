// import Axios from 'axios'

const $url = 'http://localhost:3001/'

var CryptoJS = require("crypto-js");

function encrypt(txt) {
    return CryptoJS.AES.encrypt(txt, 'shubavelai_secret_key').toString();
}
function decrypt(txt) {
    return CryptoJS.AES.decrypt(txt, 'shubavelai_secret_key').toString(CryptoJS.enc.Utf8);
}

export function login(username, password) {
    const $options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, userPass: password })
    };

    return fetch($url + 'login', $options)
    .then(res => {return res.json()})
}

export function setCookie(data){
    localStorage.setItem('access-token',encrypt(data.toString()))
}

export function service(url,data){
    const $options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch($url+url, $options)
    .then(res => {return res.json()})
}