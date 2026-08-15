from fastapi import APIRouter

from app.models.push import PushSubscription
from app.services.subscription_service import (
    save_subscription
)


router = APIRouter(
    prefix="/api/push",
    tags=["Push Notifications"]
)


@router.post("/subscribe")
def subscribe(
    subscription: PushSubscription
):
    """
    Receive and store a Push Subscription
    from the frontend.
    """

    is_new = save_subscription(
        subscription
    )

    if is_new:

        return {
            "success": True,
            "message": "Push subscription saved successfully.",
            "created": True
        }

    return {
        "success": True,
        "message": "Push subscription already exists.",
        "created": False
    }