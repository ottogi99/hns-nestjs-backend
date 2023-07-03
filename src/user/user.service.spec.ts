import { Test } from '@nestjs/testing';
import { UserFactory } from "./domain/user.factory";
import { UserService } from "./user.service"
import { EventBus } from '@nestjs/cqrs';
import { User } from './domain/user';
import { UserEventsHandler } from './application/event/user-events.handler';

// describe('UserService', () => {
//   const userService: UserService = new UserService();

//   describe('create', () => {
//     it('should create user', () => {
//       // Given

//       // When

//       // Then
//     });

//     it('should thorw error when user aleady exist', () => {
//       // Given

//       // When

//       // Then
//     })
//   })
// });

describe('UserFactory', () => {
  let userFactory: UserFactory;
  let eventBus: jest.Mocked<EventBus>;

  beforeAll(async() => {
    const module = await Test.createTestingModule({
      providers: [
        UserFactory,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          }
        },
      ]
    }).compile();

    userFactory = module.get(UserFactory);
    eventBus = module.get(EventBus);
  })

  describe('create', () => {
    it('should create user', () => {
      // Given

      // When
      const user = userFactory.create(
        'YOUR_EMAIL@gmail.com',
        'YOUR_NAME',
        'pass1234',
        'signup-verify-token',
      );

      // Then
      const expected = new User(
        'YOUR_EMAIL@gmail.com',
        'YOUR_NAME',
        'pass1234',
        'signup-verify-token',
      );
      
      expect(expected).toEqual(user); // UserFactory.create를 통해 생성한 User객체가 원하는 객체와 맞는지 검사합니다.
      expect(eventBus.publish).toBeCalledTimes(1);  // 이 과장에서 EventBus.publish 함수가 한 번 호출되었는지 판단합니다.
    });
  });

  describe('reconstitue', () => {
    it('should reconstitue user', () => {
      // Given

      // When
      const user = userFactory.create(
        'YOUR_EMAIL@gmail.com',
        'YOUR_NAME',
        'pass1234',
        'signup-verify-token',
      );

      // Then
      const expected = new User(
        'YOUR_EMAIL@gmail.com',
        'YOUR_NAME',
        'pass1234',
        'signup-verify-token',
      );

      expect(expected).toEqual(user);
    });
  });
});