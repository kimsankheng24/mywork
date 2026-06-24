import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { DbService } from '../db/db.service';
import { users, roles } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CfAuthGuard implements CanActivate {
  private client: jwksClient.JwksClient;

  constructor(private readonly dbService: DbService) {
    const teamDomain = process.env.CLOUDFLARE_TEAM_DOMAIN || 'https://your-team.cloudflareaccess.com';
    this.client = jwksClient({
      jwksUri: `${teamDomain}/cdn-cgi/access/certs`,
    });
  }

  private getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    this.client.getSigningKey(header.kid, (err, key) => {
      if (err) return callback(err, undefined);
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['cf-access-jwt-assertion'] || request.cookies?.['CF_Authorization'];

    if (!token) {
      // Allow bypass in local dev if configured
      if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
        request.user = { role: 'ADMIN', email: 'dev@mywork.com' };
        return true;
      }
      throw new UnauthorizedException('Missing Cloudflare Access token');
    }

    try {
      const decoded: any = await new Promise((resolve, reject) => {
        jwt.verify(token, this.getKey.bind(this), { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      // RBAC: Check against D1 Database
      const userRecord = await this.dbService.db
        .select({
          email: users.email,
          roleName: roles.name,
        })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.email, decoded.email))
        .get();

      if (!userRecord || !userRecord.roleName) {
        throw new UnauthorizedException('User not registered or lacks permissions');
      }

      // Attach user object and roles to request context
      request.user = {
        email: decoded.email,
        role: userRecord.roleName,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Cloudflare Access token');
    }
  }
}
