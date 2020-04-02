var path = require('path');

exports.fileFilter = function(req, file, cb){   
    var ext = path.extname(file.originalname);   
    if(ext !== '.pdf' && ext !== '.PDF'){
        console.log("bad extension: " + ext);
        req.fileValidationError = "Only PDF files allowed";
        return cb(null, false);
    }
    else{
        cb(null, true);
    }      
}

exports.dateToString = function(dateObject){
    var adjustedMonth = dateObject.getMonth() + 1;
    return dateObject.getFullYear() + "_" 
            + exports.addLeadingZero(adjustedMonth) + "_" 
            + exports.addLeadingZero(dateObject.getDate()) + "_" 
            + exports.addLeadingZero(dateObject.getHours()) + "_" 
            + exports.addLeadingZero(dateObject.getMinutes()) + "_" 
            + exports.addLeadingZero(dateObject.getSeconds()) + "_" 
            + dateObject.getMilliseconds();
}

exports.addLeadingZero = function(value){
    return ("0"+value).slice(-2);
}