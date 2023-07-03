import * as uuid from 'uuid';
import { Test } from '@nestjs/testing';
import { CreateUserHandler } from './create-user.handler';
import { UserFactory } from '../../domain/user.factory';
import { UserRepository } from '../../infra/db/repository/user.repository';
import { CreateUserCommnad } from './create-user.command';
import { UnprocessableEntityException } from '@nestjs/common';

jest.mock('uuid');
jest.spyOn(uuid, 'v1').mockReturnValue('0000-0000-0000-0000');

describe('CreateUserHandler', () => {
  let createUserHandler: CreateUserHandler;
  let userFactory: UserFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: UserFactory,
          useValue: {
            create: jest.fn(),
          }
        },
        {
          provide: 'UserRepository',
          useValue: {
            save: jest.fn(),
          }
        }
      ],
    }).compile();

    createUserHandler = module.get(CreateUserHandler);
    userFactory = module.get(UserFactory);
    userRepository = module.get('UserRepository');
  });

  const username = 'YOUR_NAME';
  const email = 'YOUR_EMAIL@gmail.com';
  const password = 'pass1234';
  const signupVerifyToken = uuid.v1();

  describe('execute', () => {
    it ('should execute CreateUserCommand', async () => {
      // Given
      userRepository.findByEmail = jest.fn().mockResolvedValue(null);

      // When
      await createUserHandler.execute(new CreateUserCommnad(email, username, password));

      // Then
      expect(userRepository.save).toBeCalledWith(
        email,
        username,
        password,
        signupVerifyToken,
      );

      expect(userFactory.create).toBeCalledWith(
        email,
        username,
        password,
        signupVerifyToken,
      );
    });

    it('should throw UnprocessableEntityException when user exists', async () => {
      // Given
      userRepository.findByEmail = jest.fn().mockResolvedValue({
        email,
        username,
        password,
        signupVerifyToken,
      });

      // When

      // Then
      await expect(createUserHandler.execute(new CreateUserCommnad(email, username, password)))
        .rejects
        .toThrowError(UnprocessableEntityException);
    });
  });
});
