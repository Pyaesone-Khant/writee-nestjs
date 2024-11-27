import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AuthType } from '../enums/auth-type.enum';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    private static readonly defaultAuthType = AuthType.Bearer;
    private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
        [AuthType.Bearer]: this.accessTokenGuard,
        [AuthType.None]: { canActivate: () => true }
    }

    constructor(
        private readonly reflector: Reflector,

        private readonly accessTokenGuard: AccessTokenGuard
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
            AUTH_TYPE_KEY, [
            context.getHandler(), context.getClass()
        ]) ?? [AuthenticationGuard.defaultAuthType]

        const guards = authTypes.map(type => this.authTypeGuardMap[type]).flat();

        const error = new UnauthorizedException();

        for (const gu of guards) {
            const canActivate = await Promise.resolve(
                gu.canActivate(context)
            ).catch(err => {
                error: err
            })

            if (canActivate) {
                return true;
            }
        }

        throw error;
    }
}
