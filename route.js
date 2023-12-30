import express from 'express';
import { uploadFile, getFiles, downloadFile } from './db.js';

const router = express.Router()

//Get all Files
router.get('/files', async(req, res) => {
  console.log('GETTING FILES FROM S3')
  const {success, data} = await getFiles();
  if (success) res.send(data)
  else return res.status(500).json({ success:false, messsage: "Error While fetching files" })
})

// Upload File
router.post('/file', async(req, res) => {
  console.log('UPLOADING FILE TO S3')
  const file = req.files;
  const { success, data } = await uploadFile(file);
  if (success) res.send(data)
  else return res.status(500).json({ success:false, messsage: "Error While uploading file" })
})

//Download File
router.get('/download/:fileId', async(req, res) => {
  console.log('FETCHING FILE WITH ID: ', req.params.fileId)
  const fileId = req.params.fileId;
  const { success, data } = await downloadFile(fileId);
  if (success) {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${fileId}`);
    res.send(Buffer.from(data.Body));
  }
  else return res.status(500).json({ success:false, messsage: "Error While downloading file" })
})

export default router