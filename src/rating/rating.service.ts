import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class RatingService {
  constructor(private readonly ratingDb: PrismaService) {}
  async create(createRatingDto: CreateRatingDto) {
    try {
      const { productId, userId, ...ratingData } = createRatingDto;

      const createRating = await this.ratingDb.rating.create({
        data: {
          ...ratingData,
          user: { connect: { id: userId } },
          product: { connect: { id: productId } },
        },
      });

      return {
        massage: 'Succes to Rating Product',
        status: HttpStatus.OK,
        data: createRating,
      };
    } catch (error) {
      console.log(error);
      return {
        massage: 'Failed to create Rating',
        stasus: HttpStatus.BAD_GATEWAY,
      };
    }
  }

  async findAll() {
    try {
      const findAllRating = await this.ratingDb.rating.findMany();
      return {
        data: findAllRating,
      };
    } catch (error) {
      console.log(error);
      return {
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findOne(id: number) {
    try {
      const getOneRating = await this.ratingDb.rating.findFirst({
        where: {
          id,
        },
      });

      return {
        massage: 'Success',
        status: HttpStatus.OK,
        data: getOneRating,
      };
    } catch (error) {
      console.log(error);
      return {
        massage: 'Failed',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    try {
      const updateRating = await this.ratingDb.rating.update({
        where: { id: id },
        data: updateRatingDto,
      });

      return {
        massage: 'Success Update',
        status: HttpStatus.OK,
        data: updateRating,
      };
    } catch (error) {
      console.log(error);
      return {
        massage: 'Failed to update',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async remove(id: number) {
    try {
      const removeRating = await this.ratingDb.rating.delete({
        where: { id: id },
      });

      return {
        massage: 'Removed Rating',
        status: HttpStatus.OK,
        data: removeRating,
      };
    } catch (error) {
      console.log(error);
      return {
        massage: 'Failed to remove',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
