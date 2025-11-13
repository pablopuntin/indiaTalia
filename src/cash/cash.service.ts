import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashRegister } from './entities/cash-register.entity';
import { CashMovement, CashMovementType } from './entities/cash-movement.entity';
import { CreateCashMovementDto } from './dto/create-cash-movement.dto';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(CashRegister)
    private registerRepo: Repository<CashRegister>,
    @InjectRepository(CashMovement)
    private movementRepo: Repository<CashMovement>,
  ) {}

  async openRegister(openingBalance = 0) {
    const open = await this.registerRepo.findOne({ where: { isClosed: false } });
    if (open) throw new BadRequestException('A cash register is already open');

    const register = this.registerRepo.create({ openingBalance });
    return this.registerRepo.save(register);
  }

  async closeRegister(id: string) {
    const register = await this.registerRepo.findOne({
      where: { id },
      relations: ['movements'],
    });
    if (!register) throw new NotFoundException('Register not found');
    if (register.isClosed) throw new BadRequestException('Register already closed');

    const total = register.movements.reduce((sum, m) =>
      m.type === CashMovementType.INCOME ? sum + Number(m.amount) : sum - Number(m.amount), 0,
    );

    register.closingBalance = register.openingBalance + total;
    register.isClosed = true;
    register.closedAt = new Date();

    return this.registerRepo.save(register);
  }

  async createMovement(dto: CreateCashMovementDto) {
    const register = await this.registerRepo.findOne({ where: { id: dto.registerId } });
    if (!register) throw new NotFoundException('Cash register not found');
    if (register.isClosed) throw new BadRequestException('Register is closed');

    const movement = this.movementRepo.create({
      ...dto,
      register,
    });

    return this.movementRepo.save(movement);
  }

  async getCurrentRegister() {
    return this.registerRepo.findOne({
      where: { isClosed: false },
      relations: ['movements'],
    });
  }
}
