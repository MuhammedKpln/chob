from cache_manager import CacheManager, UpdateCache
from github import GitHub
from helpers import error_message, info_message, results_text, success_message
from typing import List
from api_client import ApiClient
from serializer import serialize_appimage_data, serialize_flathub_data, serialize_snap_data
from type.application import Application, Types
import webbrowser


class Main:
    applications: List[Application] = []
    founded_apps: List[Application] = []
    api_client: ApiClient
    package_name: str
    cache: bool = False
    force_cache_update: bool = False
    experiemental_features: bool = False
    cache_manager: CacheManager

    def __init__(self, package_name: str, enable_cache: bool, force_cache_update: bool,
                 experiemental_features: bool) -> None:
        self.api_client = ApiClient()
        self.package_name = package_name
        self.cache = enable_cache
        self.force_cache_update = force_cache_update
        self.cache_manager = CacheManager()
        self.experiemental_features = experiemental_features
        self.__fetch_data()

    def __fetch_data(self) -> None:
        if not self.cache and not self.cache_manager.is_cache_enabled:
            info_message(
                '\n ⚡ Complaining about slow search results? Try caching results by adding --enableCache argument at the end of your command! \n')

        info_message(
            f'Searching for {self.package_name} in application repos..')

        self.api_client.get_appimage_data()
        self.api_client.get_flathub_data()
        self.api_client.get_snap_data()

        if self.cache:
            data: UpdateCache = {
                "flathub_data": self.api_client.flathub_data,
                "snap_data": self.api_client.snap_data,
                "appimage_data": self.api_client.appimage_data,
            }

            self.cache_manager.update_cache(data)

        self.applications.extend(
            serialize_appimage_data(self.api_client.appimage_data)
        )
        self.applications.extend(
            serialize_snap_data(self.api_client.snap_data)
        )
        self.applications.extend(
            serialize_flathub_data(self.api_client.flathub_data)
        )

    def search_for_application(self) -> None:
        for app in self.applications:
            if self.package_name in app['name'].lower():
                self.founded_apps.append(app)

        success_message('Found those apps: ')
        number: int = -1
        for app in self.founded_apps:
            number = number + 1
            print(results_text(
                f'{number}) {app["name"]} - {app["type"].value}'))

        try:
            user_input = int(input('Select an application code: '))
            app = self.founded_apps[user_input]

            if self.experiemental_features and app["type"] == Types.APPIMAGE:
                if (self.ask_for_installation()):
                    info_message('Downloading AppImage automatically...')
                    if app['repo_url']:
                        download = self.download_appimage(
                            app.get('repo_url') or '', app['name'])
                    return None
            success_message(f'Opening {app["name"]} - {app["type"].value}')

            webbrowser.open_new_tab(app['src'])
        except ValueError:
            error_message('Please type in a number!')

    def ask_for_installation(self) -> bool:
        agreement = input(
            'Do you want to install AppImage automatically? [Y/n]')

        if agreement and agreement.lower() == 'y':
            return True

        return False

    def download_appimage(self, repo_url: str, app_name: str) -> bool:
        github_api = GitHub(repo_url)
        latest_release = github_api.get_the_latest_release()

        download_url: str = ''
        if latest_release:
            info_message('Found latest release, trying to download...')

            for asset in latest_release['assets']:
                if asset['name'].endswith('.AppImage') or asset['name'].endswith('.appimage'):
                    download_url = asset['browser_download_url']

            downloaded = self.api_client.download(
                download_url, app_name + '.AppImage')
            if downloaded:
                success_message('Successfully downloaded ' + app_name)
            return True
        return False
