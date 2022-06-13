const multer=require('multer')

const storage=multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
       //console.log('line 6',file)
        cb(null,Date.now().toString()+file.originalname)
    }
})

const fileFilters=(req,file,cb,next)=>{

   // console.log('line 13',file)
    if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'){
      // console.log('line 15',file)
        cb (null,true)
        next
    }else{
        console.log('err')
        cb(null,false)
    }
    
}

const upload=multer({storage:storage,fileFilter:fileFilters})

module.exports={upload}