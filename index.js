const express = require('express')
const app = express()
const port = 5000
const bodyParser = require("body-parser");

const config = require("./config/key");

const {User} = require("./models/User");

// bodyParser 가 클라이언트에서 오는정보를 서버에서 분석해서 가져온다
// application/x-www-form-ureledcoded 로 된것을 분석해서 가져올수 있게 해준다.
app.use(bodyParser.urlencoded({extended : true}));

// application/json 타입으로 된것을 분석해서 가져올수 있게 해준다.
app.use(bodyParser.json());

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

app.post("/register" , (req, res) => { debugger;
  //  회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  // save 를 하면 user정보가 save를 통해 model 에 저장
   // 몽고디비에서 오는 메소드
  user.save((err, doc) => {
    if(err) return res.json({success : false ,err});
    return res.status(200).json({
      success : true
    })
  }); 


});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))