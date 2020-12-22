const jimp = require('jimp');
const uploader = require('express-fileupload');
const uuid = require('uuid');

const acceptedTypes = ['png', 'jpeg', 'bmp' ,'jpg'];

module.exports = {

    uploadImage: async (req, res, next) =>{
        
        if(!req.files.img || Object.keys(req.files).length === 0){
            next();
            return;
        }
        const imageList = [];
        try{
            //Run a loop and save all images in case more than 1 image is sent 
            if(Array.isArray(req.files.img)){
                for(let file of req.files.img){    
                    const filepath = await formatAndSaveFile(file);
                    if(filepath){
                        imageList.push({url: filepath, def: false});
                    }
                }
            }else{
                const filepath = await formatAndSaveFile(req.files.img);
                if(filepath){
                    imageList.push({url: filepath, def: false});
                }
            }

            req.body.images = imageList;
            next();

        }catch(error){
                console.error(error.message);  
                res.status(500).json({ error: 'There was an error processing the image' });
                return;
        } 
    }
}

const formatAndSaveFile = async (file) => {

    const ext = file.mimetype?.split('/')[1];
    
    //Only the accepted image ext are processed and saved 
    if(isImageTypeAccepted(ext)){
        const filename = `${uuid.v4()}.${ext}`;
            
        const image = await jimp.read(file.data);
        await image.resize(800, jimp.AUTO); // resize the image
        await image.write(`./public/uploads/${filename}`); // save the image in the path

        return filename;
    }
}

const isImageTypeAccepted = (ext)=>{
    return acceptedTypes.includes(ext);
}