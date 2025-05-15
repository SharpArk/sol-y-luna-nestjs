import { IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  image: string; // Ruta o nombre del archivo
}
