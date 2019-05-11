export interface defaultStructure {
  name: string,
  type: number,
  dest: string
}

export interface flathubStructure {
  flatpakAppId: string;
  name: string;
  summary: string;
  iconDesktopUrl: string;
  iconMobileUrl: string;
  currentReleaseVersion: string;
  currentReleaseDate?: any;
  inStoreSinceDate: Date;
  rating: number;
  ratingVotes: number;
}

export interface snapStrucuure {
  _embedded: snapEmbedded
}

export interface snapClickIndex {
  aliases: any;
  anon_download_url: string;
  apps: any[];
  architecture: string[];
  binary_filesize: number;
  channel: string;
  common_ids: any[];
  confinement: string;
  contact: string;
  content: string;
  date_published: Date;
  deltas: any[];
  description: string;
  developer_id: string;
  developer_name: string;
  developer_validation: string;
  download_sha3_384: string;
  download_sha512: string;
  download_url: string;
  epoch: string;
  gated_snap_ids: any[];
  icon_url: string;
  last_updated: Date;
  license: string;
  name: string;
  origin: string;
  package_name: string;
  prices: Object;
  private: boolean;
  publisher: string;
  ratings_average: number;
  release: string[];
  revision: number;
  screenshot_urls: string[];
  snap_id: string;
  summary: string;
  support_url: string;
  title: string;
  version: string;
  website: string;
}
interface Author {
  name: string;
  url: string;
}

interface Link {
  type: string;
  url: string;
}

interface appimageSingleStructure {
  name: string;
  description: string;
  categories: string[];
  authors: Author[];
  license?: any;
  links: Link[];
  icons: string[];
  screenshots: string[];
}

export interface appimageStructure {
  version: number,
  home_page_url: string,
  feed_url: string,
  description: string,
  icon: string,
  favicon: string,
  expired:boolean,
  items: appimageSingleStructure
}

export interface snapEmbedded {
  "clickindex:package": snapClickIndex
}
