export { useCategories } from './hooks/use-categories';
export { categoryService } from './services/category-service';
export { categoryRepository } from './repository/category-repository';
export { categorySchema, categoryFormSchema } from './schemas/category-schema';
export type { ServiceCategory } from './types';
export { ServiceCategoryTable } from './components/ServiceCategoryTable';
export { ServiceCategoryForm } from './components/ServiceCategoryForm';
export { ServiceCategoryBadge } from './components/ServiceCategoryBadge';
export { ServiceCategoryStatsCards } from './components/ServiceCategoryStatsCards';

export { useSubcategories } from './hooks/use-subcategories';
export { subcategoryService } from './services/subcategory-service';
export { subcategoryRepository } from './repository/subcategory-repository';
export { subcategorySchema, subcategoryFormSchema } from './schemas/subcategory-schema';
export type { ServiceSubcategory } from './types';
export { ServiceSubcategoryTable } from './components/ServiceSubcategoryTable';
export { ServiceSubcategoryForm } from './components/ServiceSubcategoryForm';
export { ServiceSubcategoryStatsCards } from './components/ServiceSubcategoryStatsCards';

export { useServices } from './hooks/use-services';
export { serviceService } from './services/service-service';
export { serviceRepository } from './repository/service-repository';
export { serviceSchema, serviceFormSchema } from './schemas/service-schema';
export type { CatalogService } from './types';
export { CatalogServiceTable } from './components/CatalogServiceTable';
export { CatalogServiceForm } from './components/CatalogServiceForm';
export { CatalogServiceStatsCards } from './components/CatalogServiceStatsCards';

export { useComponents } from './hooks/use-components';
export { componentService } from './services/component-service';
export { componentRepository } from './repository/component-repository';
export { componentSchema, componentFormSchema, componentTypeSchema } from './schemas/component-schema';
export type { ServiceComponent } from './types';
export type { ComponentType } from './schemas/component-schema';
