
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/user.model.js";

export const register = async (req, res) => {
    try {

        // extract register details form req.body object
        const { username, email, password, role } = req.body;


        // check if any fields are empty
        if (!(username || email || password || role)) {
            return res.status(400).json({ msg: "All fields are required" })
        }

        // check if the user already exists
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" })
        }

        // generate salt
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user 
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        })

        // save new user to db
        await newUser.save();
        console.log(newUser)
        // generate jwt
        const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "2h" })

        // send success msg
        res.status(200).json({
            success: true,
            token,
            user: newUser
        })

    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        // extract login details
        const { email, password } = req.body;

        // check if the filed are empty
        if (!(email || password)) {
            return res.status(400).json({ msg: "All field are required" })
        }


        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // compare password using bcrypt.compare
        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(400).json({ msg: "Invalid credentials" })
        }

        // generate token
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" })

        res.status(200).json({
            token,
            success: true,
            msg: "Logged in successful",
            user
        })
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message })
    }
}

