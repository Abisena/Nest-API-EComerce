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

  async create(createUserDto: CreateUserDto) {
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

      const refreshToken = jwt.sign({ userId: user.id }, 'refreshSecretKey', {
        expiresIn: '7d',
      });

      await this.dbService.users.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return {
        message: 'Successfully Create Data!',
        status: HttpStatus.OK,
        data: { user, token, refreshToken },
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
      const user = await this.dbService.users.findMany();
      return {
        message: 'Successfully Get Data!',
        status: HttpStatus.OK,
        data: { user },
      };
    } catch (error) {
      console.log(error);
      return { status: HttpStatus.BAD_REQUEST };
    }
  }

  async findOne(id: number) {
    try {
      const oneUser = await this.dbService.users.findFirst({
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateUser = await this.dbService.users.update({
        where: { id },
        data: {
          ...updateUserDto,
        },
      });

      return {
        message: 'Successfully Update Data!',
        status: HttpStatus.OK,
        data: { updateUser },
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed To Update Data!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async remove(id: number) {
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
}
