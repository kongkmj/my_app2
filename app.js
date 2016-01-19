// 모듈 추출
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var methodOverride = require('method-override');

// 서버생성
var app = express();

// DB 연결
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open",function () {
  console.log("DB connected!");
});
db.on("error",function (err) {
  console.log("DB ERROR :",err);
});

// model setting
var postSchema = mongoose.Schema({
  sort:{type:String,required:true},
  name:{type:String,required:true},
  Manufacture:{type:String,required:true},
  value:{type:String,required:true},
  number:{type:String,required:true},
  createdAt:{type:Date,default:Date.now}
});
var Post = mongoose.model('post',postSchema);

// view setting
app.set("view engine",'ejs');


// set middlewares
app.use(express.static(path.join(__dirname,'/public/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


//set routes
//@@@@@@@@@@@@@@@@@@@@@@@@@@@index1@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/category',function (req,res) {
  Post.findById(req.params.id,function (err,category) {
    if(err) return res.json({success:false,message:err});
    res.render("index1/category/index",{data:category});
  });
});//index
app.get('/category/R',function (req,res) {
  Post.findById(req.params.id,function (err,category) {
    if(err) return res.json({success:false,message:err});
    res.render("index1/category/show",{data:category});
  });
});//show
//@@@@@@@@@@@@@@@@@@@@@@@@@@@index1@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//@@@@@@@@@@@@@@@@@@@@@@@@@@@products (R)@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/posts/R',function (req,res) {
  Post.find({}).exec(function (err,posts) {
    if(err) return res.json({success:false,message:err});
    res.render("products/posts/index",{data:posts});
  });
}); //index
app.get('/posts/R/insert',function (req,res) {
  res.render("products/posts/insert");
}); //insert

app.post('/posts/R',function (req,res) {
  Post.create(req.body.post,function (err,post) {
    if(err) return res.json({success:false,message:err});
    res.redirect('/posts/R');
  });
}); //create
app.get('/posts/R/:id',function (req,res) {
  Post.findById(req.params.id,function (err,post) {
    if(err) return res.json({success:false,message:err});
    res.render("products/posts/show",{data:post});
  });
}); //show
app.get('/posts/R/:id/edit',function (req,res) {
  Post.findById(req.params.id,function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.render("products/posts/edit",{data:post});
  });
}); //edit
app.put('/posts/R/:id',function (req,res) {
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id,req.body.post,function (err,post) {
    if(err) return res.json({success:false,message:err});
    res.redirect('/post/'+req.param.id);
  });
});// update
app.delete('/posts/R/:id',function (req,res) {
  Post.findByIdAndRemove(req.params.id,function (err,post) {
    if(err) return res.json({success:false,message:err});
    res.redirect('/posts/R');
  });
});// destroy
//@@@@@@@@@@@@@@@@@@@@@@@@@@@products@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//start server
app.listen(4000,function () {
  console.log('Server on!');
});
