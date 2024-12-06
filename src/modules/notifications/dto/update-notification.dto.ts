import { PartialType } from '@nestjs/swagger';

import { CreateNotificationDto } from '~starter/modules/notifications/dto/create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
