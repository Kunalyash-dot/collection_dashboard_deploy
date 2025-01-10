import User from '../models/user.model.js'
import Branch from '../models/branch.model.js'
import Manager from '../models/manager.model.js'

export const createManager =async (req,res)=>{
    try {
        const {userName,state,branchNames,employeeNames}=req.body;

        // Find user by name
        const user = await User.findOne({name:userName,role:'Manager'});
        if(!user) return res.status(404).json({error:'Manager user not found. Create Manager User! '})
       
        // Find branches by name
    const branches = await Branch.find({ branchName: { $in: branchNames } });
    if (branches.length !== branchNames.length) {
      return res.status(404).json({ error: 'One or more branches not found.' });
    }
        
    // Find employees by name
    const employees = await User.find({ name: { $in: employeeNames }, role: 'Employee' });
    if (employees.length !== employeeNames.length) {
      return res.status(404).json({ error: 'One or more employees not found.' });
    }

    // Create manager
    const manager = new Manager({
      user: user._id,
      state,
      branches: branches.map(branch => branch._id),
      employees: employees.map(employee => employee._id)
    });
    const savedManager = await manager.save();

    res.status(201).json(savedManager);

    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'Manager already exists for this user' });
      } else {
        res.status(500).json({ error: 'Error creating manager.' });
      }    
    }
}

// get Manager 

export const getManager = async (req,res)=>{

  try {
    const managerData = await Manager.find({}).populate("user","name").populate("branches","branchName").populate("employees","name")
    res.status(200).json({managerData});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching manager data.' });
  }
}

export const employeesByBranches =async (req,res)=>{
  const { branchNames } = req.body;
  // console.log(branchNames)
  try {
    // Find branch IDs based on branch names
    const branches = await Branch.find({ branchName: { $in: branchNames } });
    const branchIds = branches.map(branch => branch._id);

    // Find employees in these branches
    const employees = await User.find({ branch_Id: { $in: branchIds }, role: 'Employee' });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching employees.' });
  }
}

export const deleteManager = async (req,res)=>{
  try {
    const managerId = req.params.id;
    // console.log(managerId)
    await Manager.findByIdAndDelete(managerId);
    res.status(200).json({message:'Manager deleted successfully!'})
  } catch (error) {
    res.status(500).json({error:'Error deleting Manager'})
  }
}

export const getSelectedManager = async (req,res)=>{

  try {
    const managerId = req.params.id;
    // console.log(managerId)
    const managerData = await Manager.findById( managerId).populate("user","name").populate("branches","branchName").populate("employees","name");
    // console.log(managerData)
    res.status(200).json(managerData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching manager data.' });
  }
}
export const getManagerData = async (req,res)=>{

  try {
    const managerId = req.params.id;
    // console.log(managerId)
    const managerData = await Manager.findOne( {user:managerId}).populate("user","name").populate("branches","branchName").populate("employees","name");
    // console.log(managerData)
    res.status(200).json(managerData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching manager data.' });
  }
}

export const updateManager =async (req,res)=>{
  try {
    const {userName,state,branchNames,employeeNames}=req.body;
    const managerId = req.params.id;

   // Find user by name
   const user = await User.findOne({name:userName,role:'Manager'});
   if(!user) return res.status(404).json({error:'Manager user not found. Create Manager User! '})
   
    // Find branches by name
const branches = await Branch.find({ branchName: { $in: branchNames } });
if (branches.length !== branchNames.length) {
  return res.status(404).json({ error: 'One or more branches not found.' });
}
    
// Find employees by name
const employees = await User.find({ name: { $in: employeeNames }, role: 'Employee' });
if (employees.length !== employeeNames.length) {
  return res.status(404).json({ error: 'One or more employees not found.' });
}

// Create manager
const newManagerData = {
  user: user._id,
  state,
  branches: branches.map(branch => branch._id),
  employees: employees.map(employee => employee._id)
};
const updatedManager = await Manager.findByIdAndUpdate(managerId,newManagerData,{new:true});

res.status(201).json(updatedManager);

} catch (error) {
 res.status(500).json({error:'Error updating Manager!'})  
}
}