import { Controller, Post, Get, Body, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { CreateVariableExpenseDto } from './dto/create-variable-expense.dto';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('fixed')
  @ApiOperation({ summary: 'Registrar un gasto fijo' })
  createFixed(@Body() dto: CreateFixedExpenseDto) {
    return this.expensesService.createFixed(dto);
  }

  @Post('variable')
  @ApiOperation({ summary: 'Registrar un gasto variable' })
  createVariable(@Body() dto: CreateVariableExpenseDto) {
    return this.expensesService.createVariable(dto);
  }

  @Get('fixed')
  @ApiOperation({ summary: 'Listar gastos fijos' })
  findAllFixed() {
    return this.expensesService.findAllFixed();
  }

  @Get('variable')
  @ApiOperation({ summary: 'Listar gastos variables' })
  findAllVariable() {
    return this.expensesService.findAllVariable();
  }

  @Delete('fixed/:id')
  @ApiOperation({ summary: 'Eliminar gasto fijo' })
  removeFixed(@Param('id') id: string) {
    return this.expensesService.removeFixed(id);
  }

  @Delete('variable/:id')
  @ApiOperation({ summary: 'Eliminar gasto variable' })
  removeVariable(@Param('id') id: string) {
    return this.expensesService.removeVariable(id);
  }
}
