import { Injectable } from '@nestjs/common';

import { Move, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoveService {
  constructor(private prisma: PrismaService) {}

  async createMove(data: Prisma.MoveCreateInput): Promise<Move> {
    return this.prisma.move.create({
      data,
    });
  }

  async getMove(id: number): Promise<Move | null> {
    return this.prisma.move.findUnique({
      where: { id },
    });
  }

  async getMovesByGame(gameId: number): Promise<Move[]> {
    return this.prisma.move.findMany({
      where: { gameId: gameId },
    });
  }
}
