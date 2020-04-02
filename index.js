var express = require('express');
var multer = require('multer');
var path = require('path');
var util = require('./utility.js');

var app = express();
var http = require('http').createServer(app);
app.set('view engine', 'pug'); //don't these have to come before doing res.render(form)...?
app.set('views', './views');

//change upload path here
var uploadDirectory = __dirname + '/uploads'; 

//global variables for tuning/adjustment
var lastUploadedFile = ""; //stores the last uploaded file to preview
var pdfWindowWidth = 500; //in pixels
var pdfWindowHeight = 750; //in pixels

var storage = multer.diskStorage({ //store to disk
    destination: function(req, file, cb){
        cb(null, uploadDirectory); //will upload to files here
    },
    filename: function(req, file, cb){ //file is the uploaded file
        var fileName = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
        var extension = path.extname(file.originalname);
        const uploadTime = new Date(Date.now());
        console.log("Upload time: " + uploadTime.toString());
        var newFileName = fileName + '-' + util.dateToString(uploadTime) + extension;
        lastUploadedFile = newFileName;
        //second argument of this is the file name
        cb(null, newFileName);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: util.fileFilter
});

app.use('/pdfpreview', express.static('uploads')); // this line should work but it doesn't...
// app.use(express.static('.')); //allow to extract files from home directory


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
  
// It's very crucial that the file name matches the name attribute in your html
app.post('/', upload.single('file-to-upload'), (req, res) => {
    if(req.fileValidationError){
        console.log("User uploaded bad file format");
        res.redirect('/error');
    }
    else if(req.file == undefined){
        res.redirect('/error');
    }
    else{
        console.log(req.file.originalname);
        res.redirect('/success');
    }
});

app.get('/error', function(req, res){
    res.sendFile(__dirname + '/views/error.html');
});

app.get('/success', function(req, res){
    res.sendFile(__dirname + '/views/success.html');
})

app.get('/pdfpreview', function(req, res){
    if(lastUploadedFile === ""){
        res.redirect('/error');
    }
    else{
        // next 2 lines not needed but keeping for future reference
        // let posixDirname = __dirname.replace(/\\/g,"/");
        // let prevFileName = path.posix.join(lastUploadedFile);

        console.log("Requested pdf preview of: " +lastUploadedFile);
        res.render('pdfpreview', {
            pdfFileName: lastUploadedFile,
            widthIn: pdfWindowWidth,
            heightIn: pdfWindowHeight
        });
    }  
});

app.get('*', function(req, res){
    res.send("Error: Page not found");
})

http.listen(port, function(){
    console.log(`STATUS: Listening on port ${port}`);
});