const DB = require('../models/thuviensach.model');
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')


module.exports.getUser = (req, res) => {
	try {
	
        DB.getQuanLi(req.conn, [req.loginname], (err, data) =>{
            if(err) throw err
            let user = data[0]
            if (user){
                res.json({ success: true, user : user.fullname, auth: true })  
            }else{
                DB.getThanhVien(req.conn, [req.loginname], (err, data) => {
                    if(err) throw err
                    user = data[0]
                    if (!user){
                        return res.status(400).json({ success: false, message: 'User not found' })
                        
                    }
                  
                    res.json({ success: true, user : user.fullname, auth: false })
                })
            } 

        })
		
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
 }
module.exports.postLogin = function(req, res) {
    const { loginname, pass } = req.body
    // Simple validation => exist
	if (!loginname || !pass)
    return res
        .status(400)
        .json({ success: false, message: 'Missing username and/or password' })
    try {
        // Check for existing user
        DB.getQuanLi(req.conn, [loginname], async function(err, data){
            if(err) throw err;
            let user = data[0]

            if (user) {
                const passwordValid = pass;//await argon2.verify(user.pass, pass)
                if (passwordValid != user.pass) {
                    return res
                        .status(400)
                        .json({ success: false, message: 'Incorrect password' })
                }
                //all good quanli
                const accessToken = jwt.sign(
                    { loginname: user.loginname },
                    process.env.ACCESS_TOKEN_SECRET
                )
                res.json({
                    success: true,
                    message: 'User logged in successfully',
                    accessToken
                })

            }
            else {
                DB.getThanhVien(req.conn, [loginname], function (err, data) {
                    if (err) throw err
                    user = data[0]
                    if (!user) {
                        return res
                            .status(400)
                            .json({ success: false, message: 'Incorrect username' })
                    }
                    const passwordValid = pass;//await argon2.verify(user.pass, pass)
                    if (passwordValid != user.pass) {
                        return res
                            .status(400)
                            .json({ success: false, message: 'Incorrect password' })
                    }
                    //all good thanh vien
                    const accessToken = jwt.sign(
                        { loginname: user.loginname },
                        process.env.ACCESS_TOKEN_SECRET
                    )
                    res.json({
                        success: true,
                        message: 'User logged in successfully',
                        accessToken
                    })
                })
            }
            
            
        })
        
       

        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
    
}
module.exports.postRegister = async function(req, res){ 
    const {loginname, pass, fullname, phone, email, address} = req.body
    if(!loginname || !pass || !fullname || !phone || !email || !address){
       // console.log(loginname, pass, fullname, phone, email, address)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
        
    // check loginame exist
    try {
        DB.getThanhVien(req.conn, [loginname], (err, data) => {
            if (err) throw err
            if (data.length > 0){// login exist
                return res.status(500).json({ success: false, message: 'Username already' })
            }else{
                     // all good
            try {
                const value = 0; // trạng thái mặt định của thành viên không mượn sách
                DB.registerUser(req.conn, [loginname, pass, fullname, phone, email, address, value], (err) => {
                    if (err) throw err
                    res.json({ success: true, message: 'Register user successfully' })
                })
            } catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error1'})
            }
            }
           
        })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' })
    }
   
}