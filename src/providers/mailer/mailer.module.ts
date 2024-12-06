import { Module } from '@nestjs/common';

import { MailerService } from '~starter/providers/mailer/mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
