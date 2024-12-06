import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MailService } from '~starter/providers/mail/mail.service';
import { MailerModule } from '~starter/providers/mailer/mailer.module';

@Module({
  imports: [ConfigModule, MailerModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
