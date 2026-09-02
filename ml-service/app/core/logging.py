import logging


LOG_FORMAT = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def configure_logging() -> None:
    """
    Configure application-wide logging for the ML service.

    This provides a consistent log format across the application while
    allowing individual modules to create their own named loggers.
    """

    root_logger = logging.getLogger()

    # Avoid adding duplicate handlers if configuration is called again.
    if root_logger.handlers:
        root_logger.setLevel(logging.INFO)
        return

    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter(
            fmt=LOG_FORMAT,
            datefmt=DATE_FORMAT,
        )
    )

    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)