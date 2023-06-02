import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { GameService } from './game/game.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, GameService],
})
export class AppModule {}
