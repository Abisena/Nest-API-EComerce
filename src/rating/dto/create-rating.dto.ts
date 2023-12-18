import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
