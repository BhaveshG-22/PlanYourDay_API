import express from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/Users.js";
import { blogModel } from "../models/Blog.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

router.get("/getUserData", async (req, res) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.id;
    // console.log(userId);
    const user = await userModel.findOne({ _id: userId });
    // console.log("Line 28", user.username);

    // Create a new object without the 'password' property
    const userDataToSend = { ...user.toObject() };
    delete userDataToSend.password;

    return res.json({ user: userDataToSend });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
});
router.get("/getAllBlogs", async (req, res) => {
  try {
    const Blogs = await blogModel.find({}).sort({ _id: -1 });
    // console.log(Blogs);
    return res.json({ Blogs });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ message: "Server Error" });
  }
});
router.get("/blog/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const Blog = await blogModel.findOne({ _id: id });
    console.log(Blog);
    return res.json({ Blog });
  } catch (error) {
    console.error();
  }

  res.send(id);
});

router.post("/newBlog", async (req, res) => {
  console.log(req.body);
  const newBlog = new blogModel(req.body.data);
  await newBlog.save();
  res.send(newBlog);
});
router.put("/editBlog/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, body, thumbnailUrl } = req.body.data;
  console.log(req.body.data);

  try {
    const existingBlog = await blogModel.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ msg: "Blog Not Found" });
    }

    existingBlog.title = title;
    existingBlog.description = description;
    existingBlog.body = body;
    existingBlog.thumbnailUrl = thumbnailUrl;

    await existingBlog.save();
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ msg: "internal Server Error" });
  }

  res.send("newBlog");
});

router.delete("/editBlog/:id", async (req, res) => {
  const { token } = req.headers;
  const id = req.params.id;
  try {
    const Blog = await blogModel.findById(id);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Extract the usernames from the objects
    const decodedTokenUsername = decodedToken.user.username;
    const blogUsername = Blog.username;

    if (decodedTokenUsername !== blogUsername) {
      return res.status(401).json({ msg: "Action not Permitted" });
    } else {
      const resp = await blogModel.findByIdAndDelete(id);

      if (!resp) {
        return res.status(404).json({ msg: "Blog Not Found", resp });
      }

      res.json({ msg: "Blog deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/editBlog/DeleteAll", async (req, res) => {
  try {
    // Delete all blog entries
    const deletedBlogs = await blogModel.deleteMany({});

    if (deletedBlogs.deletedCount === 0) {
      return res.status(404).json({ msg: "No blogs found to delete" });
    }

    res.json({ msg: "All blogs deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export { router as dataRouter };
