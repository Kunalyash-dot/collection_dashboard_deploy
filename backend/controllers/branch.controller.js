import Branch from '../models/branch.model.js';

export const createBranch = async(req,res)=>{
    try {
        const {branchName,state}=req.body;
        const newBranch = new Branch({
            branchName,state
        });
        await newBranch.save();
        res.status(201).json({message:'Branch Created Successfully! ',branch:newBranch});
    } catch (error) {
        console.error('Error creating Branch :',error);
        res.status(500).json({message:'Error creating Branch',error:error.message})
    }
};

// Fetch all branches
export const fetchAllBranches =async(req,res)=>{
    const branches = await Branch.find({}) ;
    // const branches = await Branch.find({}, 'name _id'); // Fetch only name and ID
    res.status(200).json(branches)   
}

// update Branch 

export const updateBranch =async (req,res)=>{
    try {
        const branchId = req.params.id;
        const updatedBranch = await Branch.findByIdAndUpdate(branchId,req.body,{new:true});
        res.status(200).json(updatedBranch)

    } catch (error) {
        res.status(500).json({error:"Error updating Branch!"})
    }
}

// delete Branch 

export const deleteBranch =async (req,res)=>{
try {
    const branchId = req.params.id;
    await Branch.findByIdAndDelete(branchId);
    res.status(200).json({message:'Branch deleted successfully!'})
} catch (error) {
    res.status(500).json({error:"Error deleting Branch!"})
}
}


export const stateWise =async (req,res)=>{
try {
     const {state}= req.query;
     console.log(state)
const branches = await Branch.find({state});
res.status(200).json(branches)
    
} catch (error) {
    res.status(500).json({error: 'Error fetching branches.'})
}
   

}