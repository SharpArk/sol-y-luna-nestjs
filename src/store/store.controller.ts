import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

  @Post('product')
  @UseInterceptors(FilesInterceptor('images'))
  async postProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: CreateProductDto,
  ) {
    return this.storeService.postProduct(data, files);
  }

  @Post('addImage')
  @UseInterceptors(FilesInterceptor('images'))
  async postImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: any,
  ) {
    return this.storeService.postImage(data, files);
  }

  @Post('addCart')
  async addCart(@Body() body: AddCartDto) {
    const { idUser, idProduct, quantity } = body;
    return this.storeService.newCart(idUser, idProduct, quantity);
  }

  @Post('/CreateCategory')
  async addCategory(@Body() data: any) {
    return this.storeService.createCategory(data);
  }

  @Get('/Categoryes')
  async getCategory() {
    return this.storeService.getCategory();
  }

  @Get('FourProducts')
  async getFourProducts() {
    return this.storeService.getFourProducts();
  }

  @Get('UserProducts/:id')
  async getUserProducts(@Param() params: any) {
    return this.storeService.getUserProducts(parseInt(params.id));
  }

  @Get('products')
  async getProducts() {
    return this.storeService.getProducts();
  }

  @Get('products/:id')
  async getOneProduct(@Param() params: any) {
    return this.storeService.getOneProduct(parseInt(params.id));
  }

  @Delete('Delete/:id')
  async deleteProduct(@Param() params: any) {
    const { id } = params;
    return this.storeService.removeProduct(id);
  }

  @Delete('/DeleteImage/:id')
  async deleteImage(@Param() params: any) {
    const { id } = params;
    return this.storeService.deleteImage(id);
  }

  @Delete('/Category/:id')
  async deleteCategory(@Param() params: any) {
    const { id } = params;
    return this.storeService.deleteCategory(id);
  }

  @Put('/UpdateProduct')
  async updateProduct(@Body() data: any) {
    return this.storeService.updateProduct(data);
  }

  @Put('/UpdateCategory')
  async updateCategory(@Body() data: any) {
    this.storeService.updateCategory(data);
  }
}
