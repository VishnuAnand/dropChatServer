const express = require("express");
const multer = require("multer");
const File = require("../models/File");

const md5File = require('md5-file')

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null,'uploads/');
    },
    filename: (req,file, cb) => {
        //cb(null, new Date().toISOString()+file.originalname)
        cb(null, file.originalname)
    }
});

const upload = multer({storage});



router.post("/upload",upload.single("file"), async (req,res) => {

    const {filename, originalname, path, size } = req.file;
    
    let hash;
    let newfile= null;

    try{
        
        hash = await md5File(__dirname+'/../'+path);

        const file_data = await File.find({hash:hash});

        if(Object.keys(file_data).length !== 0){

            // Define the filter criteria to find the record you want to update
            const filter = { hash: hash }; // Replace with the actual filter criteria

            // Define the update you want to apply
            let update = { name:filename, recievers: [], path};// Replace with the new values

            const updatedRecord = await File.findOneAndUpdate(filter, update, { new: true });
            console.log("Finished");
            res.json(updatedRecord);
            

        } else {
            const newRecord = await File.create({name:filename, recievers: [], hash: hash, path});
            res.json(newRecord);
        }

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
});

module.exports = router;