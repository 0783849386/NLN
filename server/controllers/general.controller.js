const DB = require('../models/thuviensach.model');

module.exports.getUser = (req, res) => {
    const { loginname } = req.body

    if (!loginname) return res.json({
        success: false,
        message: "Server internal!"
    })
    // add good
    try {
        DB.getInfoThanhVien(req.conn, [loginname], (err, data) => {
            if (err) throw err
            if (data.length != 0) {
                res.json({
                    success: true,
                    info: data
                })
            } else {
                res.json({
                    success: false,
                    info: data
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.updateUser = (req, res) => {
    const { fullname, email, phone, address, loginname } = req.body
    try {
        DB.updateUser(req.conn, [fullname, email, phone, address, loginname], (err) => {
            if (err) throw err
            res.json({
                success: true,
                message: 'update user successfully'
            })
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: " internal server error"
        })
    }
}

// 
module.exports.loadAllHistory = (req, res) => {
    try {
        DB.loadAllHistory(req.conn, (err, data) => {
            if (err) throw err
            // render 100 record recently
            let arrayHistory = []
            let idx = 0
            for (var i = data.length - 1; i >= 0; i--) {
                arrayHistory[idx] = data[i]
                //set ngay muon
                let today = data[i].ngaymuon
                today = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                arrayHistory[idx].ngaymuon = today
                ///set ngay tra
                if (data[i].ngaytra) {
                    today = data[i].ngaytra
                    today = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                    arrayHistory[idx].ngaytra = today
                } else {
                    arrayHistory[idx].ngaytra = ''
                }

                idx++
                if (idx == 100) break
            }
            res.json({
                success: true,
                data: arrayHistory
            })
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.loadUserHistory = (req, res) => {
    const { loginname } = req.body
    console.log(loginname)
    try {
        DB.loadUserHistory(req.conn, [loginname], (err, data) => {
            if (err) throw err
            let arrayHistory = []
            let idx = 0
            for (var i = data.length - 1; i >= 0; i--) {
                arrayHistory[idx] = data[i]
                //set ngay muon
                let today = data[i].ngaymuon
                today = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                arrayHistory[idx].ngaymuon = today
                ///set ngay tra
                if (data[i].ngaytra) {
                    today = data[i].ngaytra
                    today = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                    arrayHistory[idx].ngaytra = today
                } else {
                    arrayHistory[idx].ngaytra = ''
                }

                idx++

            }
            res.json({
                success: true,
                data: arrayHistory
            })
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.loadBorrowingHistory = (req, res) => {
    try {
        DB.loadBorrowingHistory(req.conn, (err, data) => {
            if (err) throw err
            let arrayHistory = []
            let idx = 0
            for (var i = data.length - 1; i >= 0; i--) {
                arrayHistory[idx] = data[i]
                //set ngay muon
                let today = data[i].ngaymuon
                today = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                arrayHistory[idx].ngaymuon = today
                ///set ngay tra
                if (data[i].ngaytra) {
                    today = data[i].ngaytra
                    today = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                    arrayHistory[idx].ngaytra = today
                } else {
                    arrayHistory[idx].ngaytra = ''
                }

                idx++

            }
            res.json({
                success: true,
                data
            })
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports.loadLateHistory = (req, res) => {
    try {
        DB.loadBorrowingHistory(req.conn, (err, data) => {
            if (err) throw err
            let arrayHistory = []
            let idx = 0
            for (var i = data.length - 3; i >= 0; i--) {
                let timeNow = new Date()// ngay h hien tai
                //set ngay muon
                let ngayByDb = data[i].ngaymuon
               
                const soMiliGiay = Date.UTC(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate()) - Date.UTC(ngayByDb.getFullYear(), ngayByDb.getMonth(), ngayByDb.getDate())
                const songay = soMiliGiay / (100 * 60 * 60 * 24)
               
                if (songay > 30) {
                    arrayHistory[idx] = data[i]
                    ngayByDb = ngayByDb.getFullYear() + '/' + (ngayByDb.getMonth() + 1) + '/' + ngayByDb.getDate() + ' ' + ngayByDb.getHours() + ':' + ngayByDb.getMinutes() + ':' + ngayByDb.getSeconds();
                    arrayHistory[idx].ngaymuon = ngayByDb
                    ///set ngay tra
                    if (data[i].ngaytra) {
                        ngayByDb = data[i].ngaytra
                        ngayByDb = today.getFullYear() + '/' + (ngayByDb.getMonth() + 1) + '/' + ngayByDb.getDate() + ' ' + ngayByDb.getHours() + ':' + ngayByDb.getMinutes() + ':' + ngayByDb.getSeconds();
                        arrayHistory[idx].ngaytra = ngayByDb
                    } else {
                        arrayHistory[idx].ngaytra = ''
                    }
                }



                idx++

            }
            res.json({
                success: true,
                data: arrayHistory
            })
        })
    } catch (error) {
        console.log(error)
    }
}

/// load user info

module.exports.loadPersonal = (req, res) => {
    const loginname = req.loginname
    try {
        DB.getInfoThanhVien(req.conn, [loginname], (err, data) => {
            if(err) throw err
            if(data.length > 0){
                res.json({
                    success: true,
                    info: data[0]
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
    
}
module.exports.loadListBorrowBook = (req, res) => {
    const loginname = req.loginname

    try {
        DB.getDetailsMuonSach(req.conn, [loginname] , (err, data) => {
            if(err) throw err
          
            res.json({
                success: true,
                listBorrowBook: data
            })
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports.loadNewBook =(req, res) => {
    try {
        DB.getDanhMucSach(req.conn , (err, data) => {
            if(err) throw err
            let newBooks = []
            let idx = 0
            for(var i = data.length-1; i>=0 ; i--){
                newBooks[idx] = data[i]
                idx++
                if(idx === 5) break
            }
          
            res.json({
                success: true,
                newBooks
            })
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports.getTopView = (req, res) => {
    try {
        DB.getTopView(req.conn, (err, data) => {
            if(err) throw err
            let topViewArray = []
            for(var i = 0 ; i<5; i++){
                topViewArray[i] = data[i]
            }
            console.log(topViewArray)
            res.json({
                success: true,
                topBooks: topViewArray
            })
        })
    } catch (error) {
        console.log(error)
    }
}