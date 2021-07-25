import React, { useState, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import "../styles/photoUpload.css"
//const resUrl="https://res.cloudinary.com/recipe-app-images/image/upload"
const url = `https://api.cloudinary.com/v1_1/recipe-app-images/upload`;

export default function MyDropzone(props) {
    //const [uploadedFiles, setUploadedFiles] = useState([])
    const [isUploaded, setisUploaded] = useState(false);
    
  const onDrop = useCallback((acceptedFiles)=> {
      acceptedFiles.forEach(async (acceptedFile) =>{
        const formData = new FormData();
        formData.append("file", acceptedFile)
        if(props.avatarComponent){
          formData.append("upload_preset", "tlrnqvxd")
        } else {
          formData.append("upload_preset", "n5oqdqwo")
        }
        
        await fetch(url, {
        method: "POST",
        body: formData
    })
    .then(res=> res.json())
    .then((response) => {
        const resFiles  = response;
        //setUploadedFiles(resFiles);
        setisUploaded(true);
        if(props.avatarComponent){
          //console.log("eee");
          props.addAvatarFunc(`https://res.cloudinary.com/recipe-app-images/image/upload/v${resFiles.version}/${resFiles.public_id}`)
        } else {
          //console.log("ccc");
          props.imageURLFunc(`https://res.cloudinary.com/recipe-app-images/image/upload/v${resFiles.version}/${resFiles.public_id}`)
        }
        
      })
    .catch(err=>console.log(err))
})
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accepts: "image/*", multiple: false})
  
  return (
    <div className={`${props.avatarComponent ? "addAvatarDiv": "null"}`}>
        <div {...getRootProps()}  className={`${props.avatarComponent ? "null": "dropzone"} ${isDragActive ? "activeDrop": "null"}`}>
        <input {...getInputProps()} />
        {
            isDragActive ?
            <p>Drop the files here ...</p> :
            props.avatarComponent ? <i className="fas fa-camera addAvatarIcon"></i>: <p>Drag 'n' drop your recipe image, or click to select files</p>
            
            
        }
        </div>    
    </div>
  )
}