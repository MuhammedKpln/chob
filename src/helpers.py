class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def info_message(message: str) -> None:
    return print(Colors.OKCYAN + message + Colors.ENDC)


def error_message(message: str) -> None:
    return print(Colors.FAIL + message + Colors.ENDC)


def success_message(message: str) -> None:
    return print(Colors.OKGREEN + message + Colors.ENDC)


def results_text(text: str) -> str:
    return f'\x1b[1;37;42m {text} \x1b[0m'
