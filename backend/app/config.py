import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    """
    Application configuration.
    """

    APP_NAME = "BookVerse Push Backend"

    VAPID_PUBLIC_KEY = os.getenv(
        "VAPID_PUBLIC_KEY"
    )

    VAPID_PRIVATE_KEY = os.getenv(
        "VAPID_PRIVATE_KEY"
    )

    VAPID_SUBJECT = os.getenv(
        "VAPID_SUBJECT"
    )


settings = Settings()