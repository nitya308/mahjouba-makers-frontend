import uploadFile, { getUrlForFile } from './s3';

const getFileFromUri = async (uri: string) => {
  try {
    const res = await fetch(uri);
    return await res.blob() as File;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const uploadMedia = async (fileName: string, uri: string) => {
  try {
    const file = await getFileFromUri(uri);
    console.log(file);
    if (!file) {
      return undefined;
    }
    const upload = uploadFile(fileName, file);
    await upload.promise();
    const url = getUrlForFile(fileName);
    return url;
  } catch (err) {
    console.log(err);
    console.log(JSON.stringify(err));
    return undefined;
  }
};
