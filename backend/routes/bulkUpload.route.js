import express from 'express'
import { bulkDeleteCustomers, bulkUpdateCustomers, downloadSampleCustomerFile, exportCustomers, getDeleteProgress, getProgress, getUpdateProgress, uploadCustomer } from '../controllers/bulkUpload.controller.js';
import upload from '../configure/multer.js';

const router = express.Router();


router.post('/upload-customers',upload.single('file'),uploadCustomer);
router.get('/export-customers',exportCustomers)
router.post('/update-customers',upload.single('file'),bulkUpdateCustomers)
router.post('/delete-customers',upload.single('file'),bulkDeleteCustomers)
router.get('/create-customer-sample',downloadSampleCustomerFile);
router.get('/bulkCreateCustomerProgress',getProgress);
router.get('/bulkUpdateCustomerProgress',getUpdateProgress);
router.get('/bulkDeleteCustomerProgress',getDeleteProgress);
export default router;