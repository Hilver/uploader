const express = require('express')
const multer = require('multer')
const fs = require('fs')
 
const app = express()

const happyArray = ['( ͡° ͜ʖ ͡°)ﾉ⌐■-■-', '( ͡° ͜ʖ ͡°)', '(ʘ‿ʘ)', '(⌐ ͡■ ͜ʖ ͡■)', 'ʕ•ᴥ•ʔ'];


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/'
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
      cb(null, dir)           
    },
    filename: function (req, file, cb) {      
      cb(null, file.originalname)      
    }
  })

  const secretStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'secret/'
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
      cb(null, dir)
    },
    filename: function (req, file, cb) {
      let random = Math.floor(Math.random() * happyArray.length);
      cb(null, happyArray[random] + '-' + file.originalname)      
    }
  })
   
 const upload = multer({ storage: storage })
 const secretUpload = multer({ 
     storage: secretStorage,
     fileFilter: function(req, file, cb) {
     checkFileType(file, cb);
     }
    })

    function checkFileType(file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;

        const extname = filetypes.test(file.originalname.toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if(mimetype && extname) {
            return cb(null, true)
        } else {
            cb('IT SHOULD BE PIC (AND NUDES ONLY! ;) )');            
        }
    }

app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('form'))
app.get('/secretupload', (req, res) => res.render('secret-form'))

 
app.post('/', upload.single('uploadFile'), function (req, res, next) {
  console.log(req.body, req.file)
  res.send('uploaded')
})

app.post('/secretupload', secretUpload.single('uploadFile'), function (req, res, next) {
    console.log(req.body, req.file)
    res.send('COOL')
  })



app.listen(8000, () => console.log('serwer dziala na porcie 8000...'))