import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CashService } from './cash.service';
import { CreateCashMovementDto } from './dto/create-cash-movement.dto';

@ApiTags('Cash Register')
@Controller('cash')
export class CashController {
  constructor(private readonly cashService: CashService) {}

  @Post('open')
  @ApiOperation({ summary: 'Abrir una nueva caja' })
  open() {
    return this.cashService.openRegister(0);
  }

  @Post('close/:id')
  @ApiOperation({ summary: 'Cerrar caja actual' })
  close(@Param('id') id: string) {
    return this.cashService.closeRegister(id);
  }

  @Post('movement')
  @ApiOperation({ summary: 'Registrar un movimiento de caja' })
  createMovement(@Body() dto: CreateCashMovementDto) {
    return this.cashService.createMovement(dto);
  }

  @Get('current')
  @ApiOperation({ summary: 'Obtener caja abierta actual' })
  getCurrent() {
    return this.cashService.getCurrentRegister();
  }
}
