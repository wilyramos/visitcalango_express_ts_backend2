import { Request, Response, NextFunction } from "express";
import type { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import User from "../models/User";


declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization // Bearer token
    if (!bearer) {
        res.status(401).json("No token provided");
        return;
    }
    const token = bearer.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(typeof decoded === "object" && decoded.id) {
            const user = await User.findById(decoded.id).select("_id name email ");
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).json("User not found");
                return;
            }
        }
    } catch (error) {
        // console.log(error);
        res.status(500).json("Token now valido");
    }
};

export default verifyAuth;