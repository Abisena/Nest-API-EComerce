import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { UsersService } from './users/users.service';
import { OrderModule } from './order/order.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [PrismaModule, UsersModule, OrderModule, ProductModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
