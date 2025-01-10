import User from '../models/user.model.js';
import Branch from '../models/branch.model.js'
import bcrypt from 'bcrypt'


export const createUser = async(req,res)=>{
    try {
        const {name,mobile,password,role,state,branch}=req.body;

        // Check if the mobile number already exists
        const existingUser = await User.findOne({mobile})
        if(existingUser){
            return res.status(400).json({message:'This mobile number is already registered! '})
        }

           // Find the branch by name
    const branchData = await Branch.findOne({ branchName: branch });
    if (!branchData) {
      return res.status(400).json({ error: `Branch ${branch} does not exist` });
    }
    // console.log(branchData);

        // Hash the password 
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            name,mobile,password,role,state,branch_Id:branchData._id,branchName:branchData.branchName  // Use the ObjectId of the branch
        });
        await newUser.save();
        res.status(201).json({message:'User Created Successfully! ',user:newUser});
    } catch (error) {
        console.error('Error creating User :',error);
        res.status(500).json({message:'Error creating user',error:error.message})
    }
}

// Fetch all user data by role
export const fetchUserByRole=async(req,res)=>{
    try {
        const {role}=req.params;
        const users = await User.find({role});
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({error:"Error fetching users.."})
    }
}

// Fetch User 

export const fetchUser =async (req,res)=>{
    try {
        // const users=await User.find();
        const users = await User.find().populate('branch_Id', 'branchName'); // populate used to reference related schemas 
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
   
    
}

// update User 

export const updateUser =async (req,res)=>{
    const {name,mobile,role,state,branch,password}=req.body;
    
try {
    const userId = req.params.id;
    // console.log(userId);
    const branchData = await Branch.findOne({ branchName: branch });
    if (!branchData) {
      return res.status(400).json({ error: `Branch ${branch} does not exist` });
    }
    // console.log(branchData)
    const newChangeduser = {
        name,mobile,role,password,state,branch_Id:branchData._id,branchName:branchData.branchName
    }
    const updatedUser = await User.findByIdAndUpdate(userId,newChangeduser,{new:true});
    
    // console.log(updatedUser)
    res.status(200).json(updatedUser);

} catch (error) {
    res.status(500).json({error:'Error updating User'})
}
}

export const deleteUser =async (req,res)=>{
    try {
        const userId = req.params.id;
        console.log(userId)
    await User.findByIdAndDelete(userId);
    res.status(200).json({message:'User deleted successfully!'})
    } catch (error) {
     res.status(500).json({error:'Error deleting user'})   
    }
    
}

export const branchwise = async(req,res)=>{
       
try {
    const {branchName} = req.query;
    // console.log(branchName);
    const role= "Employee"
    const employess = await User.find({branchName,role})
    // console.log(employess);
    res.status(200).json(employess);
} catch (error) {
    res.status(500).json(error)
}
}