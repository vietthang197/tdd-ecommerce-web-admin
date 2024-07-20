export interface UpdateCategoryDto {
  categoryId: string | null | undefined,
  name: string | null | undefined,
  activeStartDate: string | null | undefined,
  activeEndDate: string | null | undefined,
  description: string | null | undefined,
  url: string | null | undefined,
  metaTitle: string | null | undefined,
  metaDescription: string | null | undefined,
  parentCategoryId: string | null | undefined,
  attributes: string | null | undefined
}
