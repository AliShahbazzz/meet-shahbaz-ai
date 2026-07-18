import os
from datetime import datetime, timezone

import httpx


def log_question(question: str) -> None:
    webhook_url = os.environ.get("SHEETS_WEBHOOK_URL")
    webhook_secret = os.environ.get("SHEETS_WEBHOOK_SECRET")

    if not webhook_url:
        return

    try:
        httpx.post(
            webhook_url,
            json={
                "secret": webhook_secret,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "question": question,
            },
            timeout=10,
        ).raise_for_status()
    except Exception as error:
        print(f"Failed to log question to Google Sheet: {error}")
