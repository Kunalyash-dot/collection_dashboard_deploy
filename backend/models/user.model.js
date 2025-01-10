import mongoose from 'mongoose'

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'StateHead', 'Manager', 'Employee','General'], required: true },
  state: { type: String, enum: ['Tamil_Nadu', 'Karnataka'], required: function () { return this.role !== 'Admin'; } },
  branch_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: function () { return ['Manager', 'Employee'].includes(this.role); } },
  branchName:{type:String,required:true}

});

const User = mongoose.model("User",userSchema);

export default User;