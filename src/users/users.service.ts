import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { Profile } from './profile.entity';

import { CreateUserDto } from './dto/create-user-dto';
import { updateUserDto } from './dto/update-user-dto';
import { createProfileDto } from './dto/create-profile-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUser(user: CreateUserDto) {
    //searching user
    const userFound = await this.userRepository.findOne({
      where: {
        userName: user.userName,
      },
    });

    if (userFound) {
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['posts'],
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async deleteUser(id: number) {
    // const userFound = await this.userRepository.findOne({ where: { id } });
    // if (!userFound) {
    //   return new HttpException('user not found', HttpStatus.NOT_FOUND);
    // }
    // return this.userRepository.delete({ id });
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateUser(id: number, user: updateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      return new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const updateUser = Object.assign(userFound, user);

    return this.userRepository.save(updateUser);
  }

  // method create profile
  async createProfile(id: number, profile: createProfileDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User Not found', HttpStatus.NOT_FOUND);
    }
    //create profile
    const newProfile = this.profileRepository.create(profile);

    const savedProfile = await this.profileRepository.save(newProfile);

    userFound.profile = savedProfile;

    return this.userRepository.save(userFound);
  }
}
