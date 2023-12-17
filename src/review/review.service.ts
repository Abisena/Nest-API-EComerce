import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewDb: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const { productId, ...reviewData } = createReviewDto;

      const createReview = await this.reviewDb.review.create({
        data: {
          ...reviewData,
          product: { connect: { id: productId } },
        },
      });

      return {
        massage: 'Successfully created Riview Producr',
        status: HttpStatus.OK,
        data: { createReview },
      };
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this.reviewDb.review.findMany();
  }

  async getRiviewOne(productId: number) {
    try {
      const getOneReview = await this.reviewDb.review.findMany({
        where: { productId: productId },
      });

      return {
        massage: 'Succes Getting Riview',
        status: HttpStatus.OK,
        data: { getOneReview },
      };
    } catch (error) {
      console.log(error);
      return {
        massage: 'Failed to get one review',
        staus: HttpStatus.BAD_GATEWAY,
      };
    }
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.reviewDb.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  remove(id: number) {
    return this.reviewDb.review.delete({
      where: { id },
    });
  }
}
