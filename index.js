const express = require('express')
const app = express()
const port = 5000

const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://geonwan:rjsdhks12@boilerplate-slc6j.mongodb.net/test?retryWrites=true&w=majority", {
    // 쓰면 애러가 안난다
    useNewUrlParser : true ,
    useUnifiedTopology : true , 
    useCreateIndex : true , 
    useFindAndModify : false

}).then(() => console.log("mongoDb Connetcted ...."))
  .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello World! ~ 안뇽!!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))