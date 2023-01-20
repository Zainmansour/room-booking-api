const User = require('./usersSchema');
const jwt = require('jsonwebtoken');

function getToken(req) {
    let cookie = req.headers.cookie;
    if (!cookie) return undefined;
    let data = cookie.split('=')
    return data[1];
}

module.exports.login = async (req, res) => {
    if (getToken != undefined) {
        res.status(300).json({
            status: 'ok',
            msg: 'you already logged in'
        })
    }
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        res.status(404).json({
            status: 'fail',
            msg: 'incorrect email'
        })
    }
    else if (user.password == password) {
        // console.log(user._id.toString());
        let token = jwt.sign({ data: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        res.cookie('token', token, {
            expires: new Date(Date.now() + (10 * 24 * 60 * 60 * 1000)),
            httpOnly: true
        })
        res.status(200).json({
            status: 'success',
            msg: 'logged in'
        })
    }
    else {
        res.status(300).json({
            status: 'fail',
            msg: 'incorrect password'
        })
    }
}

module.exports.createUser = async (req, res) => {
    let userInfo = req.body;
    let check = await User.findOne({ email: userInfo.email })
    if (check) {
        res.status(400).json({
            status: 'fail',
            msg: 'this email is already used'
        })
    }
    else {
        let user = new User(userInfo)
        user.save().then(ss => {
            res.status(202).json({
                status: 'ok',
                userInfo,
            })
        })
    }
}



module.exports.checkUserToken = (req, res, next) => {
    let token = getToken(req);
    if (!token) {
        return res.status(403).json({
            status: 'fail',
            msg: 'you aren\'t logged in '
        })
    }
    if (jwt.verify(token, process.env.JWT_SECRET)) {
        next();
    }
    else {
        return res.status(400).json({
            status: 'fail',
            msg: 'please login again'
        })
    }
}

module.exports.protect = (req, res, next) => {
    if (req.body.role) req.body.role = undefined
    next();
}

module.exports.checkUserPermission = async (req, res, next) => {
    let token = getToken(req);
    if (!token) {
        return res.status(403).json({
            status: 'fail',
            msg: 'you aren\'t logged in '
        })
    }
    let id = jwt.verify(token, process.env.JWT_SECRET)
    if (id) {
        let user = await User.findOne({ _id: id.data })
        if (user.role === 'admin') {
            console.log('Welcom admin zain :) ')
            next();
        }
        else {
            return res.status(403).json({
                status: 'fail',
                msg: 'you aren\'t allowed to reach this page'
            })
        }

    }
    else {
        return res.status(400).json({
            status: 'fail',
            msg: 'please login again'
        })
    }
}

module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        status: 'ok',
        msg: 'logged out',
    })
}
