const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name : {
        type : String , 
        maxlength : 50
    },
    email : {
        type : String ,
        trim : true ,
        unique : 1
    },
    password : {
        type : String ,
        minlength : 5 
    },
    lastname : {
        type : String , 
        maxlength : 50
    },
    role : {
        type : Number , 
        default : 0
    },
    image : String ,
    token : {
        type : String 
    },
    tokenExp : {
        type : Number
    }    
});

// 유저 모델에 유저정보를 저장하기전에 무엇을 한다음에 끝나면 저장 메소드를 타게된다.
userSchema.pre("save", function(next){
    var user = this;
    console.log("userSave pre : "+this);
    if(user.isModified("password")){
         // 비밀번호를 암호화 시킨다
         // 비크립트에서 솔트를 가져와서 saltrouds 가 꼭필요하다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            // next 하면 save로 가게된다.
            console.log("presave pasword: "+user.password);
            console.log("presave salt : "+salt);
            bcrypt.hash(user.password, salt, function(err, hash) {
            if(err)      return next(err);
            console.log("presave hash : "+ hash);
            user.password = hash
                
                next();
            });
        });   
    }else{
        //next 가 없으면 여기서 계속 머문다 무조건 next가 있어야함.
        next();
    }
   
});

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword 1234567 암호화된 비밀번호 fgqgqwgqg13gqgwgqwg
    console.log("plainPassword : "+plainPassword); 
    bcrypt.compare(plainPassword , this.password , function(err, isMatch){  
        console.log("err : "+ err + " isMatch : "+isMatch); 
        if(err)     return cb(err); 
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){

    var user = this;
    // jsonwebtoken 을 이용해서 token을 생성하기;
    var token = jwt.sign(user._id.toHexString(), "secretToken");

    /*
        user._id + 'secretToken' = token 
        -> token 이 나옴

        secretToken 을 넣으면 user_id 가 나옴
        'secretToken' -> user_id
    */
   console.log("token : "+token);
    user.token = token;
    user.save(function(err ,user){
        if(err)     return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // user._id + token 
    // 토큰을 decode한다.
    jwt.verify(token , "secretToken", function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token 과  DB에 보관된 토근이 일치하는지 확인

        user.findOne({"_id" : decoded , "token" : token}, function(err , user){
            if(err) return cb(err);
            cb(null, user);

        });
    });
}

const User = mongoose.model("User", userSchema)

module.exports = { User }

