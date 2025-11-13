import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock.dto';
import { UpdateStockMovementDto } from './dto/update-stock.dto'; 
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() dto: CreateStockMovementDto) {
    return this.stockService.create(dto);
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStockMovementDto) {
    return this.stockService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
