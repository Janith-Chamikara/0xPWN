import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-info-single')
  async getUserInfoHandler(@Query('id') userId: string) {
    return await this.userService.getUserById(userId);
  }

  @Put('update')
  async updateUserHandler(
    @Query('userId') userId: string,
    @Body() updatedUserContent: Partial<User>,
  ) {
    return await this.userService.updateUserById(userId, updatedUserContent);
  }

  @Get('admin/get-all')
  async getAllUsersHandler() {
    return await this.userService.getAllUsers();
  }

  @Delete('admin/delete')
  async deleteUserHandler(@Query('userId') userId: string) {
    return await this.userService.deleteUserById(userId);
  }

  @Get('get-users-by-rank')
  async getUsersByRankHandler() {
    return await this.userService.getUsersByRank();
  }
}
