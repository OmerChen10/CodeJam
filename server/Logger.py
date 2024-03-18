import logging
import traceback
from colorama import Fore, Back, Style

class Logger:

    logger = logging.getLogger("CodeJam")
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(f'[%(asctime)s] %(message)s')
    fh = logging.FileHandler('Server.log')
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(formatter)

    logger.addHandler(fh)

    @staticmethod
    def log_info(message):
        print(Fore.WHITE + Style.BRIGHT + "[INFO] " + Style.RESET_ALL + message)
        Logger.logger.info("[INFO] " + message)

    
    @staticmethod
    def log_debug(message):
        print(Fore.YELLOW + Style.BRIGHT + "[DEBUG] " + Style.RESET_ALL + message)
        Logger.logger.debug("[DEBUG] " + message)

    
    def log_error(message, e: Exception =None):
        print(Fore.RED + Style.BRIGHT + "[ERROR] " + Style.RESET_ALL + message)
        Logger.logger.error("[ERROR] " + message + "\n" + traceback.format_exc() if e is not None else "")



    @staticmethod
    def catch_exceptions(func):
        def handle(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            
            except Exception as e:
                Logger.log_error(f'Exception in "{func.__name__}"', e)

        return handle


