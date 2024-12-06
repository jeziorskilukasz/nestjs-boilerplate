import { UserEntity } from '~starter/modules/users/entities/user.entity';

export type JwtPayloadType = Pick<UserEntity, 'id' | 'role'> & {
  exp: number;
  iat: number;
  id: string;
  sessionId: string;
};
