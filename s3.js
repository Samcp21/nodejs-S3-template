//Establece la conexion
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
} from "./config.js";

import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});
//subir archivo
export async function uploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: "hola.png",
    Body: stream,
  };

  const command = new PutObjectCommand(uploadParams);
  const result = await client.send(command);
  console.log(result);
}
//obtener todos los archivo
export async function getFiles() {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
  });
  return await client.send(command);
}

//buscar un solo archivo y genera un url para poder descargarlo
export async function getFile(fileName) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  const result = await client.send(command);
  console.log("url", url);
  console.log("result", result);
  return { url, ...result.$metadata };
}

//download file
export async function downloadFile(fileName) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });
  const result = await client.send(command);
  result.Body.pipe(fs.createWriteStream(`.images/${fileName}`));
}
