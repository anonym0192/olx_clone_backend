const jimp = require('jimp');
const uploader = require('express-fileupload');
const uuid = require('uuid');

const acceptedTypes = ['png', 'jpeg', 'bmp' ,'jpg'];
const DEFAULT_IMAGE = 'default-image.png';

module.exports = {

    uploadImage: async (req, res, next) =>{
        
        if(!req.files?.img || Object.keys(req.files).length === 0){
            next();
            return;
        }
        const imageList = [];
        try{
            //Run a loop and save all images in case there is more than one 
            if(Array.isArray(req.files.img)){
                for(let file of req.files.img){    
                    const filename = await formatAndSaveFile(file);
                    if(filename){
                        imageList.push({url: filename, def: false});
                    }
                }
            }else{
                const filename = await formatAndSaveFile(req.files.img);
                if(filename){
                    imageList.push({url: filename, def: true});
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
        await image.resize(854, 480); // resize the image
        await image.write(`./public/uploads/${filename}`); // save the image in the path

        return filename;
    }else{
        return DEFAULT_IMAGE;
    }
}

const isImageTypeAccepted = (ext)=>{
    return acceptedTypes.includes(ext);
}