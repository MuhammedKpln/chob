export interface defaultStructure {
  name: string;
  type: number;
  src: string;
  repoUrl?: string;
}

export interface flathubStructure {
  [Symbol.iterator];
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
  _embedded: snapEmbedded;
}

export interface snapClickIndex {
  [Symbol.iterator];
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
  [Symbol.iterator];
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
  version: number;
  home_page_url: string;
  feed_url: string;
  description: string;
  icon: string;
  favicon: string;
  expired: boolean;
  items: appimageSingleStructure;
}

export interface snapEmbedded {
  'clickindex:package': snapClickIndex;
}

export interface IGithubLatestReleases {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  author: Author;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  assets: Asset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

interface Asset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: null;
  uploader: Author;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  browser_download_url: string;
}

interface Author {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface ITags {
  name: string;
  zipball_url: string;
  tarball_url: string;
  commit: Commit;
  node_id: string;
}

interface Commit {
  sha: string;
  url: string;
}
