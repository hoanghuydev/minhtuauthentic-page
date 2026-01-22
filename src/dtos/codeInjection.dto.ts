export interface CodeInjectionDto {
  id: number;
  title: string;
  content: string;
  sort: number;
  is_active: boolean;
  properties?: any;
  description?: string;
}
