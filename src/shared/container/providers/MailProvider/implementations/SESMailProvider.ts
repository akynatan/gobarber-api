import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { inject, injectable } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendEmailDTO from '../dtos/ISendEmailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-2',
      }),
    });
    this.client = transporter;
  }

  public async sendEmail({
    to,
    from,
    subject,
    templateData,
  }: ISendEmailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

export default SESMailProvider;
