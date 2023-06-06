import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { GameService } from './game/game.service';
import { PlayerService } from './player/player.service';
import { MoveService } from './move/move.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, GameService, PlayerService, MoveService],
})
export class AppModule {}
