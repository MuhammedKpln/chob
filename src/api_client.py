from genericpath import exists
from cache_manager import CacheManager
from helpers import error_message
from type.appimage import AppImage
from typing import List
from type.snap import Snap
from type.flathub import FlatHub
import requests
from requests.models import Response
from os import path
from pathlib import Path


class ApiClient:
    flathub_api: str
    snap_api: str
    appimage_api: str
    flathub_data: List[FlatHub]
    snap_data: List[Snap]
    appimage_data: List[AppImage]
    cache_manager: CacheManager = CacheManager()

    def __init__(self):
        self.flathub_api = 'https://flathub.org/api/v1/apps/'
        self.snap_api = 'https://raw.githubusercontent.com/MuhammedKpln/chob/master/snapcraft.json'
        self.appimage_api = 'https://appimage.github.io/feed.json'

    def get(self, url: str, *args, **kwargs) -> Response:
        request = requests.get(url, *args, **kwargs)

        if request.status_code != 200:
            raise ConnectionAbortedError(
                'The URL did not return 200 status code.')

        return request

    def get_flathub_data(self) -> None:
        if self.cache_manager.is_cache_enabled and self.cache_manager.has_cached_sources:

            self.flathub_data = self.cache_manager.fetch_sources_from_cache()[
                'flathub_data']
            return None

        api = self.get(self.flathub_api)

        self.flathub_data = api.json()

    def get_snap_data(self) -> None:
        if self.cache_manager.is_cache_enabled and self.cache_manager.has_cached_sources:
            self.snap_data = self.cache_manager.fetch_sources_from_cache()[
                'snap_data']
            return None

        api = self.get(self.snap_api)
        self.snap_data = api.json()['_embedded']['clickindex:package']

    def get_appimage_data(self) -> None:
        if self.cache_manager.is_cache_enabled and self.cache_manager.has_cached_sources:
            self.appimage_data = self.cache_manager.fetch_sources_from_cache()[
                'appimage_data']
            return None

        api = self.get(self.appimage_api)

        self.appimage_data = api.json()['items']

    def download(self, url: str, file_name: str) -> bool:
        home_folder = path.join(Path.home(), 'chob')
        file_path = path.join(home_folder, file_name.lower())

        if exists(file_path):
            error_message(
                f'You already have downloaded this file in {home_folder}')
            return False

        try:
            with open(file_path, 'wb') as f:
                request: Response = requests.get(url, stream=True)
                content = request.iter_content(chunk_size=1024)

                for chunk in content:
                    f.write(chunk)

                f.close()

                return True
        except Exception as err:
            error_message(str(err))
            return False
