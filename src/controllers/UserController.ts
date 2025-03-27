import User from "../models/User";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export class UserController {
    static createUser = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        try {
            const userExists = await User.findOne({ email });
            if (userExists) {
                res.status(409).json({ message: "El usuario ya existe" });
                return;
            }

            const hashedPassword = await hashPassword(password);
            const user = new User({
                name,
                email,
                password: hashedPassword
            });

            await user.save();
            res.status(201).json({ message: "Usuario creado" });

        } catch (error) {
            // console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {

            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            // Compare password
            const isPasswwordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswwordCorrect) {
                res.status(401).json({ message: "Contraseña incorrecta" });
                return;
            }
            // Generate token
            const token = generateJWT({ id: user.id });
            res.send(token);
        } catch (error) {
            // console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static profile = async (req: Request, res: Response) => {
        try {
            res.json(req.user);
            return;
        } catch (error) {
            // console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }

    static getUsers = async (req: Request, res: Response) => {
        try {
            const users = await User.find().select("-password");
            res.json(users);
        } catch (error) {
            // console.log(error);
            res.status(500).json("Internal server error");
        }
    }

    static getUser = async (req: Request, res: Response) => {
        res.send("get user");
    }

    static updateUser = async (req: Request, res: Response) => {
        res.send("update user");
    }

    static deleteUser = async (req: Request, res: Response) => {
        res.send("delete user");
    }
}
