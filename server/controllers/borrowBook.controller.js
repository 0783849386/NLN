const DB = require('../models/thuviensach.model');

module.exports.addPhieuMuon = (req, res) => {
    const { book: { idbook } } = req.body
    let loginname
    if (req.body.loginname) loginname = req.body.loginname
    else {
        loginname = req.loginname
    }

    if (!idbook || !loginname) return res.status(500).json({ success: false, message: 'Internal server error 1' })
    // kiem tra xem user đã có mượn sách trước đó chưa
    // all good

    try {
        const note = "Yêu cầu mượn sách đã được gửi đi"
        const value = 1;// trạng thái thành viên đang mượn sách
        DB.addPhieuMuon(req.conn, [idbook, loginname, note], (err) => {
            if (err) throw err
            DB.setState(req.conn, [value, loginname], (err) => {
                if (err) throw err
            })
            res.json({
                success: true,
                message: " Cho mượn sách thành công!"
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }

}

module.exports.getPhieuMuon = (req, res) => {
    const loginname = req.loginname
    const note = "Yêu cầu mượn sách đã được gửi đi"
    try {
        DB.getPhieuMuon(req.conn, [loginname], (err, data) => {
            if (err) throw err
            if (data.length == 0) return res.json({ success: false, message: "Không có phieu mượn" })
            res.json({ success: true, message: note, phieuMuon: data })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}
module.exports.getAllPhieuMuon = (req, res) => {

    try {
        DB.getAllPhieuMuon(req.conn, (err, data) => {
            if (err) throw err
            if (data.length == 0) return res.json({ success: false, message: "Không có phieu mượn" })
            res.json({ success: true, phieuMuon: data })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}
module.exports.getPhieuMuonName = (req, res) => {
    const loginname = req.params.loginname
    const note = "Yêu cầu mượn sách đã được gửi đi"
    try {
        DB.getPhieuMuon(req.conn, [loginname], (err, data) => {
            if (err) throw err
            if (data.length == 0) return res.json({ success: false, message: "Không có phieu mượn" })
            res.json({ success: true, message: note, phieuMuon: data })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports.acceptRequest = (req, res) => {
    const { loginname } = req.body
    let today = new Date();
    today = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    DB.getPhieuMuon(req.conn, [loginname], (err, data) => {
        if (err) throw err
        if (data.length != 0) {
            data.map((item => {

                DB.addMuonSach(req.conn, [loginname, item.idbook, today], (err) => {
                    if (err) throw err
                })
            }))
        }
    })
    //delete phieumuon
    const value = 0// trang thai ko muon sach
    try {
        DB.deletePhieuMuon(req.conn, [loginname], (err) => {
            if (err) throw err
            DB.setState(req.conn, [value, loginname], (err) => {
                if (err) throw err
            })
            res.json({ success: true, message: "Deleted successfully!" })
        })
    } catch (error) {
        console.log(error)
    }


}

module.exports.getMuonSach = (req, res) => {
    try {
        DB.getMuonSach(req.conn, (err, data) => {
            if (err) throw err

            res.json({ success: true, muonSach: data })
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.getDetailsMuonSach = (req, res) => {
    const { loginname } = req.params
    try {
        DB.getDetailsMuonSach(req.conn, [loginname], (err, data) => {
            if (err) throw err
            res.json({ success: true, details: data })
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports.giveBook = (req, res) => {
    let { idmuon, endGive } = req.body
    idmuon = parseInt(idmuon)
    const today = new Date();
    const ngaytra = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    try {
        DB.giveBook(req.conn, [ngaytra, idmuon], (err) => {
            if (err) throw err
            if (endGive) {

                const value = 0 // ket thuc muon sach khi nhan lai sach cuoi cung
                DB.getLoginnameByIdMuon(req.conn, [idmuon], (err, data) => {

                    if (err) throw err

                    DB.setState(req.conn, [value, data], (err) => {
                        if (err) throw err
                    })
                })

            }
            res.json({ success: true, message: " Received!" })
        })
    } catch (error) {
        console.log(error)
    }

}
module.exports.plusView =(req, res) => {
    let {idbook} = req.body
    idbook = parseInt(idbook)
    try {
        DB.getView(req.conn, [idbook], (err, data) => {
            if(err) throw err
            let value = data[0].views
            value = parseInt(value)
           console.log(value)
            value +=1
           value = String(value)
            DB.plusView(req.conn ,[value, idbook], (err)=> {
                if(err) throw err
                res.json({
                    success: true
                })
            })
        })
       
    } catch (error) {
        
    }
}
// delete PhieuMuon

module.exports.deletePhieuMuon = (req, res) => {
    const { loginname } = req.params
    const value = 0// trang thai ko muon sach
    try {
        DB.deletePhieuMuon(req.conn, [loginname], (err) => {
            if (err) throw err
            DB.setState(req.conn, [value, loginname], (err) => {
                if (err) throw err
                res.json({ success: true, message: "Deleted successfully!" })
            })
            
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports.loadUser = (req, res) => {
    const { loginname } = req.body
    try {
        DB.getInfoThanhVien(req.conn, [loginname], (err, data) => {
            if (err) throw err

            res.json({
                success: true,
                message: " select successfully",
                info: data
            })
        })
    } catch (error) {

    }

}