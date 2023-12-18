import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class StockService {
  constructor(private readonly stockDb: PrismaService) {}
  async create(createStockDto: CreateStockDto) {
    try {
      const { productId, quantity, ...stockData } = createStockDto;

      const product = await this.stockDb.product.findFirst({
        where: { id: productId },
      });

      if (!product) {
        return {
          message: 'Product not found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      const updatedProduct = await this.stockDb.product.update({
        where: { id: productId },
        data: {
          quantity: product.quantity + quantity,
        },
      });

      const stock = await this.stockDb.stock.create({
        data: {
          ...stockData,
          product: {
            connect: {
              id: productId,
            },
          },
          quantity: quantity,
        },
      });

      return {
        message: 'Successfully created',
        status: HttpStatus.OK,
        data: { stock, updatedProduct },
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to create',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  findAll() {
    return `This action returns all stock`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  update(id: number, updateStockDto: UpdateStockDto) {
    return `This action updates a #${id} stock`;
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }
}
