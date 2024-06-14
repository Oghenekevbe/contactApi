const asyncHandler = require("express-async-handler"); //async forwards the errors to the middleware which is where error handler is
const User = require("../models/userModel");

const bcrypt = require('bcryptjs');
const { timeStamp } = require("console");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");


//@desc Register a user
//@route POST /api/user
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("This user already exists");
    }
    // Correctly hash the provided password
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await User.create({
        username,
        email,
        password: hashedPassword // Store the hash as 'password' field
    });

    if (user) {
        res.status(201).json({
            message: "User successfully created", user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});


//@desc Login a user
//@route POST /api/user
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email });
    const isMatch = bcrypt.compareSync(password, user.password);

    if (user && isMatch) {

        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15min" }
        );
        res.status(200).json({ message: "User successfully logged in", "accessToken": accessToken });

    } else {
        res.status(401);
        throw new Error("User not found. Email or Password is not valid");
    }


}
);
//@desc Current user info
//@route GET /api/user
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
}
);


module.exports = {
    registerUser, loginUser, currentUser
};