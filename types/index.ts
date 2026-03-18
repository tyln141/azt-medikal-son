export type MultiLang = {
  tr: string
  en: string
  de: string
  fr: string
}

export type MultiLangArray = {
  tr: string[]
  en: string[]
  de: string[]
  fr: string[]
}

export type ImageConfig = {
  url: string;
  width?: number;
  height?: number;
  objectFit?: "cover" | "contain";
}

export type Product = {
  id: string
  name: MultiLang
  description: MultiLang
  features: MultiLangArray
  categoryId: string
  images: (string | ImageConfig)[]
  createdAt: number
}

export type Category = {
  id: string
  name: MultiLang
  description: MultiLang
  image?: string | ImageConfig
  createdAt: number
}

export type Message = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  isRead: boolean
  createdAt: number
}

export type SiteContent = {
  header?: {
    title: string;
  };
  hero: {
    title: MultiLang;
    subtitle: MultiLang;
    buttonText: MultiLang;
    image?: string | ImageConfig;
  };
  about: {
    title: MultiLang;
    description: MultiLang;
    stats: { label: MultiLang; value: string }[];
    image?: string | ImageConfig;
  };
  whyUs: {
    title: MultiLang;
    description: MultiLang;
    icon: string;
  }[];
  logo: ImageConfig;
  footer: {
    address: string;
    phone: string;
    email: string;
    workingHours: MultiLang;
    copyright: MultiLang;
    description?: MultiLang;
  };
};

export type Settings = {
  siteName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: MultiLang;
};
