from dataclasses import dataclass
from typing import TypedDict


@dataclass
class FlatHub(TypedDict):
    flatpakAppId: str
    name: str
    summary: str
    currentReleaseVersion: str
    currentReleaseDate: str
    iconDesktopUrl: str
    iconMobileUrl: str
    inStoreSinceDate: str
