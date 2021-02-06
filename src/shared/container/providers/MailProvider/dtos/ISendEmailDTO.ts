import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface ImailContact {
  name: string;
  email: string;
}

export default interface ISendEmailDTO {
  to: ImailContact;
  from?: ImailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
