import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { productId, quantity, userId } = createOrderDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.quantity < quantity) {
      throw new NotFoundException(
        'Not enough quantity available for the product',
      );
    }

    const total = product.price * quantity;

    try {
      const createdOrder = await this.prisma.$transaction(async (prisma) => {
        const order = await prisma.order.create({
          data: {
            productId,
            quantity,
            total,
            userId,
            status: 'pending',
          },
        });

        await prisma.product.update({
          where: { id: productId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        return order;
      });

      return createdOrder;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create order');
    }
  }

  // buat all orderan
  async findAll() {
    try {
      const orders = await this.prisma.order.findMany();
      return {
        message: 'Successfully Get Data!',
        status: HttpStatus.OK,
        data: { orders },
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed To Get Data!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  // buat one order
  async findOne(id: number) {
    try {
      const getOneOrder = await this.prisma.order.findUnique({
        where: {
          id,
        },
      });

      return {
        message: 'Successfully Get One Data!',
        status: HttpStatus.OK,
        data: { getOneOrder },
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed To Get One Data!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  // update orderans
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const updateOrders = await this.prisma.order.update({
        where: {
          id,
        },
        data: {
          ...updateOrderDto,
        },
      });

      return {
        message: 'Successfully Update Data!',
        status: HttpStatus.OK,
        data: { updateOrders },
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed To Update Data!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  // delete orderan
  async remove(id: number) {
    try {
      const removeOrders = await this.prisma.order.delete({
        where: {
          id,
        },
      });
      return {
        message: 'Successfully Delete Data!',
        status: HttpStatus.OK,
        data: { removeOrders },
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
