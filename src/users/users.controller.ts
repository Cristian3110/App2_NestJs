import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  createUser(@Body() newUser: CreateUserDto): Promise<User> {
    return this.userService.createUser(newUser);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    // console.log(id);
    // console.log(typeof id);
    return this.userService.getUser(id);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
