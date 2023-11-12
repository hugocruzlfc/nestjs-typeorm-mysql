import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUser(user: CreateUserDto) {
    try {
      const userFound = await this.userRepository.findOne({
        where: { username: user.username },
      });

      if (userFound) {
        return new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      const newUser = this.userRepository.create(user);
      return this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getAllUsers() {
    return this.userRepository.find({
      relations: ['profile', 'posts'],
    });
  }

  async getUserById(id: number) {
    try {
      const userFound = await this.userRepository.findOne({
        where: { id },
        relations: ['profile', 'posts'],
      });

      if (!userFound) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return userFound;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUser(id: number) {
    try {
      // const userFound = await this.userRepository.findOne({ where: { id } });

      // if (!userFound) {
      //   return new HttpException('User not found', HttpStatus.NOT_FOUND);
      // }
      // return this.userRepository.delete({ id });
      const result = await this.userRepository.delete({ id });

      if (result.affected === 0) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(id: number, user: UpdateUserDto) {
    try {
      const result = await this.userRepository.update({ id }, user);

      if (result.affected === 0) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    try {
      const userFound = await this.userRepository.findOne({ where: { id } });

      if (!userFound) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const newProfile = this.profileRepository.create(profile);
      const savedProfile = await this.profileRepository.save(newProfile);
      userFound.profile = savedProfile;
      // return this.userRepository.update(
      //   { id },
      //   { profile: { ...savedProfile } },
      // );
      return this.userRepository.save(userFound);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
