import { Controller, Post, Get } from '@nestjs/common';
import { PriceRulesService } from './price-rules.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Price Rules')
@Controller('price-rules')
export class PriceRulesController {
  constructor(private readonly service: PriceRulesService) {}

  @Post('apply')
  apply() {
    return this.service.applyActiveRules();
  }

  @Get()
  findAll() {
    return this.service['ruleRepo'].find();
  }
}
