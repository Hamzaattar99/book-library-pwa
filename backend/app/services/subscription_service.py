import json
from pathlib import Path

from app.models.push import PushSubscription


BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data"

SUBSCRIPTIONS_FILE = DATA_DIR / "subscriptions.json"


def ensure_storage():
    """
    Make sure the storage directory and file exist.
    """

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if not SUBSCRIPTIONS_FILE.exists():

        SUBSCRIPTIONS_FILE.write_text(
            "[]",
            encoding="utf-8"
        )


def load_subscriptions() -> list[dict]:
    """
    Load all saved Push Subscriptions.
    """

    ensure_storage()

    try:

        content = SUBSCRIPTIONS_FILE.read_text(
            encoding="utf-8"
        )

        data = json.loads(content)

        if not isinstance(data, list):
            return []

        return data

    except (
        json.JSONDecodeError,
        OSError
    ):

        return []


def save_subscriptions(
    subscriptions: list[dict]
):
    """
    Save all Push Subscriptions.
    """

    ensure_storage()

    SUBSCRIPTIONS_FILE.write_text(
        json.dumps(
            subscriptions,
            indent=4,
            ensure_ascii=False
        ),
        encoding="utf-8"
    )


def save_subscription(
    subscription: PushSubscription
) -> bool:
    """
    Save a Push Subscription.

    Returns True if a new subscription
    was added.

    Returns False if the subscription
    already exists.
    """

    subscriptions = load_subscriptions()

    subscription_data = (
        subscription.model_dump()
    )

    endpoint = subscription.endpoint

    for existing in subscriptions:

        if existing.get("endpoint") == endpoint:

            return False

    subscriptions.append(
        subscription_data
    )

    save_subscriptions(
        subscriptions
    )

    return True