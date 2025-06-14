import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateProductDto } from './dto/create_product.dto';
import { AddCartDto } from './dto/add_card.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('products')
  async getProducts() {
    return this.storeService.getProducts();
  }

  @Get('products/:id')
  async getOneProduct(@Param() params: any) {
    return this.storeService.getOneProduct(parseInt(params.id));
  }

  @Post('product')
  @UseInterceptors(FilesInterceptor('images')) // Cambiar aquí a FilesInterceptor
  async postProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: CreateProductDto,
  ) {
    return this.storeService.postProduct(data, files);
  }

  @Get('FourProducts')
  async getFourProducts() {
    return this.storeService.getFourProducts();
  }

  @Get('UserProducts/:id')
  async getUserProducts(@Param() params: any) {
    return this.storeService.getUserProducts(parseInt(params.id));
  }

  @Post('addCart')
  async addCart(@Body() body: AddCartDto) {
    const { idUser, idProduct, quantity } = body;
    return this.storeService.newCart(idUser, idProduct, quantity);
  }
}
