import mongoose from "mongoose";


const managerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // This references the user with a Manager role
    unique:true
  },
  state:{
    type: String, enum: ['Tamil_Nadu', 'Karnataka'], required:true
  },
  branches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true // Manager oversees multiple branches
    }
  ],
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Refers to employees managed by this manager
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;