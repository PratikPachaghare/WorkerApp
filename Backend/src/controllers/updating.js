import mongoose from "mongoose";
import { Worker } from "../models/worker.model.js";
import { User } from "../models/user.model.js";

export const addDefaultFieldsToWorkers = async () => {
  try {
    const workers = await Worker.find({});

    let updatedCount = 0;

    for (const worker of workers) {
      let updated = false;
      if (worker.isWorker === undefined) {
    worker.isWorker = true;
    await worker.save();
    console.log(`✅ Updated worker: ${worker._id}`);
    updatedCount++;
  }

      if (updated) {
        await worker.save();
        updatedCount++;
      }
    }

    console.log(`✅ Updated ${updatedCount} worker(s) with missing default fields.`);
  } catch (error) {
    console.error("❌ Error updating workers:", error);
  } finally {
    mongoose.connection.close();
  }
};

export const addDefaultFieldsToUsers = async () => {
  try {
    const users = await User.find({
      isWorker: { $exists: false },
    });

    let updatedCount = 0;

    for (const user of users) {
      user.isWorker = false;
      await user.save();
      updatedCount++;
    }

    console.log(`✅ Updated ${updatedCount} user(s) with isWorker: false.`);
  } catch (error) {
    console.error("❌ Error updating users:", error);
  } finally {
    mongoose.connection.close();
  }
};
