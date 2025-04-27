export class TagLinkDto {
  id?: number;
  name?: string;
  slug?: string;
  constructor(init?: Partial<TagLinkDto>) {
    Object.assign(this, init);
  }
}
