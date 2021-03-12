import argparse
from cache_manager import CacheManager
from helpers import error_message, success_message

from main import Main


def main():
    parser = argparse.ArgumentParser(description='Search for packages.')
    parser.add_argument('package', type=str, nargs="+", help="test")
    parser.add_argument('--enableCache', action="store_true")
    parser.add_argument('--disableCache', action="store_true")
    parser.add_argument('--forceUpdateCache', action="store_true")
    parser.add_argument('--enableExperiementalFeatures', action="store_true")
    res = parser.parse_args()
    package_name = res.package[0]
    cache = bool(res.enableCache)
    disable_cache = bool(res.disableCache)
    force_cache_update = bool(res.forceUpdateCache)
    experiemental_features = bool(res.enableExperiementalFeatures)
    cache_manager = CacheManager()

    if cache:
        success_message('⚡ Your cache will now be enabled.')
        cache_manager.update_cache_statment(True)

    if disable_cache:
        success_message('⚡ Your cache will now be disabled.')
        cache_manager.update_cache_statment(False)

    Main(package_name=package_name, enable_cache=cache,
         force_cache_update=force_cache_update, experiemental_features=experiemental_features).search_for_application()


try:
    main()
except KeyboardInterrupt:
    error_message("Quitting!")
