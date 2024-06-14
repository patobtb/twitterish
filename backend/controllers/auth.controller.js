import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {userName, fullName, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"});
        };

        const existingUser = await User.findOne({userName});
        if(existingUser){
            return res.status(400).json({error: "userName is already taken"});
        };

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error: "email is already taken"});
        };

        if(password.length < 6){
            return res.status(400).json({error: "Password must be at least 6 characters"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            userName,
            fullName,
            password: hashedPassword,
            email
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                userName: newUser.userName,
                fullName: newUser.fullName,
                email: newUser.email,
                follwers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        }else{
            res.status(400).json({error: "Invalid user data"});
        }
    } catch (error) {
        console.log("error in signup controller: ", error.message);
        res.status(500).json({error: "Internal server error in signup controller"});
    }
};

export const login = async (req, res) => {
    try {
        const {userName, password} = req.body;
        const user = await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } catch (error) {
        console.log("error in login controller: ", error.message);
        res.status(500).json({error: "Internal server error in login controller"});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("error in logout controller: ", error.message);
        res.status(500).json({error: "Internal server error in logout controller"});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getMe controller: ", error.message);
        res.status(500).json({error: "Internal server error in getMe controller"});
    }
};

