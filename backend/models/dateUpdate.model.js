import mongoose from 'mongoose'
const collectionUpdateSchema = new mongoose.Schema({
   
    updateDate: {
      type: String, // You can also use Date type
      required: true,
    },
    description: {
      type: String, // Optional: Description of the update
    },
  });
  
  const CollectionUpdate = mongoose.model('CollectionUpdate', collectionUpdateSchema);
  export default CollectionUpdate;
  