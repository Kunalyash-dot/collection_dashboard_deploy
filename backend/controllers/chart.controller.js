import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Manager from "../models/manager.model.js";
import User from "../models/user.model.js";

export const collectionSummary = async (req, res) => {
  try {
    const { role, id } = req.user; // Extract user role and ID from the token

    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }

    const data = await Customer.aggregate([
      { $match: matchFilter },
      // Join branches
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      // Flatten branchDetails array
      { $unwind: "$branchDetails" },

      // Group by branch, collection status, and state
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            collectionStatus: "$collectionStatus",
            state: "$state",
          },
          count: { $sum: 1 }, // Count documents for this combination
        },
      },

      // Group by collection status to organize branch-wise data
      {
        $group: {
          _id: "$_id.collectionStatus",
          branches: {
            $push: {
              branch: "$_id.branch",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" }, // Total count for this collection status
        },
      },

      // Calculate branch-wise totals separately
      {
        $facet: {
          // Collection summary grouped by collection status
          collectionSummary: [
            {
              $group: {
                _id: "$_id", // Group by collection status
                branches: { $first: "$branches" }, // Keep branches array
                totalCount: { $first: "$totalCount" }, // Keep totalCount
              },
            },
          ],

          // Branch-wise totals
          branchTotals: [
            {
              $unwind: "$branches", // Flatten branches array
            },
            {
              $group: {
                _id: "$branches.branch", // Group by branch name
                totalBranchCount: { $sum: "$branches.count" }, // Sum counts for each branch
              },
            },
          ],
        },
      },
    ]);
    // Format the output into a readable format
    const result = {
      branches: {},
      totals: {},
    };
    data[0].collectionSummary.forEach((status) => {
      result.totals[status._id] = status.totalCount; // Total count per collection status

      status.branches.forEach((branchData) => {
        // Initialize branch if not present
        if (!result.branches[branchData.branch]) {
          result.branches[branchData.branch] = {};
        }
        // Add count for the specific status under the branch
        result.branches[branchData.branch][status._id] = branchData.count;
      });
    });

    // Process branchTotals for branch-wise totals
    data[0].branchTotals.forEach((branch) => {
      if (!result.branches[branch._id]) {
        result.branches[branch._id] = {};
      }
      result.branches[branch._id].total = branch.totalBranchCount; // Add branch total
    });

    res.status(200).json(result); // Send the formatted result
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

export const branchWiseCollection = async (req, res) => {
  try {
    const { role, id } = req.user; // Extract user role and ID from the token

    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      // Flatten branchDetails array
      { $unwind: "$branchDetails" },
      // Group by branch, collection status, and state
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            finalStatus: "$finalStatus",
            state: "$state",
          },
          count: { $sum: 1 }, // Count documents for this combination
        },
      },
      {
        $group: {
          _id: "$_id.finalStatus",
          branches: {
            $push: {
              branch: "$_id.branch",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" }, // Total count for this collection status
        },
      },
      // Calculate branch-wise totals separately
      {
        $facet: {
          // Collection summary grouped by collection status
          collectionSummary: [
            {
              $group: {
                _id: "$_id", // Group by collection status
                branches: { $first: "$branches" }, // Keep branches array
                totalCount: { $first: "$totalCount" }, // Keep totalCount
              },
            },
          ],

          // Branch-wise totals
          branchTotals: [
            {
              $unwind: "$branches", // Flatten branches array
            },
            {
              $group: {
                _id: "$branches.branch", // Group by branch name
                totalBranchCount: { $sum: "$branches.count" }, // Sum counts for each branch
              },
            },
          ],
        },
      },
    ]);
    // Format the output into a readable format
    const result = {
      branches: {},
      totals: {},
    };

    // console.log(data[0].collectionSummary[0])

    data[0].collectionSummary.forEach((status) => {
      result.totals[status._id] = status.totalCount; // Total count per collection status

      status.branches.forEach((branchData) => {
        // Initialize branch if not present
        if (!result.branches[branchData.branch]) {
          result.branches[branchData.branch] = {};
        }
        // Add count for the specific status under the branch
        result.branches[branchData.branch][status._id] = branchData.count;
      });
    });

    // Process branchTotals for branch-wise totals
    data[0].branchTotals.forEach((branch) => {
      if (!result.branches[branch._id]) {
        result.branches[branch._id] = {};
      }
      result.branches[branch._id].total = branch.totalBranchCount; // Add branch total
    });
    //  console.log(result)

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

export const bucketWiseData = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" }, // Flatten branchDetails array

      // Group by branch, finalStatus, and bucket
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            bucket: "$bucket",
            finalStatus: "$finalStatus",
          },
          count: { $sum: 1 }, // Count documents for this combination
        },
      },

      // Reshape data: Group by bucket
      {
        $group: {
          _id: "$_id.bucket", // Group by bucket
          datas: {
            $push: {
              branch: "$_id.branch",
              status: "$_id.finalStatus",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" }, // Calculate total count per bucket
        },
      },

      // Final transformation
      {
        $project: {
          _id: 0, // Exclude _id from output
          bucket: "$_id", // Rename _id to bucket
          datas: 1, // Keep datas array
          totalCount: 1, // Keep total count
        },
      },

      // Optional: Sort by bucket or totalCount
      // { $sort: { bucket: 1 } },
      {
        $addFields: {
          bucketSortKey: { $toInt: { $substr: ["$bucket", 1, -1] } }, // Extract and convert the numeric part of bucket
        },
      },
      { $sort: { bucketSortKey: 1 } }, // Sort by the numeric part
      {
        $project: {
          bucketSortKey: 0, // Remove bucketSortKey from the final output
        },
      }, // Sort by bucket name (ascending)
    ]);

    // Format the data
    const formatDataWithBuckets = (data) => {
      const result = {
        buckets: {}, // Bucket-wise details
        totals: {}, // Overall totals across all buckets
      };

      // Process each bucket in the aggregated data
      data.forEach((bucket) => {
        const bucketName = bucket.bucket;

        // Initialize the bucket
        result.buckets[bucketName] = {
          branches: {}, // Branch-wise details within the bucket
          totals: {}, // Totals for statuses in this bucket
          totalCount: bucket.totalCount, // Total count for this bucket
        };

        // Loop through branch data for this bucket
        bucket.datas.forEach((branchData) => {
          const { branch, status, count } = branchData;

          // Initialize branch entry
          if (!result.buckets[bucketName].branches[branch]) {
            result.buckets[bucketName].branches[branch] = {};
          }

          // Add count for the status under the branch
          result.buckets[bucketName].branches[branch][status] = count;

          // Update bucket-level totals for the status
          result.buckets[bucketName].totals[status] =
            (result.buckets[bucketName].totals[status] || 0) + count;

          // Update global totals for the status
          result.totals[status] = (result.totals[status] || 0) + count;
        });

        // Update global total count
        result.totals.totalCount =
          (result.totals.totalCount || 0) + bucket.totalCount;
      });

      return result;
    };

    const formattedResult = formatDataWithBuckets(data);

    // Send the response
    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error fetching bucket-wise data:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const nachWiseData = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      // Flatten branchDetails array
      { $unwind: "$branchDetails" },
      // Group by branch, collection status, and state
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            nachPresentation: "$nachPresentation",
            nachPresentationStatus: "$nachPresentationStatus",
            state: "$state",
          },
          count: { $sum: 1 }, // Count documents for this combination
        },
      },
      {
        $group: {
          _id: "$_id.nachPresentation",
          datas: {
            $push: {
              branch: "$_id.branch",
              nachPresentationStatus: "$_id.nachPresentationStatus",
              state: "$_id.state",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" },
        },
      },
      {
        $project: {
          _id: 0,
          nachPresentation: "$_id",
          datas: 1,
          totalCount: 1,
        },
      },
    ]);
    const formatDataWithNach = (data) => {
      const result = {
        nach: {}, // nach-wise details
        totals: {}, // Overall totals across all buckets
      };

      data.forEach((nach) => {
        const nachPresentationName = nach.nachPresentation;
        result.nach[nachPresentationName] = {
          states: {},
          branches: {},
          totals: {},
          totalCount: nach.totalCount,
        };
        nach.datas.forEach((data) => {
          const { branch, nachPresentationStatus, state, count } = data;

          // Initialize branch entry
          if (!result.nach[nachPresentationName].branches[branch]) {
            result.nach[nachPresentationName].branches[branch] = {};
          }
          // Initialize state entry
          if (!result.nach[nachPresentationName].states[state]) {
            result.nach[nachPresentationName].states[state] = {};
          }
          result.nach[nachPresentationName].branches[branch][
            nachPresentationStatus
          ] = count;

          result.nach[nachPresentationName].states[state][
            nachPresentationStatus
          ] =
            (result.nach[nachPresentationName].states[state][
              nachPresentationStatus
            ] || 0) + count;

          result.nach[nachPresentationName].totals[nachPresentationStatus] =
            (result.nach[nachPresentationName].totals[nachPresentationStatus] ||
              0) + count;

          result.totals[nachPresentationStatus] =
            (result.totals[nachPresentationStatus] || 0) + count;
        });
        result.totals.totalCount =
          (result.totals.totalCount || 0) + nach.totalCount;
      });
      return result;
    };

    const formattedResult = formatDataWithNach(data);
    res.status(200).json(formattedResult);
    // res.status(200).json(data)
  } catch (error) {
    console.error("Error in nachWiseData:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const nachBucketWise = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" }, // Flatten branchDetails array
      {
        $match: { nachPresentation: "Consider For Presentation" },
      },
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            bucket: "$bucket",
            nachPresentationStatus: "$nachPresentationStatus",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.bucket",
          datas: {
            $push: {
              branch: "$_id.branch",
              status: "$_id.nachPresentationStatus",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" }, // Calculate total count per bucket
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from output
          bucket: "$_id", // Rename _id to bucket
          datas: 1, // Keep datas array
          totalCount: 1, // Keep total count
        },
      },

      // Optional: Sort by bucket or totalCount
      {
        $addFields: {
          bucketSortKey: { $toInt: { $substr: ["$bucket", 1, -1] } }, // Extract and convert the numeric part of bucket
        },
      },
      { $sort: { bucketSortKey: 1 } }, // Sort by the numeric part
      {
        $project: {
          bucketSortKey: 0, // Remove bucketSortKey from the final output
        },
      }, // Sort by bucket name (ascending)
    ]);
    // Format the data
    const formatDataWithBuckets = (data) => {
      const result = {
        buckets: {}, // Bucket-wise details
        totals: {}, // Overall totals across all buckets
      };

      // Process each bucket in the aggregated data
      data.forEach((bucket) => {
        const bucketName = bucket.bucket;

        // Initialize the bucket
        result.buckets[bucketName] = {
          branches: {}, // Branch-wise details within the bucket
          totals: {}, // Totals for statuses in this bucket
          totalCount: bucket.totalCount, // Total count for this bucket
        };

        // Loop through branch data for this bucket
        bucket.datas.forEach((branchData) => {
          const { branch, status, count } = branchData;

          // Initialize branch entry
          if (!result.buckets[bucketName].branches[branch]) {
            result.buckets[bucketName].branches[branch] = {};
          }

          // Add count for the status under the branch
          result.buckets[bucketName].branches[branch][status] = count;

          // Update bucket-level totals for the status
          result.buckets[bucketName].totals[status] =
            (result.buckets[bucketName].totals[status] || 0) + count;

          // Update global totals for the status
          result.totals[status] = (result.totals[status] || 0) + count;
        });

        // Update global total count
        result.totals.totalCount =
          (result.totals.totalCount || 0) + bucket.totalCount;
      });

      return result;
    };

    const formattedResult = formatDataWithBuckets(data);
    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error in nachBucketWiseData:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const collectionEmiWise = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" }, // Flatten branchDetails array
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            collectionCount: "$collectionCount",
            finalStatus: "$finalStatus",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.collectionCount",
          datas: {
            $push: {
              branch: "$_id.branch",
              status: "$_id.finalStatus",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" }, // Calculate total count per bucket
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from output
          collectionCount: "$_id",
          datas: 1, // Keep datas array
          totalCount: 1, // Keep total count
        },
      },
      {
        $sort: { collectionCount: 1 },
      },
    ]);

    const formatDataWithEmi = (data) => {
      const result = {
        emiCounts: {},
        totals: {},
      };
      data.forEach((emi) => {
        const emiCount = emi.collectionCount;

        result.emiCounts[emiCount] = {
          branches: {}, // Branch-wise details within the bucket
          totals: {}, // Totals for statuses in this bucket
          totalCount: emi.totalCount,
        };
        emi.datas.forEach((branchData) => {
          const { branch, status, count } = branchData;
          // Initialize branch entry
          if (!result.emiCounts[emiCount].branches[branch]) {
            result.emiCounts[emiCount].branches[branch] = {};
          }
          result.emiCounts[emiCount].branches[branch][status] = count;

          result.emiCounts[emiCount].totals[status] =
            (result.emiCounts[emiCount].totals[status] || 0) + count;
          result.totals[status] = (result.totals[status] || 0) + count;
        });
        result.totals.totalCount =
          (result.totals.totalCount || 0) + emi.totalCount;
      });
      return result;
    };
    const formattedResult = formatDataWithEmi(data);
    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error in collectionEMIWiseData:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const nachEmiWise = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" }, // Flatten branchDetails array
      {
        $match: { nachPresentation: "Consider For Presentation" },
      },
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            collectionCount: "$collectionCount",
            nachPresentationStatus: "$nachPresentationStatus",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.collectionCount",
          datas: {
            $push: {
              branch: "$_id.branch",
              status: "$_id.nachPresentationStatus",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" }, // Calculate total count per bucket
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from output
          collectionCount: "$_id",
          datas: 1, // Keep datas array
          totalCount: 1, // Keep total count
        },
      },
      {
        $sort: { collectionCount: 1 },
      },
    ]);

    const formatNachDataWithEmi = (data) => {
      const result = {
        emiCounts: {},
        totals: {},
      };
      data.forEach((emi) => {
        const emiCount = emi.collectionCount;

        result.emiCounts[emiCount] = {
          branches: {}, // Branch-wise details within the bucket
          totals: {}, // Totals for statuses in this bucket
          totalCount: emi.totalCount,
        };
        emi.datas.forEach((branchData) => {
          const { branch, status, count } = branchData;
          // Initialize branch entry
          if (!result.emiCounts[emiCount].branches[branch]) {
            result.emiCounts[emiCount].branches[branch] = {};
          }
          result.emiCounts[emiCount].branches[branch][status] = count;

          result.emiCounts[emiCount].totals[status] =
            (result.emiCounts[emiCount].totals[status] || 0) + count;
          result.totals[status] = (result.totals[status] || 0) + count;
        });
        result.totals.totalCount =
          (result.totals.totalCount || 0) + emi.totalCount;
      });
      return result;
    };

    const formattedResult = formatNachDataWithEmi(data);
    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error in collectionEMIWiseData:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const parBranchWiseData = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" },
      {
        $match: { parStatus: "PAR" },
      },
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            parCollectionStatus: "$parCollectionStatus",
            state: "$state",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          datas: {
            $push: {
              state: "$_id.state",
              branch: "$_id.branch",
              parStatus: "$_id.parCollectionStatus",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" },
        },
      },
      {
        $project: {
          _id: 0,
          datas: 1,
          totalCount: 1,
        },
      },
    ]);

    const formatBranchWiseParData = (data) => {
      const result = {
        par: {
          states: {},
          branches: {},
          totals: {},
          totalCount: 0,
        },
      };

      if (!data || data.length === 0) return result;

      const item = data[0]; // As the aggregation groups everything into one document
      result.par.totalCount = item.totalCount;

      item.datas.forEach(({ branch, parStatus, count, state }) => {
        // Initialize branch entry
        if (!result.par.branches[branch]) {
          result.par.branches[branch] = {};
        }

        // Initialize state entry
        if (!result.par.states[state]) {
          result.par.states[state] = {};
        }

        // Add counts for branches and states
        result.par.branches[branch][parStatus] = count;
        result.par.states[state][parStatus] =
          (result.par.states[state][parStatus] || 0) + count;

        // Add totals for parStatus
        result.par.totals[parStatus] =
          (result.par.totals[parStatus] || 0) + count;
      });

      return result;
    };

    const formattedResult = formatBranchWiseParData(data);
    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error fetching branch-wise PAR data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const parBucketWise = async (req, res) => {
 
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" }, // Flatten branchDetails array
      {
        $match: { parStatus: "PAR" },
      },
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            bucket: "$bucket",
            parCollectionStatus: "$parCollectionStatus",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.bucket",
          datas: {
            $push: {
              branch: "$_id.branch",
              status: "$_id.parCollectionStatus",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" }, // Calculate total count per bucket
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from output
          bucket: "$_id", // Rename _id to bucket
          datas: 1, // Keep datas array
          totalCount: 1, // Keep total count
        },
      },

      // Optional: Sort by bucket or totalCount
      {
        $addFields: {
          bucketSortKey: { $toInt: { $substr: ["$bucket", 1, -1] } }, // Extract and convert the numeric part of bucket
        },
      },
      { $sort: { bucketSortKey: 1 } }, // Sort by the numeric part
      {
        $project: {
          bucketSortKey: 0, // Remove bucketSortKey from the final output
        },
      },
    ]);
    // Format the data
    const formatParDataWithBuckets = (data) => {
      const result = {
        buckets: {}, // Bucket-wise details
        totals: {}, // Overall totals across all buckets
      };

      // Process each bucket in the aggregated data
      data.forEach((bucket) => {
        const bucketName = bucket.bucket;

        // Initialize the bucket
        result.buckets[bucketName] = {
          branches: {}, // Branch-wise details within the bucket
          totals: {}, // Totals for statuses in this bucket
          totalCount: bucket.totalCount, // Total count for this bucket
        };

        // Loop through branch data for this bucket
        bucket.datas.forEach((branchData) => {
          const { branch, status, count } = branchData;

          // Initialize branch entry
          if (!result.buckets[bucketName].branches[branch]) {
            result.buckets[bucketName].branches[branch] = {};
          }

          // Add count for the status under the branch
          result.buckets[bucketName].branches[branch][status] = count;

          // Update bucket-level totals for the status
          result.buckets[bucketName].totals[status] =
            (result.buckets[bucketName].totals[status] || 0) + count;

          // Update global totals for the status
          result.totals[status] = (result.totals[status] || 0) + count;
        });

        // Update global total count
        result.totals.totalCount =
          (result.totals.totalCount || 0) + bucket.totalCount;
      });

      return result;
    };
    const formattedResult = formatParDataWithBuckets(data);
    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error in parBucketWiseData:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const mithraPincodeWiseCollectionCount = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }

    const { branchName, employeeName } = req.query;

    const matchStage = {};
    if (branchName) matchStage["branchDetails.branchName"] = branchName;
    if (employeeName) matchStage["employeeDetails.name"] = employeeName;
    const data = await Customer.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "users",
          localField: "employee",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      { $unwind: "$employeeDetails" },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" },
      { $match: matchStage }, // Filter based on branch and employee name
      {
        $group: {
          _id: {
            branch: "$branchDetails.branchName",
            employee: "$employeeDetails.name",
            pincode: "$pincode",
            finalStatus: "$finalStatus",
          },
          count: { $sum: 1 }, // Count each status
        },
      },
      {
        $group: {
          _id: {
            branch: "$_id.branch",
            employee: "$_id.employee",
            pincode: "$_id.pincode",
          },
          statuses: {
            $push: {
              status: "$_id.finalStatus",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" }, // Total count for this group
        },
      },
      {
        $project: {
          _id: 0,
          branch: "$_id.branch",
          employee: "$_id.employee",
          pincode: "$_id.pincode",
          collectedCount: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$statuses",
                    as: "status",
                    cond: { $eq: ["$$status.status", "Collected"] },
                  },
                },
                as: "collected",
                in: "$$collected.count",
              },
            },
          },
          notCollectedCount: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$statuses",
                    as: "status",
                    cond: { $eq: ["$$status.status", "Not Collected"] },
                  },
                },
                as: "notCollected",
                in: "$$notCollected.count",
              },
            },
          },
          totalCount: 1,
        },
      },
    ]);
    // Format the data as per the required structure
    const formattedData = data.reduce((acc, item) => {
      const {
        branch,
        employee,
        pincode,
        collectedCount,
        notCollectedCount,
        totalCount,
      } = item;

      // Initialize branch and employee objects if they don't exist
      if (!acc[branch]) acc[branch] = {};
      if (!acc[branch][employee]) acc[branch][employee] = {};

      // Add pincode data
      acc[branch][employee][pincode] = {
        collected: collectedCount || 0,
        notCollected: notCollectedCount || 0,
      };

      return acc;
    }, {});
    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error in aggregation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const mithraWiseCollectionData = async (req, res) => {
  try {
    const { role, id } = req.user; 
    let matchFilter = {};
    if (role === "StateHead") {
      // Restrict data to the user's state
      const user = await User.findById(id);
      matchFilter.state = user.state;
    } else if (role === "Manager") {
      // Restrict data to branches managed by the user
      const manager = await Manager.findOne({ user: id }).populate("branches");
      const branchIds = manager.branches.map((branch) => branch._id);
      matchFilter.branch = { $in: branchIds };
    }
    // MongoDB Aggregation Pipeline
    const data = await Customer.aggregate([
      // Lookup to join employee details from "users" collection
      { $match: matchFilter },
      {
        $lookup: {
          from: "users",
          localField: "employee",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      // Flatten the employeeDetails array
      { $unwind: "$employeeDetails" },

      // Group by employee and finalStatus to count occurrences
      {
        $group: {
          _id: {
            employee: "$employeeDetails.name",
            finalStatus: "$finalStatus",
          },
          count: { $sum: 1 },
        },
      },

      // Group by employee to aggregate statuses and calculate total count
      {
        $group: {
          _id: "$_id.employee",
          status: {
            $push: {
              status: "$_id.finalStatus",
              count: "$count",
            },
          },
          totalCount: { $sum: "$count" },
        },
      },

      // Restructure the output
      {
        $project: {
          _id: 0, // Exclude _id from the output
          employee: "$_id", // Include employee name
          status: 1, // Include status details
          totalCount: 1, // Include total count
        },
      },

      // Sort employees alphabetically
      { $sort: { employee: 1 } },
    ]);

    // Function to format data
    const formatDataWithEmi = (data) => {
      const result = {
        employeesList: {}, // Object to store each employee's data
        totals: {}, // Object to hold overall totals
      };

      // Process each employee's data
      data.forEach((emp) => {
        const employeeName = emp.employee;

        // Initialize the structure for the current employee
        result.employeesList[employeeName] = {
          totals: {}, // Totals for each status
          totalCount: emp.totalCount, // Total count for the employee
        };

        // Process each status for the current employee
        emp.status.forEach((statusEntry) => {
          const { status, count } = statusEntry;

          // Add status count to the employee's totals
          result.employeesList[employeeName].totals[status] = count;

          // Update overall totals across all employees
          if (!result.totals[status]) {
            result.totals[status] = 0;
          }
          result.totals[status] += count;
        });
      });

      // Calculate grand total across all employees
      result.totals.totalCount = data.reduce(
        (acc, emp) => acc + emp.totalCount,
        0
      );

      return result;
    };

    // Format the aggregated data
    const formattedData = formatDataWithEmi(data);

    // Send the formatted response
    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


export const mithraBucketData = async (req,res)=>{

  const { role, id } = req.user;


  try {
    const data = await Customer.aggregate([
      { $match: {
        employee:new mongoose.Types.ObjectId(id),
        finalStatus:"Not Collected"
      } },
     
      {
        $group: {
          _id: {
            bucket: "$bucket",
            finalStatus: "$finalStatus",
          },
          count: { $sum: 1 }, // Count each status
        },
      },
      
      {
        $group:{
          _id:"$_id.bucket",
          datas:{
            $push:{
status:"$_id.finalStatus",
            count:"$count"
            }
            
          },
          totalCount:{$sum:"$count"}
        }
      },
      {
        $project:{
          _id:0,
          bucket:"$_id",
          datas:1,
          totalCount:1,
        },
      },
       // Optional: Sort by bucket or totalCount
       {
        $addFields: {
          bucketSortKey: { $toInt: { $substr: ["$bucket", 1, -1] } }, // Extract and convert the numeric part of bucket
        },
      },
      { $sort: { bucketSortKey: 1 } }, // Sort by the numeric part
      {
        $project: {
          bucketSortKey: 0, // Remove bucketSortKey from the final output
        },
      }, // Sort by bucket name (ascending)
    ]);
   
    // Transform data into a more readable format
const formattedData = data.reduce((result, item) => {
  const { bucket, datas, totalCount } = item;
  result[bucket] = {
    statuses: datas.reduce((acc, { status, count }) => {
      acc[status] = count;
      return acc;
    }, {}),
    totalCount,
  };
  return result;
}, {});


  //  console.log(formattedData)
    res.status(200).json(formattedData);
    
  } catch (error) {
    console.log(error)
  }
}
export const mithraEMIChart = async (req,res)=>{

  const { role, id } = req.user;


  try {
    const data = await Customer.aggregate([
      { $match: {
        employee:new mongoose.Types.ObjectId(id),
        
      } },
     
      {
        $group: {
          _id: {
            emi: "$collectionCount",
            finalStatus: "$finalStatus",
          },
          count: { $sum: 1 }, // Count each status
        },
      },
      
      {
        $group:{
          _id:"$_id.emi",
          datas:{
            $push:{
status:"$_id.finalStatus",
            count:"$count"
            }
            
          },
          totalCount:{$sum:"$count"}
        }
      },
      {
        $project:{
          _id:0,
          emi:"$_id",
          datas:1,
          totalCount:1,
        },
      }
    ]);
   
    // Transform data into a more readable format
const formattedData = data.reduce((result, item) => {
  const { emi, datas, totalCount } = item;
  result[emi] = {
    statuses: datas.reduce((acc, { status, count }) => {
      acc[status] = count;
      return acc;
    }, {}),
    totalCount,
  };
  return result;
}, {});


   
    res.status(200).json(formattedData);
    
  } catch (error) {
    console.log(error)
  }
}
export const mithraEMIData = async (req,res)=>{

  const { role, id } = req.user;


  try {
    const data = await Customer.aggregate([
      { $match: {
        employee:new mongoose.Types.ObjectId(id),
        finalStatus:"Not Collected"
        
      } },
     
      {
        $group: {
          _id: {
            emi: "$collectionCount",
            finalStatus: "$finalStatus",
          },
          count: { $sum: 1 }, // Count each status
        },
      },
      
      {
        $group:{
          _id:"$_id.emi",
          datas:{
            $push:{
status:"$_id.finalStatus",
            count:"$count"
            }
            
          },
          totalCount:{$sum:"$count"}
        }
      },
      {
        $project:{
          _id:0,
          emi:"$_id",
          datas:1,
          totalCount:1,
        },
      }
    ]);
   
    // Transform data into a more readable format
const formattedData = data.reduce((result, item) => {
  const { emi, datas, totalCount } = item;
  result[emi] = {
    statuses: datas.reduce((acc, { status, count }) => {
      acc[status] = count;
      return acc;
    }, {}),
    totalCount,
  };
  return result;
}, {});


   
    res.status(200).json(formattedData);
    
  } catch (error) {
    console.log(error)
  }
}


export const mithraPincodeChart = async (req,res)=>{

  const { role, id } = req.user;


  try {
    const data = await Customer.aggregate([
      { $match: {
        employee:new mongoose.Types.ObjectId(id),
       
      } },
     
      {
        $group: {
          _id: {
            pincode: "$pincode",
            finalStatus: "$finalStatus",
          },
          count: { $sum: 1 }, // Count each status
        },
      },
      
      {
        $group:{
          _id:"$_id.pincode",
          datas:{
            $push:{
status:"$_id.finalStatus",
            count:"$count"
            }
            
          },
          totalCount:{$sum:"$count"}
        }
      },
      {
        $project:{
          _id:0,
          pincode:"$_id",
          datas:1,
          totalCount:1,
        },
      }
    ]);
   
    // Transform data into a more readable format
const formattedData = data.reduce((result, item) => {
  const { pincode, datas, totalCount } = item;
  result[pincode] = {
    statuses: datas.reduce((acc, { status, count }) => {
      acc[status] = count;
      return acc;
    }, {}),
    totalCount,
  };
  return result;
}, {});


  //  console.log(formattedData)
    res.status(200).json(formattedData);
    
  } catch (error) {
    console.log(error)
  }
}