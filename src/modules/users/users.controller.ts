import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateUserDto } from '~starter/modules/users/dto/create-user.dto';
import UpdateUserDto from '~starter/modules/users/dto/update-user.dto';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { UsersService } from '~starter/modules/users/users.service';
import { Roles } from '~starter/roles/roles.decorator';
import { RoleIdEnum } from '~starter/roles/roles.enum';
import { RolesGuard } from '~starter/roles/roles.guard';
import { ErrorEntity } from '~starter/shared/errors/error-entity';
import { ErrorServerEntity } from '~starter/shared/errors/error-server-entity';
import { ErrorUnauthorizedEntity } from '~starter/shared/errors/error-unauthorized-entity';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';
import { Statuses } from '~starter/statuses/status.decorator';
import { StatusGuard } from '~starter/statuses/status.guard';
import { StatusEnum } from '~starter/statuses/statuses.enum';

@ApiBearerAuth()
@Roles(RoleIdEnum.admin)
@Statuses(StatusEnum.active)
@UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('users')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: ErrorServerEntity,
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: ErrorUnauthorizedEntity,
})
@ApiForbiddenResponse({
  description: 'Forbidden',
  type: ErrorEntity,
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create User',
    description: 'Creates a new user.',
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @ApiOperation({
    summary: 'Find All Users',
    description: 'Retrieves a list of all users.',
  })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const users = await this.usersService.findAll(page, pageSize);
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find User by ID',
    description: 'Retrieves a user by its ID.',
  })
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    return new UserEntity(
      await this.usersService.findOneById(id, {
        consent: true,
        status: true,
        role: true,
        articles: true,
      }),
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update User',
    description: 'Updates a user with the provided details.',
  })
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove User',
    description: 'Deletes a user by their unique identifier.',
  })
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    return new UserEntity(await this.usersService.delete(id));
  }
}
