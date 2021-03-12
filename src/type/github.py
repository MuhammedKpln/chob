from dataclasses import dataclass
from datetime import datetime
from typing import List, TypedDict


@dataclass
class Author(TypedDict):
    login: str
    id: int
    node_id: str
    avatar_url: str
    gravatar_id: str
    url: str
    html_url: str
    followers_url: str
    following_url: str
    gists_url: str
    starred_url: str
    subscriptions_url: str
    organizations_url: str
    repos_url: str
    events_url: str
    received_events_url: str
    type: str
    site_admin: bool


@dataclass
class Asset(TypedDict):
    url: str
    id: int
    node_id: str
    name: str
    label: None
    uploader: Author
    content_type: str
    state: str
    size: int
    download_count: int
    created_at: datetime
    updated_at: datetime
    browser_download_url: str


@dataclass
class IGithubLatestReleases(TypedDict):
    url: str
    assets_url: str
    upload_url: str
    html_url: str
    id: int
    author: Author
    node_id: str
    tag_name: str
    target_commitish: str
    name: str
    draft: bool
    prerelease: bool
    created_at: datetime
    published_at: datetime
    assets: List[Asset]
    tarball_url: str
    zipball_url: str
    body: str
