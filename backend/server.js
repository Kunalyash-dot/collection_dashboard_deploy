import express from 'express';
import cors from 'cors'
const app = express();
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import connectDB from './db.js';
import userRouter from './routes/user.route.js'
import branchRouter from './routes/branch.route.js'
import managerRouter from './routes/manager.route.js'
import customerRouter from './routes/customer.router.js'
import bulkUpload from './routes/bulkUpload.route.js'
import authRouter from './routes/auth.route.js'
import chartRouter from './routes/chart.router.js'
import dateRouter from './routes/dateUpdate.route.js'
import path from 'path'

import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 4000;
connectDB();

const __dirname = path.resolve();

// Allow requests from the frontend (http://localhost:3000 by default for React)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Use the deployed frontend URL
  credentials: true, // Allow credentials (cookies, auth headers)
}));
// for mobile 
// app.use(cors({
//   origin: [ 'http://192.168.43.217:3000'],
//   credentials: true,
// }));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Other middleware
app.use(express.json());
// app.get("/",(req,res)=>{
//   res.send("Working")
// })
// Example route
app.use('/api/users',userRouter);
app.use('/api/branches',branchRouter);
app.use('/api/managers',managerRouter);
app.use('/api/customers',customerRouter);
app.use('/api/bulkUploads',bulkUpload)
app.use('/api/auth',authRouter)
app.use('/api/charts',chartRouter)
app.use('/api/details',dateRouter); 

app.use(express.static(path.join(__dirname,"/frontend/build")))
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
})

// app.listen(PORT,() => {
//   console.log(`Server is running on http://Localhost:${PORT}`);
 
// });
// for mobile 
app.listen(PORT,'0.0.0.0',() => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
 
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});