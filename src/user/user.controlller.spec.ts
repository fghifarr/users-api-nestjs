import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRespDto } from './dto/user-resp.dto';
import { UserUpdateDto } from './dto/user-update.dto';
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

  describe('register', () => {
    it('Should BAD REQUEST and send already have an account message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
      const userCreateReq = new UserCreateDto();
      userCreateReq.username = username;
      userCreateReq.password = password;
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

      expect(async () => {
        await userController.register(userCreateReq, mockResponse);
      }).rejects.toThrow('already have an account');
    });

    it('Should OK and send successful message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
      const userCreateReq = new UserCreateDto();
      userCreateReq.username = username;
      userCreateReq.password = password;
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
        .mockImplementation(() => Promise.resolve(null));
      jest
        .spyOn(userService, 'create')
        .mockImplementation(() => Promise.resolve(user));
      await userController.register(userCreateReq, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully created user: ' + user.username,
      });
    });
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

  describe('findById', () => {
    it('Should NOT FOUND and send cant find user by user id message', async () => {
      const mockResponse: any = {
        send: jest.fn(),
        json: jest.fn(),
        status: jest.fn(function () {
          return this;
        }),
      };

      jest
        .spyOn(userService, 'findById')
        .mockImplementation(() => Promise.resolve(null));

      expect(async () => {
        await userController.findById('1', mockResponse);
      }).rejects.toThrow("Can't find user with user id");
    });

    it('Should OK and send successful message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
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
        .spyOn(userService, 'findById')
        .mockImplementation(() => Promise.resolve(user));
      await userController.findById('1', mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(new UserRespDto(user));
    });
  });

  describe('update', () => {
    it('Should NOT FOUND and send cant find user by user id message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
      const userUpdateReq = new UserUpdateDto();
      userUpdateReq.username = username;
      userUpdateReq.password = password;
      const mockResponse: any = {
        send: jest.fn(),
        json: jest.fn(),
        status: jest.fn(function () {
          return this;
        }),
      };

      jest
        .spyOn(userService, 'findById')
        .mockImplementation(() => Promise.resolve(null));

      expect(async () => {
        await userController.update('1', userUpdateReq, mockResponse);
      }).rejects.toThrow("Can't find user with user id");
    });

    it('Should OK and send successful message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
      const userUpdateReq = new UserUpdateDto();
      userUpdateReq.username = username;
      userUpdateReq.password = password;
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
        .spyOn(userService, 'findById')
        .mockImplementation(() => Promise.resolve(user));
      jest.spyOn(userService, 'update').mockImplementation();
      await userController.update('1', userUpdateReq, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully updated user: ' + username,
      });
    });
  });

  describe('delete', () => {
    it('Should NOT FOUND and send cant find user by user id message', async () => {
      const mockResponse: any = {
        send: jest.fn(),
        json: jest.fn(),
        status: jest.fn(function () {
          return this;
        }),
      };

      jest
        .spyOn(userService, 'findById')
        .mockImplementation(() => Promise.resolve(null));

      expect(async () => {
        await userController.delete('1', mockResponse);
      }).rejects.toThrow("Can't find user with user id");
    });

    it('Should OK and send successful message', async () => {
      const username = 'usernameTest';
      const password = 'passwordTest';
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
        .spyOn(userService, 'findById')
        .mockImplementation(() => Promise.resolve(user));
      jest.spyOn(userService, 'delete').mockImplementation();
      await userController.delete('1', mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully deleted user: 1',
      });
    });
  });
});
