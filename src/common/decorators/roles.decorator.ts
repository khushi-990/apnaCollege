import { SetMetadata } from '@nestjs/common'
import { UserTypeEnum } from 'src/users/enum/User.enum'

export const ROLES_KEYS = 'roles'

export const Roles = (...roles: UserTypeEnum[]) => SetMetadata(ROLES_KEYS, roles)