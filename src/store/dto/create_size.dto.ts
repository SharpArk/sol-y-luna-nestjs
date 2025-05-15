import { IsString, IsNumber } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  size: string;

  @IsNumber()
  price: number;
}
