import { PartialType } from '@nestjs/mapped-types';
import { CreateSavedblogDto } from './create-savedblog.dto';

export class UpdateSavedblogDto extends PartialType(CreateSavedblogDto) {}
