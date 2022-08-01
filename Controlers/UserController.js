const AdminUser = require("../Models/AdminUserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async(req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).send("Please Fill All The Details")
        }
        const existingUser = await AdminUser.findOne({ email });
        if (existingUser) {
            return res.status(402).send("AdminUser Already Exists. Please Login to continue")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await new AdminUser({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save();
        res.status(201).send(newUser)

    } catch (error) {
        res.status(500).send(error);
    }
}

exports.loginUser = async(req, res) => {
    const { email, password } = req.body;
    const expiry = parseInt(process.env.JWT_EXPIRY);
    try {
        const user = await AdminUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Incorrect email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch, user);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        } else {
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY)
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + expiry),
                maxAge: expiry,
                sameSite: 'strict',
                secure: true,
                httpOnly: true
            }).status(200).json({ message: 'Login successfull', expiresIn: expiry });
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

exports.logoutUser = async(req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).send("user logged out")
    } catch (error) {
        res.status(500).send(error)
    }
}