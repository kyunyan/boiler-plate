const express = require('express')
const app = express()
const port = 5000
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
const {auth} = require("./middleware/auth");
const {User} = require("./models/User");

// nodeMon이란 소스에 변경된 내역을 찾아서 서버 재시작

// bodyParser 가 클라이언트에서 오는정보를 서버에서 분석해서 가져온다
// application/x-www-form-ureledcoded 로 된것을 분석해서 가져올수 있게 해준다.
app.use(bodyParser.urlencoded({extended : true}));

// application/json 타입으로 된것을 분석해서 가져올수 있게 해준다.
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose")
mongoose.connect(config.mongoURI, {
    // 쓰면 애러가 안난다
    useNewUrlParser : true ,
    useUnifiedTopology : true , 
    useCreateIndex : true , 
    useFindAndModify : false

}).then(() => console.log("mongoDb Connetcted ...."))
  .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello World! ~ !!'));

app.get("/api/hello", (req, res) => {
  
  res.send("안녕하세요~ ");
})

app.post("/api/users/register" , (req, res) => { debugger;
  console.log("userInfo" + req.body);
  //  회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  // 유저스키마 모델이 값을 넣어준다
  const user = new User(req.body);

  // save 를 하면 user정보가 save를 통해 model 에 저장
   // 몽고디비에서 오는 메소드
  user.save((err, userInfo) => {
    if(err) return res.json({success : false ,err});
    return res.status(200).json({
      success : true
    })
  }); 
});

app.post("/api/users/login" , (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  console.log("loigin check : "+req.body);
  User.findOne({email : req.body.email}, (err, user) => {
    console.log("logincheck user:" + user);
    if(!user){
      return res.json({
          loginSuccess : false, 
          message : "제공된 이메일에 해당하는 유저가 없습니다. "
      });
    }

     // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err , isMatch) => {  
      console.log("isMathch : "+isMatch);  
      if(!isMatch)
          return res.json({loginSuccess : false , message : "비밀번호가 틀렸습니다."});
    
      // 비밀번호 까지 맞다면 토근을 생성하기 .   
      user.generateToken((err, user) => { 
          console.log("user : "+user);
          if(err) return res.status(400).send(err);

          // 토큰을 저장한다. 어디에 ? 쿠키 , 로컬스토리지 
          res.cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess : true, userId : user._id })

      })
     });
  })
})

// Router <- express

// middle 웨어는 겟으로 받고 실행되기 중간에 실행
app.get("/api/users/auth", auth , (req, res) => {
 // 여기까지 미들웨어를 통과해 왓다는 애기는 Authentication 이 true 라는 말.
 res.status(200).json({
   _id : req.user._id ,
   isAdmin : req.user.role === 0 ? false : true , 
   isAuth : true , 
   email : req.user.email , 
   name : req.user.name ,
   lastname : req.user.lastname ,
   role : req.user.role ,
   image : req.user.image

 })
})

app.get("/api/users/logout" , auth , (req, res) => {
   User.findOneAndUpdate({_id : req.user._id} , 
    {token : ""} 
    ,(err, user) => {
      if(err) return res.json({success : false , err});
      return res.status(200).send({
        success : true
      })
    })
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))