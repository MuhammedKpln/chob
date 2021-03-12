from typing import Optional, List, TypedDict


class Author(TypedDict):
    name: str
    url: str


class Link(TypedDict):
    type: str
    url: str


class AppImage(TypedDict):
    name: str
    description: Optional[str]
    categories: List[Optional[str]]
    authors: Optional[List[Author]]
    license: Optional[str]
    links: Optional[List[Link]]
    icons: Optional[List[str]]
    screenshots: Optional[List[str]]
