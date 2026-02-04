"""
Timezone utilities for Asia/Jakarta (UTC+7)
"""
from datetime import datetime, timezone, timedelta
import pytz

# Define Jakarta timezone
JAKARTA_TZ = pytz.timezone('Asia/Jakarta')
UTC_TZ = pytz.UTC

def get_jakarta_now() -> datetime:
    """Get current datetime in Asia/Jakarta timezone"""
    return datetime.now(JAKARTA_TZ)

def get_utc_now() -> datetime:
    """Get current datetime in UTC"""
    return datetime.now(UTC_TZ)

def to_jakarta(dt: datetime) -> datetime:
    """Convert datetime to Jakarta timezone"""
    if dt.tzinfo is None:
        # If naive datetime, assume it's UTC
        dt = UTC_TZ.localize(dt)
    return dt.astimezone(JAKARTA_TZ)

def to_utc(dt: datetime) -> datetime:
    """Convert datetime to UTC"""
    if dt.tzinfo is None:
        # If naive datetime, assume it's Jakarta time
        dt = JAKARTA_TZ.localize(dt)
    return dt.astimezone(UTC_TZ)

def format_jakarta_time(dt: datetime, format: str = "%d %B %Y, %H:%M WIB") -> str:
    """Format datetime in Jakarta timezone with WIB suffix"""
    jakarta_dt = to_jakarta(dt) if dt.tzinfo else JAKARTA_TZ.localize(dt)
    return jakarta_dt.strftime(format)

# For backward compatibility - returns naive datetime in Jakarta time
def now_jakarta() -> datetime:
    """Get current datetime as naive datetime in Jakarta timezone"""
    return datetime.now(JAKARTA_TZ).replace(tzinfo=None)
