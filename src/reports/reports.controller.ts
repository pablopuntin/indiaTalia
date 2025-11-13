import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags } from '@nestjs/swagger';
import { ReportFilterDto } from './dto/report-filter.dto';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('stock')
  getStockSummary() {
    return this.service.getStockSummary();
  }

  @Get('price-changes')
  getPriceChanges(@Query() query: ReportFilterDto) {
    return this.service.getPriceChanges(query);
  }
}
