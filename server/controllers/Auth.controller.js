// 62859005195-hr597m0g5jf0khahkli4rhcuo2ttoc41.apps.googleusercontent.com

import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import generateToken from "../utils/generateToken.js";
import MailTransporter from "../utils/MailTransporter.js";
import Student from "../models/Student.model.js";
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public




const authUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
        success: true,
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            role: user.role,
        },
        message: "User Logged in successfully",
    });
  } else {
    res.status(400).json({
        success: false,
        message: "Invalid email or password",
    })
    throw new Error("Invalid email or password");
  }
});

const LoginStudentGoogle = asyncHandler(async (req, res) => {
    try {
        const { email, name, phoneNumber,isVerified } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            generateToken(res, userExists._id);
            return res.status(201).json({
                success: true,
                user: {
                    _id: userExists._id,
                    email: userExists.email,
                    name: userExists.name,
                    phoneNumber: userExists.phoneNumber,
                    role: userExists.role,
                },
                message: "User Logged in successfully",
                isRegistered: true,
            });
        }

        const user = await User.create({
            email,
            name,
            phoneNumber,
            role: "student",
        });

        generateToken(res, user._id);
        return res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                role: user.role,
            },
            message: "User Logged in successfully",
            isRegistered: false,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

const registerStudent = asyncHandler(async (req, res) => {
    try {
        const {rollNo,branch,year,phoneNumber} = req.body;
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerSupervisor = asyncHandler(async (req, res) => {
  const {name, password, phoneNumber} = req.body;
  const email = req.body.email.toLowerCase();
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    email,
    name,
    password: "DefualtPassword",
    phoneNumber,
    role: "supervisor",
  });

  await mailSuperVisor(email);

  if (user) {
    res.status(201).json({
      success: true,
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            role: user.role,
        },
        message: "User Registered successfully",
    });
  } else {
    res.status(400).json({
        success: false,
        message: "Invalid user data",
    })
    throw new Error("Invalid user data");
  }
});

const mailSuperVisor = asyncHandler(async (email) => {
    // Send email to the supervisor to set a password
    const user = await User.findOne({ email });
    if (!user) {
        return "User does not exist";
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });



    var transporter = MailTransporter;
    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Set a password",
        text: `http://localhost:3000/set-password/${user._id}/${token}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw new Error("Error sending email");
        } else {
            return "Mail sent Successfully";
        }
    }
    );
});
// @desc  Logout user
// @route POST /api/users/logout
// @access Private

 
// @desc  Get user profile
// @route GET /api/users/profile
// @access Private

const forgetpassword = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
        success: false,
        message: "User does not exist",
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
  var transporter = MailTransporter;
  var mailOptions = {
    from: "Jashan.maybe76@gmail.com",
    to: email,
    subject: "Reset Password Link",
    text: `http://localhost:5173/reset-password/${user._id}/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error("Error sending email");
    } else {
      return res.status(200).json({
            success: true,
            message: "Mail sent Successfully",
      })
    }
  });
});

const resetpassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { id, token } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.send({ 
        success: false,
        message: "User does not exist" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //how to verify the expiry date

  if (decoded) {
    try {
      // Hash the new password before updating it in the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user's password with the hashed password
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      return res.status(200).json({
            success: true,
            message: "Password reset successfully",
      })
    } catch (err) {
      return res.status(400).json({
            success: false,
            message: "Error resetting password",
      })
    }
  } else {
    return res.status(400).json({
        success: false,
        message: "Invalid Token",
    });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

export { authUser, LoginStudentGoogle,registerSupervisor, logoutUser, forgetpassword, resetpassword  };
