export interface ContentItem {
  id?: string;
  type: string;
  props?: any;
  _id?: string;
}

export interface PageBlock {
  id: string;
  type: string;
  props?: any;
  content?: (PageBlock | ContentItem | any)[];
  columns?: any[][];
  adminTitle?: string;
  layout?: string;
}

export interface Page {
  _id?: string;
  title: string;
  slug: string;
  content: PageBlock[] | string | any;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  status?: string;
  type?: string;
  template?: string;
  sections?: any[];
  seo?: { metaTitle?: string; metaDescription?: string; };
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isHomepage?: boolean;
}

