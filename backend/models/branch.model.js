import mongoose from 'mongoose'

const branchSchema = new mongoose.Schema({
    branchName:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true,
        enum:['Tamil_Nadu','Karnataka']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Branch = mongoose.model("Branch",branchSchema);

export default Branch;

