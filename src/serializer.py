from typing import List
from type.appimage import AppImage
from type.application import Application, Types
from type.flathub import FlatHub
from type.snap import Snap


def serialize_snap_data(data: List[Snap]) -> List[Application]:
    serialized_data: List[Application] = []

    for app in data:
        serialized_data.append({
            "name": app['name'],
            "src": f'https://snapcraft.io/{app["package_name"]}',
            "version": app['version'],
            "type": Types.SNAP,
            "repo_url": ""
        })

    return serialized_data


def serialize_flathub_data(data: List[FlatHub]) -> List[Application]:
    serialized_data: List[Application] = []

    for app in data:
        serialized_data.append({
            "name": app['name'],
            "src": f'https://flathub.org/apps/details/{app["flatpakAppId"]}',
            "version": app['currentReleaseVersion'],
            "type": Types.FLATHUB,
            "repo_url": ""
        })

    return serialized_data


def serialize_appimage_data(data: List[AppImage]) -> List[Application]:
    serialized_data: List[Application] = []
    for app in data:
        repo_url: str = ''
        try:
            repo_url = app['links'][1].get('url')
        except Exception:
            repo_url = ''

        serialized_data.append({
            "name": app['name'],
            "src": f'https://appimage.github.io/{app["name"]}',
            "type": Types.APPIMAGE,
            "version": "",
            "repo_url": repo_url
        })

    return serialized_data
