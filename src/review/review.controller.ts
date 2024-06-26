import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/product')
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get('/all-reviews')
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('/review/:id')
  findOne(@Param('id') id: string) {
    return this.reviewService.getRiviewOne(+id);
  }

  @Patch('/review/:id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete('/review/:id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
