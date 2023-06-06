import { Injectable } from '@nestjs/common';

import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async createPlayer(username: string): Promise<Player> {
    return this.prisma.player.create({
      data: {
        username: username,
      },
    });
  }

  async getPlayer(id: number): Promise<Player> {
    return this.prisma.player.findUnique({
      where: { id: id },
    });
  }

  async getPlayerByUsername(username: string): Promise<Player> {
    return this.prisma.player.findUnique({
      where: { username: username },
    });
  }

  async getPlayers(): Promise<Player[]> {
    return this.prisma.player.findMany();
  }
}
