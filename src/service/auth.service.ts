import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import Env from "../configs/config";
import { AppDataSource } from "../data-source";
import RegisterDto from "../dto/user/create.dto";
import LoginDto from "../dto/user/login.dto";
import { Role } from "../entity/role.entity";
import { User } from "../entity/user.entity";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASS_REGEX = /^(?=.*\d).{8,16}$/;
const NAME_REGEX = /^[a-z ,.'-]+$/i;

export default class AuthService {

    private readonly userRepository: Repository<User>;
    private readonly roleRepository: Repository<Role>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.roleRepository = AppDataSource.getRepository(Role);
    }

    public async login(data: LoginDto) {

        if (data.username != null && !EMAIL_REGEX.test(data.username)) {
            throw new Error('Email not valid');
        }

        if (!PASS_REGEX.test(data.password)) {
            throw new Error('Invalid password (must be length 8 - 16 and include 1 number at least)');
        }

        const user = await this.userRepository.createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .where("user.username = :username", { username: data.username })
            .getOne();

        if (user) {
            if (AuthService.comparePassword(data.password, user.password)) {
                const authenticatedUser = {
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    picture: user.picture,
                    role: user.role
                };

                return jwt.sign(authenticatedUser, Env.key, {
                    algorithm: "HS512",
                    expiresIn: "3d"
                });

            } else {
                throw Error("Invalid password!");
            }
        } else {
            throw Error('User not found!');
        }
    }

    private static comparePassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    private static cryptPassword(password: string): string {
        const salt = bcrypt.genSaltSync(12);
        return bcrypt.hashSync(password, salt);
    }

    public async register(data: RegisterDto) {

        if (data.username != null && !EMAIL_REGEX.test(data.username)) {
            throw new Error('Username must be a valid email');
        }

        if (!PASS_REGEX.test(data.password)) {
            throw new Error('Invalid password (must be length 8 - 16 and include 1 number at least)');
        }

        if (!NAME_REGEX.test(data.firstname) || !NAME_REGEX.test(data.lastname)) {
            throw new Error('Invalid name (must be alphabetic characters)');
        }

        const user = await this.userRepository.createQueryBuilder("user")
            .where("user.username = :username", { username: data.username })
            .getOne();

        if (user) {
            throw Error("Username already taken!");
        } else {

            const role = await this.roleRepository.createQueryBuilder('role')
                .where("role.name = :name", { name: 'User' })
                .getOne();

            if (!role)
                throw Error("Role not found!");

            const bcryptPassword = AuthService.cryptPassword(data.password);
            data.password = bcryptPassword;
            data.role = role;
            const userAdded = await this.userRepository.save(data);
            return userAdded;
        }
    }
}