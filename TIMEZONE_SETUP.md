# Timezone Configuration

## Setting
- **Timezone**: Asia/Jakarta (UTC+7)
- **Format**: WIB (Waktu Indonesia Barat)

## Implementation

### Backend
Semua datetime di backend menggunakan **Asia/Jakarta timezone**:

1. **Order Number Generation**: `ORD-YYYYMMDD-HHMMSS` (Jakarta time)
2. **Payment Timestamps**: `paid_at` menggunakan Jakarta time
3. **Subscription Dates**: `start_date`, `end_date` menggunakan Jakarta time
4. **iPaymu API Timestamp**: Format `YYYYMMDDhhmmss` (Jakarta time)

### Files Updated
- `app/timezone.py` - Timezone utility functions
- `app/config.py` - Added TIMEZONE = "Asia/Jakarta"
- `app/api/endpoints/orders.py` - Order timestamps
- `app/api/endpoints/payments.py` - Payment timestamps
- `app/api/endpoints/subscriptions.py` - Subscription timestamps
- `backend/fix_payment_simple.py` - Manual update script

### Functions
```python
from app.timezone import now_jakarta, to_jakarta, format_jakarta_time

# Get current time in Jakarta
now = now_jakarta()

# Convert any datetime to Jakarta timezone
jakarta_time = to_jakarta(some_datetime)

# Format with WIB suffix
formatted = format_jakarta_time(some_datetime)
# Output: "04 Februari 2026, 15:30 WIB"
```

### Database
- Database menyimpan **naive datetime** dalam timezone Jakarta
- Tidak ada timezone info di database column
- Semua datetime diasumsikan Jakarta time

### Dependencies
- Added `pytz==2024.1` to requirements.txt

## Usage Examples

### Creating Order
```python
from app.timezone import now_jakarta

timestamp = now_jakarta().strftime("%Y%m%d-%H%M%S")
order_number = f"ORD-{timestamp}"
# Result: ORD-20260204-153045 (Jakarta time)
```

### Updating Payment
```python
from app.timezone import now_jakarta

payment.paid_at = now_jakarta()
# Saves Jakarta time to database
```

### Display Format
```python
from app.timezone import format_jakarta_time

# Default format with WIB
display_time = format_jakarta_time(payment.paid_at)
# Output: "04 Februari 2026, 15:30 WIB"

# Custom format
custom = format_jakarta_time(payment.paid_at, "%d/%m/%Y %H:%M")
# Output: "04/02/2026 15:30"
```

## Migration Notes
- **Before**: Used `datetime.now()` and `datetime.utcnow()` (system/UTC time)
- **After**: All use `now_jakarta()` (Asia/Jakarta time)
- **Impact**: Timestamps sekarang konsisten dengan zona waktu Indonesia

## Testing
Untuk memastikan timezone bekerja:
```bash
cd backend
python -c "from app.timezone import now_jakarta, format_jakarta_time; print(format_jakarta_time(now_jakarta()))"
```

Output expected: Current time dengan format WIB
