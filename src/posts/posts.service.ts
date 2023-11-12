import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/CreatePost.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private userService: UsersService,
  ) {}

  async createPost(post: CreatePostDto) {
    try {
      const userFound = await this.userService.getUserById(post.authorId);

      if (!userFound) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const newPost = this.postsRepository.create(post);
      return this.postsRepository.save(newPost);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getPost() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }
}
