import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  id: number;
  status: string;
  total: number;
  userId?: string;
  productId?: number;
  quantity?: number;
}
