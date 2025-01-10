import CollectionUpdate from "../models/dateUpdate.model.js";

export const createDate = async(req,res)=>{
try {
    const {updateDate,description}=req.body;
    const detail = new CollectionUpdate({
        updateDate,
        description
    });
    const savedDetails = await detail.save();
    res.status(201).json(savedDetails);

} catch (error) {
    res.status(500).json({error:"Error creating date details"})
}

}

export const getDetails =async (req,res)=>{
    try {
        const details = await CollectionUpdate.find({});
        res.status(200).json({details})
    } catch (error) {
        
    }

}

export const updateDetails =async(req,res)=>{
    try {
        const {updateDate,description}=req.body;
        const id = req.params.id;
        const detail = await CollectionUpdate.findById(id);
        if(!detail) return res.status(404).json({error:'Details not found '});
        const newDetails = {
            updateDate,
            description
        }
        const UpdateDetails = await CollectionUpdate.findByIdAndUpdate(id,newDetails,{new:true});
        res.status(201).json(updateDetails);
    } catch (error) {
        res.status(500).json({error:'Error updating Details!'})
    }

}

export const deleteDetails =async (req,res)=>{
    try {
        const id = req.params.id;
        // console.log(managerId)
        await CollectionUpdate.findByIdAndDelete(id);
        res.status(200).json({message:'Details deleted successfully!'})
      } catch (error) {
        res.status(500).json({error:'Error deleting Details'})
      }
}