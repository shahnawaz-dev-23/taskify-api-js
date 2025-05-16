const dotenv = require('dotenv');
const User = require('../models/User');
const JWT = require('jsonwebtoken');

dotenv.config();

exports.getUsers = async (request, response) => {
    try {
        // Get page and limit from query params or set default
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 25;
        const skip = (page - 1) * limit;

        users = await User.find()
            .select('-password -__v')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total_users = await User.countDocuments();

        response.status(200).json({
            page,
            limit,
            total_users,
            total_pages: Math.ceil(total_users / users),
            users
        });
    } catch (error) {
        response.status(500).json({
            status: false,
            message: error.message
        });
    }
}

exports.userSignup = async (request, response) => {
    try {
        const { first_name, last_name, email, phone_number, password } = request.body

        // Check if user exists
        existing_user = await User.findOne({ email });

        if (existing_user) {
            return response.status(400).json({
                status: false,
                message: "User already exists"
            });
        }

        // Create New User
        const newUser = new User({ first_name, last_name, email, phone_number, password });
        await newUser.save();

        // Create JWT Token
        const jwt_token = JWT.sign(
            { id: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        response.status(201).json({
            status: true,
            message: "User created successfully",
            token: jwt_token,
            user: {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                full_name: newUser.full_name,
                phone_number: newUser.phone_number,
                email: newUser.email,
                date_joined: newUser.date_joined
            }
        });

    } catch (error) {
        response.status(500).json({
            status: false,
            message: error.message
        });
    }
}