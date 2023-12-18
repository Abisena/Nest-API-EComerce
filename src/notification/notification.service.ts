import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private readonly notifDb: PrismaService) {}
  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const { userId, ...notifData } = createNotificationDto;

      const createNotif = await this.notifDb.notification.create({
        data: {
          ...notifData,
          user: { connect: { id: userId } },
        },
      });

      return {
        massage: 'Succes to Rating Product',
        status: HttpStatus.OK,
        data: createNotif,
      };
    } catch (error) {
      console.log(error);
      return {
        massage: 'Failed to Notification',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findAll() {
    try {
      const allNotifications = await this.notifDb.notification.findMany();
      return {
        massage: 'Succes to get All notifications',
        status: HttpStatus.OK,
        data: { allNotifications },
      };
    } catch (error) {
      console.log(error);
      return {
        massage: 'Failed to get all notifications',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findOne(id: number) {
    try {
      const getOneNotification = await this.notifDb.notification.findFirst({
        where: {
          id,
        },
      });

      return {
        massage: 'Success To Get One Notification',
        status: HttpStatus.OK,
        data: { getOneNotification },
      };
    } catch (error) {
      console.log(error);
      return {
        massage: 'Failed To Get One Notification',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
