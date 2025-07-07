// controllers/workerController.js

import { Worker } from "../models/worker.model.js";
import { uploadOnCloudinery } from "../utils/cloudnary.js";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerWorker = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      phone,
      gender,
      longitude,
      latitude,
      categories,
      experience,
      description,
    } = req.body;

    const existingWorker = await Worker.findOne({ email });
    if (existingWorker)
      return res.status(400).json({ message: "Worker already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Image upload logic
    let imageUrl = "";
    if (req.file) {
      const localPath = req.file.path;
      const result = await uploadOnCloudinery(localPath);
      fs.unlinkSync(localPath); // Remove local file
      imageUrl = result?.secure_url || "";
      console.log("image upload and return succefully");
    }

    const newWorker = new Worker({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      profileImage: imageUrl,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      categories,
      experience,
      description,
      address,
    });

    await newWorker.save();
    res.status(201).json({
      newWorker,
      message: "Worker registered successfully",
    });
  } catch (err) {
    console.log("error in registation in save : ", err);
    res.status(500).json({ message: "error in registerWorker ", err });
  }
};

export const loginWorker = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const worker = await Worker.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials, Password not match" });

    const token = jwt.sign({ id: worker._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    const { password: pwd, ...rest } = worker._doc;
    res.status(200).json({ token, worker: rest });
  } catch (err) {
    console.log("erro in login worker : ", err);
    res.status(500).json({ message: "error in login worker ", err });
  }
};

export const getWorkerByToken = async (req, res) => {
  try {
    const worker = await Worker.findById(req.userId).select("-password");
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch worker", error: err });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const { userId } = req.body;
    const worker = await Worker.findById({ userId }).select("-password");
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch worker", error: err });
  }
};


export const getNearbyWorkers = async (req, res) => {
  const { longitude, latitude, page = 1, limit = 20 } = req.query;
  if (!longitude || !latitude) {
    console.log("location required");
    return res
      .status(400)
      .json({ message: "Longitude and latitude are required" });
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const nearbyWorkers = await Worker.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      { $sort: { distance: 1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json({ workers: nearbyWorkers });
  } catch (error) {
    console.error("Geo fetch failed:", error);
    res.status(500).json({ message: "Failed to fetch nearby workers", error });
  }
};

export const getNearbyWorkersCategories = async (req, res) => {
  const { longitude, latitude, limit = 20,categories} = req.query;
  if (!longitude || !latitude) {
    console.log("location required");
    return res
      .status(400)
      .json({ message: "Longitude and latitude are required" });
  }
  try {
    const nearbyWorkers = await Worker.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      { $sort: { distance: 1 } },
      { $limit: parseInt(limit) },
    ]);

    if(categories=='All'){res.status(200).json({ workers: nearbyWorkers });}
    else{
    const fillterData = nearbyWorkers.filter((data)=>data.categories==categories);
    res.status(200).json({ workers: fillterData });
    }
  } catch (error) {
    console.error("Geo fetch failed:", error);
    res.status(500).json({ message: "Failed to fetch nearby workers", error });
  }
};

export const getNearbyWorkersSerach = async (req, res) => {
  const { longitude, latitude, limit = 20, search = "", category = "All" } = req.query;

  if (!longitude || !latitude) {
    return res
      .status(400)
      .json({ message: "Longitude and latitude are required" });
  }

  try {
    const nearbyWorkers = await Worker.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      { $sort: { distance: 1 } },
      { $limit: parseInt(limit) },
    ]);

    let filteredWorkers = nearbyWorkers;


    if (category !== "All") {
      filteredWorkers = filteredWorkers.filter((worker) =>
        worker.categories.some(
          (cat) => cat.toLowerCase() === category.toLowerCase()
        )
      );
    }

    if (search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i"); 

      filteredWorkers = filteredWorkers.filter((worker) => {
        return (
          regex.test(worker.name || "") ||
          (worker.categories || []).some((cat) => regex.test(cat)) ||
          (worker.subcategories || []).some((subcat) => regex.test(subcat)) ||
          regex.test(worker.description || "") ||
          regex.test(worker.address || "")
        );
      });
    }

    res.status(200).json({ workers: filteredWorkers });
  } catch (error) {
    console.error("Geo fetch failed:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch nearby workers", error });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const user = await Worker.findById(req.userId).select("-password"); // hide password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const SearchWorker = async (req, res) => {
  const { keyword, latitude, longitude } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "No keyword provided" });
  }

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    const words = keyword.trim().split(/\s+/);

    const orClauses = [];

    for (const word of words) {
      const regex = new RegExp(word, "i");

      orClauses.push({ name: { $regex: regex } });
      orClauses.push({ categories: { $regex: regex } });
      orClauses.push({ description: { $regex: regex } });
      orClauses.push({ address: { $regex: regex } });
      orClauses.push({ subcategories: { $regex: regex } });
    }

    const matchedWorkers = await Worker.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
          query: {
            $or: orClauses,
          },
        },
      },
      { $limit: 40 },
    ]);

    if (matchedWorkers.length > 0) {
      return res.json({ workers: matchedWorkers });
    }

    // Step 2 — Similar workers fallback
    const similarWorkers = await Worker.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
          query: {
            categories: { $regex: new RegExp(keyword, "i") },
          },
        },
      },
      { $limit: 20 },
    ]);

    return res.json({
      message: "No exact matches found, showing similar workers",
      workers: similarWorkers,
    });

  } catch (err) {
    console.error("SearchWorker Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



export const getSuggestions = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const regex = new RegExp(keyword, "i");

    const workers = await Worker.find({
      $or: [
        { name: { $regex: regex } },
        { categories: { $regex: regex } },
        { description: { $regex: regex } },
        { address: { $regex: regex } },
      ],
    }).limit(10);

    // Collect unique keywords from name, category, and description
    const suggestionSet = new Set();

    workers.forEach((worker) => {
      if (worker.name && regex.test(worker.name))
        suggestionSet.add(worker.name);
      if (worker.categories && regex.test(worker.categories))
        suggestionSet.add(worker.categories);
      if (worker.address && regex.test(worker.address))
        suggestionSet.add(worker.address);
      if (worker.subcategories && regex.test(worker.subcategories))
        suggestionSet.add(worker.subcategories);
      if (worker.description && regex.test(worker.description)) {
        const words = worker.description.split(" ");
        words.forEach((word) => {
          if (regex.test(word)) suggestionSet.add(word);
        });
      }
    });

    // Send only top 5 suggestions
    const suggestions = Array.from(suggestionSet).slice(0, 5);

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Suggestion Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getWorkerByRating = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and longitude required" });
  }

  try {
    const workers = await Worker.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance", // add distance in the result
          spherical: true,
          maxDistance: 10000, // within 10km radius (you can adjust)
        },
      },
      { $sort: { rating: -1 } }, // sorted by rating DESC
      { $limit: 10 }, // limit to top 10 workers
    ]);

    res.status(200).json(workers);
  } catch (error) {
    console.error("Geo search error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const rateWorker = async (req, res) => {
  const { workerId } = req.params;
  const { userRating } = req.body; // e.g., 4 or 5

  if (!userRating || userRating < 1 || userRating > 5) {
    return res.status(400).json({ message: "Invalid rating value" });
  }

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Update rating sum and count
    worker.ratingSum += userRating;
    worker.totalRatings += 1;

    // Update average
    worker.rating = (worker.ratingSum / worker.totalRatings).toFixed(1);

    await worker.save();

    res
      .status(200)
      .json({ message: "Rating submitted", rating: worker.rating });
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
