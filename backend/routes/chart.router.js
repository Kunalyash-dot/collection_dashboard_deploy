import express from 'express'
import { branchWiseCollection, bucketWiseData, collectionEmiWise, collectionSummary, mithraBucketData, mithraEMIChart, mithraEMIData, mithraPincodeChart,  mithraPincodeWiseCollectionCount,  mithraWiseCollectionData,  nachBucketWise, nachEmiWise, nachWiseData, parBranchWiseData, parBucketWise} from '../controllers/chart.controller.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/collection-summary',authorize(["Admin","StateHead","Manager"]),collectionSummary)
router.get('/branch-wise-collection',authorize(["Admin", "StateHead", "Manager"]),branchWiseCollection)
router.get('/bucket-wise-collection',authorize(["Admin", "StateHead", "Manager"]),bucketWiseData)
router.get('/nach-wise-collection',authorize(["Admin", "StateHead", "Manager"]),nachWiseData)
router.get('/nach-bucket-wise',authorize(["Admin", "StateHead", "Manager"]),nachBucketWise)
router.get('/collection-emi-wise',authorize(["Admin", "StateHead", "Manager"]),collectionEmiWise)
router.get('/nach-emi-wise',authorize(["Admin", "StateHead", "Manager"]),nachEmiWise)
router.get('/par-branch-wise-data',authorize(["Admin", "StateHead", "Manager"]),parBranchWiseData)
router.get('/par-bucket-wise-data',authorize(["Admin", "StateHead", "Manager"]),parBucketWise)
router.get('/mithra-pincode-wise-collection-data',authorize(["Admin", "StateHead", "Manager"]),mithraPincodeWiseCollectionCount);
router.get('/mithra-wise-collection-data',authorize(["Admin", "StateHead", "Manager"]),mithraWiseCollectionData);
router.get('/mithra-pincode-chart',authorize(["Employee"]),mithraPincodeChart);
router.get('/mithra-emi-chart',authorize(["Employee"]),mithraEMIChart);
router.get('/mithra-bucket-data',authorize(["Employee"]),mithraBucketData);
router.get('/mithra-emi-data',authorize(["Employee"]),mithraEMIData);



export default router;