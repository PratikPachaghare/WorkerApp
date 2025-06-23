import mongoose from "mongoose";
import { Worker } from "../models/worker.model.js";

export const addDefaultRatingFields = async () => {
  try {
    const workers = await Worker.find({
      $or: [
        { rating: { $exists: false } },
        { totalRatings: { $exists: false } },
        { ratingSum: { $exists: false } },
      ],
    });

    let updatedCount = 0;

    for (const worker of workers) {
      let updated = false;

      if (worker.rating === undefined) {
        worker.rating = 1;
        updated = true;
      }
      if (worker.totalRatings === undefined) {
        worker.totalRatings = 0;
        updated = true;
      }
      if (worker.ratingSum === undefined) {
        worker.ratingSum = 0;
        updated = true;
      }

      if (updated) {
        await worker.save();
        updatedCount++;
      }
    }

    console.log(`✅ Updated ${updatedCount} worker(s) with missing rating fields.`);
  } catch (error) {
    console.error("❌ Error updating workers:", error);
  } finally {
    mongoose.connection.close();
  }
};
