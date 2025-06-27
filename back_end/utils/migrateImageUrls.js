const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard"
);

const updateImageUrls = async () => {
  try {
    // Update any collections that contain image URLs
    // Example for sections collection
    const sectionsResult = await mongoose.connection.db
      .collection("sections")
      .updateMany(
        {
          // Find documents with localhost URLs
          $or: [
            { "data.imageUrl": { $regex: /localhost/ } },
            { "data.backgroundImage": { $regex: /localhost/ } },
            { "content.imageUrl": { $regex: /localhost/ } },
          ],
        },
        [
          {
            $set: {
              // Replace localhost URLs with just the filename
              "data.imageUrl": {
                $cond: {
                  if: { $type: "$data.imageUrl" },
                  then: {
                    $arrayElemAt: [{ $split: ["$data.imageUrl", "/"] }, -1],
                  },
                  else: "$data.imageUrl",
                },
              },
              "data.backgroundImage": {
                $cond: {
                  if: { $type: "$data.backgroundImage" },
                  then: {
                    $arrayElemAt: [
                      { $split: ["$data.backgroundImage", "/"] },
                      -1,
                    ],
                  },
                  else: "$data.backgroundImage",
                },
              },
              "content.imageUrl": {
                $cond: {
                  if: { $type: "$content.imageUrl" },
                  then: {
                    $arrayElemAt: [{ $split: ["$content.imageUrl", "/"] }, -1],
                  },
                  else: "$content.imageUrl",
                },
              },
            },
          },
        ]
      );

    console.log(`Updated ${sectionsResult.modifiedCount} section documents`);

    // Add more collections as needed
    // const usersResult = await mongoose.connection.db.collection('users').updateMany(...);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

updateImageUrls();
