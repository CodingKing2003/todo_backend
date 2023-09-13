import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendCookie } from "../utils/features.js";
import { isAuthenticated } from "../middlewares/auth.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllUsers = async (req, res) => {};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if(user)  return next(new ErrorHandler("User Already Exists",404));

  

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  sendCookie(user, res, "Registered Successfully", 201);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user=await User.findOne({email}).select("+password");

  if(!user)  return next(new ErrorHandler("Invalid Email or Password",404));

    const isMatch=await bcrypt.compare(password,user.password);
    
    if(!isMatch)  return next(new ErrorHandler("Invalid Email or Password",404));

  sendCookie(user,res,`Welcome Back ,${user.name}`,200)

};

export const getMyProfile =  (req, res) => {

  res.status(200).json({
    success:true,
    user:req.user,
  })
  
};

export const logout=(req,res)=>{

  res.status(200).cookie("token",null,{
    expires:new Date(Date.now()),
    sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Develpoment" ? false : true,
  }).json({
    success:true,
    user:req.user,
  })

}
