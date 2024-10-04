import { PrismaRepository } from '@api/repository/repository.service';
import { BadRequestException } from '@exceptions';

export class AuthService {
  constructor(private readonly prismaRepository: PrismaRepository) {}

  public async checkDuplicateToken(token: string) {
    if (!token) {
      return true;
    }

    const instances = await this.prismaRepository.instance.findMany({
      where: { token },
    });

    if (instances.length > 0) {
      throw new BadRequestException('Token already exists');
    }

    return true;
  }
}
