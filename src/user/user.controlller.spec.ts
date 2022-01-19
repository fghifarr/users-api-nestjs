import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const mockRepository = jest.fn;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('login', () => {
    it('Should BAD REQUEST and send cant find user by username message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
      const userLoginReq = new UserLoginDto();
      userLoginReq.username = username;
      userLoginReq.password = password;
      const mockResponse: any = {
        send: jest.fn(),
        json: jest.fn(),
        status: jest.fn(function () {
          return this;
        }),
      };

      jest
        .spyOn(userService, 'findByUsername')
        .mockImplementation(() => Promise.resolve(null));

      expect(async () => {
        await userController.login(userLoginReq, mockResponse);
      }).rejects.toThrow("Can't find user with username");
    });

    it('Should BAD REQUEST and send cant find user by username message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
      const userLoginReq = new UserLoginDto();
      userLoginReq.username = username;
      userLoginReq.password = password;
      const user = new User();
      user.username = username;
      user.password = password;
      const mockResponse: any = {
        send: jest.fn(),
        json: jest.fn(),
        status: jest.fn(function () {
          return this;
        }),
      };

      jest
        .spyOn(userService, 'findByUsername')
        .mockImplementation(() => Promise.resolve(user));
      jest
        .spyOn(userService, 'login')
        .mockImplementation(() => Promise.resolve(null));

      expect(async () => {
        await userController.login(userLoginReq, mockResponse);
      }).rejects.toThrow('Invalid username / password');
    });

    it('Should OK and send successful message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
      const userLoginReq = new UserLoginDto();
      userLoginReq.username = username;
      userLoginReq.password = password;
      const user = new User();
      user.username = username;
      user.password = password;
      const mockResponse: any = {
        send: jest.fn(),
        json: jest.fn(),
        status: jest.fn(function () {
          return this;
        }),
      };

      jest
        .spyOn(userService, 'findByUsername')
        .mockImplementation(() => Promise.resolve(user));
      jest
        .spyOn(userService, 'login')
        .mockImplementation(() => Promise.resolve(user));
      await userController.login(userLoginReq, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully logged in as: ' + user.username,
      });
    });
  });
});
