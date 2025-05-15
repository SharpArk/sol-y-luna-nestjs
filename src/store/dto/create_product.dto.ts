import { IsNumber, IsString, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { CreateSizeDto } from './create_size.dto';
import { CreateImageDto } from './create_image.dto';

export class CreateProductDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description_short: string;

  @IsString()
  description_long: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSizeDto)
  sizes: CreateSizeDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images: CreateImageDto[];
}
