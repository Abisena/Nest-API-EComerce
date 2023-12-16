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

    // Transaksi database menggunakan Prisma untuk memastikan keselamatan transaksi
    const createdOrder = await this.prisma.$transaction(async (prisma) => {
      // Buat order
      const order = await prisma.order.create({
        data: {
          productId,
          quantity,
          total,
          userId,
          status: 'pending',
        },
      });

      // Kurangi jumlah produk di database setelah order berhasil dibuat
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
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
