import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

interface LoginDTO {
    email: string;
    password: string;
}

interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
}

export const UserService = {

    async createUser(data: CreateUserDTO) {

        const existingUser = await UserRepository.getUserByEmail(data.email);
        if (existingUser) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userId = await UserRepository.createUser({
            ...data,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: userId, email: data.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            id: userId,
            name: data.name,
            email: data.email,
            token,
        };
    },


    async loginUser(data: LoginDTO) {
        const user = await UserRepository.getUserByEmail(data.email);
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        };
    },


    async getAllUsers() {
        return await UserRepository.getAllUsers();
    },


    async getUserById(id: number) {
        const user = await UserRepository.getUserById(id);
        if (!user) throw new Error("User not found");
        return user;
    },


    async updateUser(id: number, data: UpdateUserDTO) {
        const user = await UserRepository.getUserById(id);
        if (!user) throw new Error("User not found");

        let updatedData: any = { ...data };


        if (data.password) {
            updatedData.password = await bcrypt.hash(data.password, 10);
        }

        return await UserRepository.updateUser(id, updatedData);
    },


    async deleteUser(id: number) {
        const user = await UserRepository.getUserById(id);
        if (!user) throw new Error("User not found");

        return await UserRepository.deleteUser(id);
    },
};
