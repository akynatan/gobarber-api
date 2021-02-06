import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokenRepository = new FakeUsersTokenRepository();
    fakeMailProvider = new FakeMailProvider();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUsersTokenRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@dev',
      password: '123456',
    });
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@dev',
    });

    await expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existings user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUsersTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@dev',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@dev',
    });

    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
