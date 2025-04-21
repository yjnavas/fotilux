import * as FileSystem from 'expo-file-system';
import apiUrl from '../constants/index';

export const getUserImageSrc = imagePath => {
    // if(imagePath){
    //     return getFileUrl(imagePath)
    // }else{
    if(imagePath){
        return require('../assets/images/secondProfile.jpg')
    }else{
        return require('../assets/images/defaultUser.png')
    }
}

export const getFileUrl = filepath =>{
    if(filepath){
        return { udl: `${apiUrl}/${filepath}` }
    }
}

export const uploadFile = async (folderName, fileUri, isImage=true) => {
    try{
        let fileName = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {     
            encoding: FileSystem.EncodingType.Base64,
        });
        let imageData = decode(fileBase64); //array buffer
        //send name and image data to server and return response
        // if(response.code !== 200){
        //     console.log('file upload error:  ',response.message);
        //     return { success: false, msg: 'Could not upload media' };
        // }
        return { success: true, msg: 'Media uploaded successfully' };
    }catch(error){
        console.log('file upload error:  ',error);
        return { success: false, msg: 'Could not upload media' };
    }
}

export const getFilePath = (folderName, isImage=true) => {
    return `${folderName}/${(new Date()).getTime()}/${isImage ? '.png' : 'mp4'}`;
    //profiles/478923748927894.png
}

export const downloadFile = async (fileUrl) => {
    try{
        // console.log('getLocalFilePath(fileUrl)', getLocalFilePath(fileUrl));
        console.log('fileUrl)', fileUrl);
        const {uri} = await FileSystem.downloadAsync(fileUrl.uri, fileUrl);
        return uri;
    }catch(error){
        console.log('download file error: ', error);
        return null;
    }
}

export const getLocalFilePath = (filePath) => {
    let fileName = filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
}