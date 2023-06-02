import { Injectable } from '@nestjs/common';

import { Game } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async createGame(player1Id: string, player2Id: string): Promise<Game> {
    return this.prisma.game.create({
      data: {
        player1Id: player1Id,
        player2Id: player2Id,
        board: '---------', // initial empty board
      },
    });
  }

  async getGame(id: number): Promise<Game> {
    return this.prisma.game.findUnique({
      where: { id: id },
    });
  }

  async updateGame(id: number, board: string): Promise<Game> {
    return this.prisma.game.update({
      where: { id: id },
      data: { board: board },
    });
  }
}
