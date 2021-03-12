from os import path, makedirs, stat
from pathlib import Path
from json import dumps, loads
from typing import Dict, List, TypeVar, TypedDict, Union, cast, no_type_check_decorator
from type.snap import Snap
from type.flathub import FlatHub
from type.appimage import AppImage
from dataclasses import dataclass


class Config(TypedDict):
    cache_enabled: bool
    cache_update_interval: int


@dataclass
class UpdateCache(TypedDict):
    flathub_data: List[FlatHub]
    snap_data: List[Snap]
    appimage_data: List[AppImage]


class CacheManager:
    is_cache_enabled: bool
    has_cached_sources: bool
    __cache_location: str
    __flathub_cache_path: str
    __snap_cache_path: str
    __appimage_cache_path: str
    __updatedAt_cache_path: str
    __config_path: str
    __config: Config
    __update_cache_interval: int

    def __init__(self) -> None:
        self.__cache_location = path.join(Path.home(), 'chob')
        self.__flathub_cache_path = path.join(
            self.__cache_location, '.flathub.json'
        )
        self.__snap_cache_path = path.join(self.__cache_location, '.snap.json'
                                           )
        self.__appimage_cache_path = path.join(
            self.__cache_location, '.appimage.json'
        )
        self.__updatedAt_cache_path = path.join(
            self.__cache_location, '.updatedAt'
        )
        self.__config_path = path.join(self.__cache_location, 'config.json')

        if not path.exists(self.__cache_location):
            makedirs(self.__cache_location)

        if not self.__check_cache_files():
            self.__create_cache_files()

        self.__parse_config()
        self.__update_cache_interval = self.__config.get(
            'cache_update_interval') or 1
        self.is_cache_enabled = self.__config.get('cache_enabled') or True
        self.has_cached_sources = self.__check_has_cached_sources()

    def fetch_sources_from_cache(self) -> UpdateCache:
        flathub_data: List[FlatHub]
        snap_data: List[Snap]
        appimage_data: List[AppImage]

        with open(self.__flathub_cache_path, 'r') as f:
            flathub_data = cast(List[FlatHub], loads(f.read()))
            f.close()

        with open(self.__snap_cache_path, 'r') as f:
            snap_data = cast(List[Snap], loads(f.read()))
            f.close()

        with open(self.__appimage_cache_path, 'r') as f:
            appimage_data = cast(List[AppImage], loads(f.read()))
            f.close()

        return {
            "flathub_data": flathub_data,
            "snap_data": snap_data,
            "appimage_data": appimage_data
        }

    def update_cache_statment(self, statment: bool) -> bool:
        self.__config['cache_enabled'] = statment

        try:
            with open(self.__config_path, 'w') as f:
                f.write(dumps(self.__config))
                f.close()
                return True
        except Exception:
            return False

    def update_cache(self, data: UpdateCache) -> bool:
        try:
            with open(self.__flathub_cache_path, 'w') as f:
                f.write(dumps(data['flathub_data']))
                f.close()

            with open(self.__snap_cache_path, 'w') as f:
                f.write(dumps(data['snap_data']))
                f.close()

            with open(self.__appimage_cache_path, 'w') as f:
                f.write(dumps(data['appimage_data']))
                f.close()

            return True
        except Exception:
            return False

    def __check_has_cached_sources(self) -> bool:
        with open(self.__flathub_cache_path, 'r') as f:
            data = loads(f.read())

            if len(data) > 0:
                f.close()
                return True

            f.close()
            return False

    def __parse_config(self) -> Config:
        with open(self.__config_path, 'r') as f:
            try:
                self.__config = loads(f.read())
                f.close()

                return self.__config
            except Exception:
                raise Exception('Config file could be corrupted! Remove it.')

    def __check_cache_files(self) -> bool:
        flathub_file: bool = path.exists(self.__flathub_cache_path)
        snap_file: bool = path.exists(self.__snap_cache_path)
        appimage_file: bool = path.exists(self.__appimage_cache_path)
        updated_at_file: bool = path.exists(self.__updatedAt_cache_path)
        config_file: bool = path.exists(self.__config_path)

        if flathub_file and snap_file and appimage_file and updated_at_file and config_file:
            return True

        return False

    def __create_cache_files(self) -> bool:
        files = [
            self.__flathub_cache_path,
            self.__snap_cache_path,
            self.__appimage_cache_path,
            self.__updatedAt_cache_path,
            self.__config_path
        ]

        data = dumps({})
        try:
            for file in files:
                with open(file, 'w') as f:
                    f.write(data)
                    f.close()
            return True
        except Exception:
            raise FileExistsError('Could not create cache files!')
