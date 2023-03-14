import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }

  @Get("/me")
  @UseGuards(AuthGuard)
  me (@CurrentUser() user: User) {
    return user;
  }

  @Post("/signup")
  async createUser (@Body() createUserDto: CreateUserDto, @Session() session) {
    const user = await this.authService.signup(createUserDto);
    session.userId = user.id;
    return user;
  }

  @Post("/signin")
  async signin (@Body() createUserDto: CreateUserDto, @Session() session) {
    const user = await this.authService.signin(createUserDto);
    session.userId = user.id;
    return user;
  }

  @Get("/signout")
  async signout (@Session() session) {
    session.userId = null;
  }

  @Get()
  findAll () {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne (@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update (@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
