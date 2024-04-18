import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) { }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  async create(role: { name: string }): Promise<Role> {
    const isRoleExist = await this.findByRoleName(role.name);
    if (isRoleExist) throw new BadRequestException("Role already exists!")

    return await this.roleRepository.save(role);
  }

  async update(id: number, role: { name: string }): Promise<Role> {
    const isRoleExist = await this.findByRoleName(role.name);
    if (isRoleExist) throw new BadRequestException("Role already exists!")

    await this.roleRepository.update(id, role);
    return await this.roleRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    await this.roleRepository.delete(id);
    return role;
  }

  async findByRoleName(name: string): Promise<Role> {
    return await this.roleRepository.findOne({ where: { name } });
  }

}
