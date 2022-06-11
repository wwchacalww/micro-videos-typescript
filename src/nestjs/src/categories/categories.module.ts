import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CATEGORIES_PROVIDERS } from './categories.providers';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    ...Object.values(CATEGORIES_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORIES_PROVIDERS.USE_CASES),
  ],
})
export class CategoriesModule {}
