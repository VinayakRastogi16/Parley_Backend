import httpStatus from "http-status";
import bcrypt, {hash} from "bcrypt";
import { User } from "../models/user.model.js";
import crypto from "crypto"


const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please enter valid credentials!",
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.token = token;
    await user.save();

    return res.status(httpStatus.OK).json({ token });

  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong! ${e}`,
    });
  }
};


const register = async (req, res) => {
  const { name, username, password } = req.body;

  if(!name||!username||!password){
    return res.status(400).json({message:"Enter valid credentials!"})
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name:name,
        username: username,
        password: hashedPassword,
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({message:"User Registered successfully"})
  } catch (e){
    res.json({message:`Something went worng ${e}`})

  }
};


export {login,register}