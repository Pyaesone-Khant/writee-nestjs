import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/auth/roles.guard';
import { RolesService } from './roles.service';

@Roles("ADMIN")
@UseGuards(RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService
  ) { }

  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Post()
  async create(@Body() role: { name: string }) {
    return await this.rolesService.create(role);
  }

  @Get(":id")
  async findOne(@Param() id: string) {
    return await this.rolesService.findOne(+id);
  }

  @Patch(":id")
  async update(@Param() id: string, @Body() role: { name: string }) {
    return await this.rolesService.update(+id, role);
  }

  @Delete(":id")
  async delete(@Param() id: string) {
    return await this.rolesService.delete(+id);
  }
}

