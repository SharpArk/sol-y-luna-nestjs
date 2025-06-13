import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create_product.dto';
import * as sharp from 'sharp';
import * as path from 'path';
import { unlink } from 'fs/promises';

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
              console.error('Error converting image:', err);
            });

          await unlink(filepath);
          images.push(`${file.path}.webp`);
        } catch (err) {
          console.error('Error processing image:', err);
          throw new Error('Error procesando imagen');
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
}
