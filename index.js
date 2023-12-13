import express from "express";
import fileUpload from "express-fileupload";
import { downloadFile, getFile, getFiles, uploadFile } from "./s3.js";
const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.get("/", (req, res) => {
  res.json({ message: "welcome to server 3" });
});

app.post("/files", async (req, res) => {
  await uploadFile(req.files.file);
  res.json({ message: "Upload file with S3" });
});
app.get("/files", async (req, res) => {
  const result = await getFiles();
  res.json(result.Contents);
});

app.get("/files/:fileName", async (req, res) => {
  const result = await getFile(req.params.fileName);
  res.send(result);
});

app.get("/downloadfile/:fileName", async (req, res) => {
  await downloadFile(req.params.fileName);
  res.json({message:"file download"});
});

//Libre Acceso desde el Cliente
app.use(express.static('images'))

app.listen(3000);
console.log(`Server on port ${3000}`);
