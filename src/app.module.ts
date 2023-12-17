import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { UsersService } from './users/users.service';
import { OrderModule } from './order/order.module';
import { UsersController } from './users/users.controller';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { PrismaService } from './prisma/prisma.service';
import { ReviewModule } from './review/review.module';
import { StockModule } from './stock/stock.module';
import { RatingModule } from './rating/rating.module';
import { NotificationModule } from './notification/notification.module';
import { TaxModule } from './tax/tax.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [PrismaModule, UsersModule, OrderModule, ProductModule, ReviewModule, StockModule, RatingModule, NotificationModule, TaxModule, ShippingModule],
  controllers: [
    AppController,
    UsersController,
    ProductController,
    OrderController,
  ],
  providers: [
    AppService,
    UsersService,
    ProductService,
    OrderService,
    PrismaService,
  ],
})
export class AppModule {}
