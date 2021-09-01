const express = require('express')
const cors = require('cors')
const mySql = require('mysql')
const CryptoJS = require("crypto-js");


const app = express()
app.use(cors())
app.use(express.json())

const db = mySql.createConnection({
    user: "root", password: '', host: 'localhost', database: 'shubavelai'
})

app.post('/test', (req, res) => {
    res.send("working..")
})

function encrypt(txt) {
    return CryptoJS.AES.encrypt(txt, 'shubavelai_secret_key').toString();
}
function decrypt(txt) {
    return CryptoJS.AES.decrypt(txt, 'shubavelai_secret_key').toString(CryptoJS.enc.Utf8);
}

app.post('/add-users', (req, res) => {
    count = 0;
    array = new Array()
    db.query("SELECT * FROM users", (err, rows, fields) => {
        len = Object.keys(rows).length
        for ($i = 0; $i < len; $i++) {
            if ((decrypt(rows[$i].userMail) == req.body.mail) || (decrypt(rows[$i].userMobile) == req.body.mobile))
                count++
        }
        if (count == 0) {
            db.query("INSERT INTO users (`userType`,`userName`,`userMail`,`userMobile`,`userLocation`,`userState`,`userDistrict`,`userCity`,`userPincode`,`userPass`,`userStatus`,`createdOn`,`updatedOn`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.type,req.body.name, encrypt(req.body.mail), encrypt(req.body.mobile), req.body.location, req.body.state, req.body.district, req.body.city, req.body.pincode, encrypt(req.body.pass), 0, 'now', 'ow'], (err, result) => {
                if(err) res.send({"msg":false,"status":"Something went wrong!"})
                else res.send({"msg":true,"status":result.insertId})
            })
        } else
            res.send({ "msg": false, "status": "This E-Mail or Mobile Number already exists!" })
    })
})

app.post('/login', (req, res) => {
    db.query("SELECT * FROM users", (err, rows, fields) => {
        len = Object.keys(rows).length;rowData = new Array();msg = false;
        for ($i = 0; $i < len; $i++) {
            if (((decrypt(rows[$i].userMail) == req.body.username) && (decrypt(rows[$i].userPass) == req.body.userPass)) ||  ((decrypt(rows[$i].userMail) == req.body.mobile)  && (decrypt(rows[$i].userPass) == req.body.userPass))){
                rows[$i].mail = decrypt(rows[$i].userMail)
                rows[$i].mobile = decrypt(rows[$i].userMobile)
                rowData = rows[$i]
                msg = true
            }
        }
        res.send({msg: msg,data:rowData})
    })
})

app.listen(3001, () => {
    console.log("Server starts")
})