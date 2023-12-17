import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: PrismaService) {}

  async createAdmin(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await argon2.hash(createUserDto.password);

      const user = await this.dbService.users.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: hashedPassword,
          role: 'Admin',
        },
      });

      const token = jwt.sign({ userId: user.id }, 'secretKey', {
        expiresIn: '1h',
      });

      return {
        message: 'Successfully Create Data!',
        status: HttpStatus.OK,
        data: { user, token },
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed To Create Data!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await argon2.hash(createUserDto.password);

      const user = await this.dbService.users.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: user.id }, 'secretKey', {
        expiresIn: '1h',
      });

      return {
        message: 'Successfully Create Data!',
        status: HttpStatus.OK,
        data: { user, token },
      };
    } catch (error) {
      console.log(error.message);
      return {
        message: 'Failed To Create Data!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findAll() {
    try {
      const users = await this.dbService.users.findMany();
      return {
        message: 'Successfully Get Data!',
        status: HttpStatus.OK,
        data: { users },
      };
    } catch (error) {
      console.log(error);
      return { status: HttpStatus.BAD_REQUEST };
    }
  }

  async findOne(id: string) {
    try {
      const oneUser = await this.dbService.users.findUnique({
        where: {
          id,
        },
      });

      return {
        message: 'Successfully Get One Data!',
        status: HttpStatus.OK,
        data: { oneUser },
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed To Get One Data!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const { username, email, password, role, refreshToken } = updateUserDto;

      const hashedPassword = password ? await argon2.hash(password) : undefined;

      const updatedUser = await this.dbService.users.update({
        where: { id: userId },
        data: {
          username,
          email,
          password: hashedPassword,
          role: role,
          refreshToken,
        },
      });

      return {
        message: 'Successfully updated user!',
        status: HttpStatus.OK,
        data: updatedUser,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed to update user!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async remove(id: string) {
    try {
      const delUsers = await this.dbService.users.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Successfully Delete Data!',
        status: HttpStatus.OK,
        data: { delUsers },
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed To Delete Data!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.dbService.users.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const refreshToken = jwt.sign({ userId: user.id }, 'refreshSecretKey', {
        expiresIn: '7d',
      });

      await this.dbService.users.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return {
        message: 'Successfully logged in!',
        status: HttpStatus.OK,
        data: { user, refreshToken },
      };
    } catch (error) {
      console.log(error.message);
      return {
        message: 'Failed to log in',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
