import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {         // file and cb (callback) are two arguments provided by multer
    cb(null, './public/uploads/')    // specifying the destination folder where the files will be stored      // first argument is error handling, null means no error
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())   // specifying the file name format        // file.originalname is the original name of the uploaded file
  }
})

const upload = multer({ storage: storage })

export { upload };