import path from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';

import { AllConfigType } from '~starter/config/config.type';
import { MailData } from '~starter/providers/mail/interfaces/mail-data.interface';
import { MailerService } from '~starter/providers/mailer/mailer.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  private async prepareEmailContent(i18nCore: string): Promise<any> {
    const i18n = I18nContext.current();
    const productName = this.configService.get('app.name', { infer: true });
    const currentYear = new Date().getFullYear();

    const keys = [
      'emailTitle',
      'greeting',
      'body',
      'cta',
      'thanks_1',
      'thanks_2',
      'footer_1',
      'footer_2',
    ].map((key) => {
      if (key === 'emailTitle') {
        function convertToKebabCase(str: string) {
          return str.replace(/-([a-z])/g, (_match, group1) =>
            group1.toUpperCase(),
          );
        }
        return `common.${convertToKebabCase(i18nCore)}`;
      }

      return `${i18nCore}.${key.replace(/_/g, '')}`;
    });

    const translations = await Promise.all(
      keys.map((key) => i18n.t(key, { args: { productName, currentYear } })),
    );

    return Object.fromEntries(
      keys.map((key, index) => {
        if (key.split('.')[0] === 'common') {
          return ['emailTitle', translations[index]];
        }
        return [key.split('.')[1], translations[index]];
      }),
    );
  }

  private async sendEmail({
    mailData,
    i18nCore,
    urlPath,
  }: {
    mailData: MailData<any>;
    i18nCore: string;
    urlPath?: string;
  }): Promise<void> {
    const content = await this.prepareEmailContent(i18nCore);

    const domain = this.configService.getOrThrow('app.frontendDomain', {
      infer: true,
    });
    const url =
      urlPath && urlPath.includes('mailto:')
        ? urlPath
        : urlPath
          ? new URL(`${domain}${urlPath}`)
          : domain;

    if (urlPath && typeof url !== 'string') {
      url.searchParams.set('hash', mailData.data.hash);
      url.searchParams.set('language', I18nContext.current().lang);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: content.emailTitle,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'providers',
        'mail',
        'mail-templates',
        'template.hbs',
      ),
      context: {
        ...content,
        app_domain: domain,
        cta_url: url.toString(),
        user_name: mailData.userName,
      },
    });
  }

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    await this.sendEmail({
      mailData,
      i18nCore: 'confirm-email',
      urlPath: '/confirm-email',
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>): Promise<void> {
    await this.sendEmail({
      mailData,
      i18nCore: 'reset-password',
      urlPath: '/reset-password',
    });
  }

  async changeEmail(mailData: MailData<{ hash: string }>): Promise<void> {
    await this.sendEmail({
      mailData,
      i18nCore: 'change-email',
      urlPath: '/change-email',
    });
  }

  async confirmEmailChange(mailData: MailData<never>): Promise<void> {
    await this.sendEmail({
      mailData,
      i18nCore: 'confirm-email-change',
    });
  }

  async deleteAccount(mailData: MailData<{ id: string }>): Promise<void> {
    const defaultEmail = this.configService.get('mail.defaultEmail', {
      infer: true,
    });
    await this.sendEmail({
      mailData,
      i18nCore: 'delete-account',
      urlPath: `mailto:${defaultEmail}?subject=ID: ${mailData.data.id}`,
    });
  }

  async welcomeEmail(mailData: MailData<never>): Promise<void> {
    await this.sendEmail({
      mailData,
      i18nCore: 'welcome-email',
    });
  }
}
