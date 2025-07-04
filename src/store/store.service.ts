import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create_product.dto';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { unlink } from 'fs/promises';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async getProducts() {
    const data = await this.prisma.product.findMany({
      include: {
        images: true,
        sizes: true,
        Colors: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return data;
  }

  async getOneProduct(@Param() id: number) {
    const data = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        images: true,
        sizes: true,
      },
    });

    return data;
  }

  async postProduct(data: CreateProductDto, files: Express.Multer.File[]) {
    const { name, description_short, description_long, sizes } = data;
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

    const images: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        try {
          const filepath = path.join(__dirname, '..', '..', file.path);
          const newFilepath = path.join(
            __dirname,
            '..',
            '..',
            `${file.path}.webp`,
          );

          await sharp(filepath)
            .webp({ quality: 80 })
            .toFile(newFilepath)
            .catch((err) => {
              throw new BadRequestException(
                'Error al convertir la imagen: ',
                err,
              );
            });

          await unlink(filepath);
          images.push(`${file.path}.webp`);
        } catch (err) {
          throw new BadRequestException('Error procesando la imagen');
        }
      }),
    );

    const sizesData: { size: string; price: number }[] = [];

    parsedSizes.forEach((size) => {
      sizesData.push({
        size: size.size,
        price: Number(size.price),
      });
    });

    const newProduct = await this.prisma.product.create({
      data: {
        name,
        description_short,
        description_long,
        images: {
          create: images.map((image) => ({
            image: image,
          })),
        },
        sizes: {
          create: sizesData.map((size) => ({
            size: size.size,
            price: size.price,
          })),
        },
      },
    });

    return newProduct;
  }

  async getFourProducts() {
    const data = await this.prisma.product.findMany({
      include: {
        images: true,
        sizes: true,
        Colors: true,
      },
      orderBy: {
        id: 'desc',
      },
      take: 4,
    });

    return data;
  }

  async getUserProducts(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        role: false,
        image: true,
        Cart: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                description_short: true,
                description_long: true,
                images: {
                  select: {
                    image: true,
                  },
                },
                sizes: {
                  select: {
                    size: true,
                    price: true,
                  },
                },
                Colors: {
                  select: {
                    color: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async newCart(idUser: number, idProduct: number, quantity: number) {
    const validate = await this.prisma.cart.findMany({
      where: { user_id: idUser, product_id: idProduct },
    });

    if (validate.length !== 0) {
      return { message: 'Producto ya existente en el carrito' };
    } else {
      const newCart = await this.prisma.cart.create({
        data: {
          user_id: idUser,
          product_id: idProduct,
          quantity: quantity,
        },
      });

      return { newCart, message: 'Producto añadido correctamente' };
    }
  }

  async removeProduct(idProduct: any) {
    const product = await this.prisma.product.findUnique({
      where: { id: parseInt(idProduct) },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const imageProduct = await this.prisma.images.findMany({
      where: {
        product_id: parseInt(idProduct),
      },
    });

    // Eliminar archivos físicos
    for (const e of imageProduct) {
      const absolutePath = path.join(__dirname, '..', '..', e.image);
      try {
        await unlink(absolutePath);
      } catch (err) {
        console.error('Error eliminando archivo:', err);
      }
    }

    try {
      // Elimina imágenes asociadas
      await this.prisma.images.deleteMany({
        where: { product_id: parseInt(idProduct) },
      });

      // Elimina el producto
      const deleted = await this.prisma.product.delete({
        where: {
          id: parseInt(idProduct),
        },
      });

      return deleted;
    } catch (error) {
      console.error('Error en removeProduct:', error);
      throw new BadRequestException('No se pudo eliminar el producto');
    }
  }
}
