from typing import Optional, TypedDict
from enum import Enum


class Types(Enum):
    APPIMAGE = 'AppImage'
    FLATHUB = 'Flathub'
    SNAP = 'Snapcraft'


class Application(TypedDict):
    name: str
    src: str
    version: Optional[str]
    type: Types
    repo_url: Optional[str]
