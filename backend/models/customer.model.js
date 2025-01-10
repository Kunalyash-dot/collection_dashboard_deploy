import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true},
  accountNumber: { type: String, required: true, unique: true },
  loanAmount: { type: Number, required: true },
  emiAmount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  address: { type: String, required: true },
  pincode: { type: Number, required: true },
  dbDate: { type: String, required: true }, // Date of borrowing the loan
  collectionCount:{type:Number,required:true},
  balanceOutstanding:{type:Number,required:true},
  rpaBalance:{type:Number,required:true},
  bucket:{type:String,required:true},
  noOfDays:{type:Number,required:true},
  parStatus:{type:String,required:true},
  parCollectionStatus:{type:String,required:true},
  totalDue:{type:Number,required:true},
  collectionStatus:{type:String,required:true},
  finalStatus:{type:String,required:true},
  collectedAmount:{type:Number,required:true,default:0},
  yetToCollect:{type:Number,required:true,default:0},
  latitude:{type:Number,required:true},
  longitude:{type:Number,required:true},
  nachPresentation:{
    type:String,
    required:true
  },
  nachPresentationStatus:{
    type:String,required:true
  },
  state: {
    type: String,
    enum: ['Tamil_Nadu', 'Karnataka'],
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to an employee
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer