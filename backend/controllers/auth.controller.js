import User from "../models/user.model.js";
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { errorHandler } from "../utils/error.js";

    export const signin =async (req,res,next)=>{
        const {mobile,password} = req.body;
        // console.log(process.env.JWT_SECRET)
        try {
            const validUser = await User.findOne({mobile});
            // console.log(validUser);
            if(!validUser) return next(errorHandler(404,"User not found!"));
            // const validPassword =await bcrypt.compare(password,validUser.password);
            const validPassword = password === validUser.password;
            // console.log(validPassword)
            if(!validPassword) return next(errorHandler(401,"Wrong Credentials!"));
             // Generate access token (short-lived)
        const accessToken = jwt.sign(
            { id: validUser._id, role: validUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Short-lived access token
        );

        // Generate refresh token (long-lived)
        const refreshToken = jwt.sign(
            { id: validUser._id, role: validUser.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } // Long-lived refresh token
        );

            // const {password:pass,...rest}=validUser._doc;
           
            // res.status(200).json({ token,user:rest});
              // Send tokens to client (access token in body, refresh token in cookie)
        res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevent client-side JS access
            secure: process.env.NODE_ENV === 'production', // Send over HTTPS in production
            sameSite: 'strict',
            path: '/api/auth/refresh-token',
        })
        .status(200)
        .json({ accessToken, user: validUser._doc });
           
        } catch (error) {
            next(error);
        }
    }

    // Refresh token controller
export const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized: No refresh token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

// Logout controller
export const signout = (req, res) => {
    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
    res.status(200).json({ message: "User logged out successfully" });
};
