
const {User} = require("../models/User");

let auth = (req, res , next) => {
    // 인증 처리를 하는 곳

    // 클라이언트 쿠키에서 토근을 가져온다.
    let token = req.cookies.x_auth;

    console.log("auth token : "+ token);
    // 토큰을 복호화 한후 유저를 찾는다.
    User.fnidByToken(token, (err, user) => {
        if(err) throw err;
        if(!user)   return res.json({isAuth : false , error : true})

        req.token = token;
        req.user = user;
        // next 가 없으면 middle ware에 같힌다.
        next();
    });
    // 유저가 있으면 인증 okay

    // 우저가 없으면 인증 No !
}

module.exports  = {auth};