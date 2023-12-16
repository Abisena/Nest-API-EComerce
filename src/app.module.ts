import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { UsersService } from './users/users.service';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [PrismaModule, UsersModule, ProductsModule, OrderModule, ProductModule],
  controllers: [AppController, UsersModule],
  providers: [AppService, UsersService],
})
export class AppModule {}
