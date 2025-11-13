import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FixedExpense } from './entities/fixed-expense.entity';
import { VariableExpense } from './entities/variable-expense.entity';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { CreateVariableExpenseDto } from './dto/create-variable-expense.dto';
import { CashService } from 'src/cash/cash.service';
import { CashMovementType } from 'src/cash/entities/cash-movement.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(FixedExpense)
    private fixedRepo: Repository<FixedExpense>,

    @InjectRepository(VariableExpense)
    private variableRepo: Repository<VariableExpense>,

    @InjectRepository(Supplier)
    private supplierRepo: Repository<Supplier>,

    private cashService: CashService,
  ) {}

  async createFixed(dto: CreateFixedExpenseDto) {
  const supplier = dto.supplierId
    ? await this.supplierRepo.findOne({ where: { id: dto.supplierId } })
    : undefined;

  const expense = this.fixedRepo.create({
    ...dto,
    ...(supplier ? { supplier } : {}),
  });

  const saved = await this.fixedRepo.save(expense);

  // Registrar movimiento en caja
  const register = await this.cashService.getCurrentRegister();
  if (register) {
    await this.cashService.createMovement({
      registerId: register.id,
      type: CashMovementType.EXPENSE,
      amount: dto.amount,
      reason: `Gasto fijo: ${dto.name}`,
    });
  }

  return saved;
}


  async createVariable(dto: CreateVariableExpenseDto) {
    const supplier = dto.supplierId
      ? await this.supplierRepo.findOne({ where: { id: dto.supplierId } })
      : undefined;

    const expense = this.variableRepo.create({
  ...dto,
  ...(supplier ? { supplier } : {}),
});

    const saved = await this.variableRepo.save(expense);

    // Registrar movimiento en caja
    const register = await this.cashService.getCurrentRegister();
    if (register) {
      await this.cashService.createMovement({
        registerId: register.id,
        type: CashMovementType.EXPENSE,
        amount: dto.amount,
        reason: `Gasto variable: ${dto.name}`,
      });
    }

    return saved;
  }

  findAllFixed() {
    return this.fixedRepo.find({ relations: ['supplier'] });
  }

  findAllVariable() {
    return this.variableRepo.find({ relations: ['supplier'] });
  }

  async removeFixed(id: string) {
    const item = await this.fixedRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Fixed expense not found');
    return this.fixedRepo.remove(item);
  }

  async removeVariable(id: string) {
    const item = await this.variableRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Variable expense not found');
    return this.variableRepo.remove(item);
  }
}
