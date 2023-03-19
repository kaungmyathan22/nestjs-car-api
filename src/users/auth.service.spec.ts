import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: ({ email, password }: CreateUserDto) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          useValue: fakeUsersService,
          provide: UsersService,
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create a new user with salted and hashed password', async () => {
    const user = await service.signup({ email: "asd@gmail.com", password: "23111" });
    expect(user.password).not.toEqual("23111");
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user sings up with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: "asdf", password: "111" } as User])
    expect(service.signup({ email: "asd@gmail.com", password: "23111" })).rejects.toThrow(
      BadRequestException
    );
  });
  it('throws an error if user sings in with email that is not in use', async () => {
    fakeUsersService.find = () => Promise.resolve([])
    expect(service.signin({ email: "asd@gmail.com", password: "23111" })).rejects.toThrow(
      BadRequestException
    );
  });
  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: "asdf", password: "111" } as User])
    expect(service.signin({ email: "asd@gmail.com", password: "23111" })).rejects.toThrow(
      BadRequestException
    );
  });
  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: "asdf", password: "1b4e15ae9ec276f3.1b954a9fdd904decf2589da6114fbb44acf224f7969d4cc1ed420c6514e08141" } as User])
    const user = await service.signin({ email: "asd@gmail.com", password: "23111" });
    expect(user).toBeDefined();
  });
});
