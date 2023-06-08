import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  WsException,
} from '@nestjs/websockets';

import { MoveService } from 'src/move/move.service';
import { GameService } from './game.service';
import { PlayerService } from 'src/player/player.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private gameService: GameService,
    private moveService: MoveService,
    private playerService: PlayerService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    // You may want to handle any cleanup tasks here (like removing the player from the game)
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(client: any, payload: any): Promise<WsResponse<any>> {
    try {
      // payload might include the gameId and playerId
      this.logger.log(payload);
      const player = await this.playerService.getPlayer(payload.playerId);
      if (!player) {
        throw new WsException('Player not found');
      }

      const game = await this.gameService.getGame(payload.gameId);
      if (!game) {
        throw new WsException('Game not found');
      }

      // You may want to perform additional checks here (like if the game is full)

      // You could use client data to keep track of which game this client is part of
      client.data = { ...client.data, gameId: payload.gameId };

      return { event: 'gameUpdate', data: game };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(client: any, payload: any): Promise<WsResponse<any>> {
    try {
      // payload might include the gameId, playerId and the move
      const move = await this.moveService.createMove({
        position: payload.position,
        symbol: payload.symbol,
        game: {
          connect: {
            id: payload.gameId,
          },
        },
        player: {
          connect: {
            id: payload.playerId,
          },
        },
      });

      // After a move is made, fetch the updated game state and broadcast it to all clients
      const game = await this.gameService.getGame(payload.gameId);
      client.server.emit('gameUpdate', game);

      return { event: 'moveMade', data: move };
    } catch (error) {
      throw new WsException(error.message);
    }
  }
}
