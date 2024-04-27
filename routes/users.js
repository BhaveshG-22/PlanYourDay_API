import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../models/Users.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password, name } = req.body.formBody;
  console.log(req.body);

  const user = await userModel.findOne({ username });

  if (user) {
    console.log(user);
    return res.json({ message: "uaser already exist" });
  }
  console.log("reached line 16");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({ username, password: hashedPassword, name });

  await newUser.save();

  return res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body.formBody;
  console.log(username, password);
  let user;
  try {
    user = await userModel.findOne({ username });
  } catch (error) {
    console.error;
  }
  if (!user) {
    return res.json({ message: "user doesnt exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "username or password is incorrect" });
  }

  const token = jwt.sign({ id: user._id, user }, "secret");

  res.json({ token, userId: user._id });
});

router.get("/DeleteAll", async (req, res) => {
  try {
    // Delete all users entries
    const deleteAll = await userModel.deleteMany({});

    if (deleteAll.deletedCount === 0) {
      return res.status(404).json({ msg: "No Users found to delete" });
    }

    res.json({ msg: "All Users deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export { router as userRouter };
