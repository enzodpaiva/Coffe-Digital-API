import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Get('export/excel')
  async exportToExcel(@Query() queryParams: ProductQueryDto, @Res() res: Response) {
    const buffer = await this.productService.exportToExcel(queryParams);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="products_${Date.now()}.xlsx"`,
    });

    res.send(buffer); // Envia o buffer como resposta
  }

  @Get('export/pdf')
  async exportToPDF(@Query() queryParams: ProductQueryDto, @Res() res: Response) {
    const buffer = await this.productService.exportToPDF(queryParams);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="products_${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
