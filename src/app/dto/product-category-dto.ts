export interface ProductCategoryDto {
  categoryId: string,
  name: string,
  activeStartDate: string,
  activeEndDate: string,
  url: string,
  description: string,
  metaTitle: string,
  metaDescription: string,
  parentCategory: ProductCategoryDto,
  attributes: Map<string, string>
}
