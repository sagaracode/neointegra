"""
Test timezone implementation
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.timezone import now_jakarta, get_jakarta_now, format_jakarta_time
from datetime import datetime

print("\n" + "="*60)
print("TIMEZONE TEST - Asia/Jakarta (UTC+7)")
print("="*60)

# Test 1: Get Jakarta time (naive)
print("\n1. now_jakarta() - Naive datetime:")
jakarta_naive = now_jakarta()
print(f"   Result: {jakarta_naive}")
print(f"   Type: {type(jakarta_naive)}")
print(f"   Has timezone: {jakarta_naive.tzinfo is not None}")

# Test 2: Get Jakarta time (aware)
print("\n2. get_jakarta_now() - Timezone-aware:")
jakarta_aware = get_jakarta_now()
print(f"   Result: {jakarta_aware}")
print(f"   Type: {type(jakarta_aware)}")
print(f"   Timezone: {jakarta_aware.tzinfo}")

# Test 3: Format with WIB
print("\n3. format_jakarta_time() - Formatted:")
formatted = format_jakarta_time(jakarta_naive)
print(f"   Result: {formatted}")

# Test 4: Custom format
print("\n4. Custom format:")
custom = format_jakarta_time(jakarta_naive, "%d/%m/%Y %H:%M:%S")
print(f"   Result: {custom}")

# Test 5: Order number format
print("\n5. Order number format:")
order_timestamp = jakarta_naive.strftime("%Y%m%d-%H%M%S")
print(f"   Result: ORD-{order_timestamp}")

# Test 6: iPaymu timestamp format
print("\n6. iPaymu timestamp format:")
ipaymu_timestamp = jakarta_naive.strftime("%Y%m%d%H%M%S")
print(f"   Result: {ipaymu_timestamp}")

# Test 7: Compare with system time
print("\n7. Comparison:")
system_time = datetime.now()
print(f"   System time: {system_time}")
print(f"   Jakarta time: {jakarta_naive}")
print(f"   Difference: {(jakarta_naive - system_time).total_seconds()} seconds")

print("\n" + "="*60)
print("✅ TIMEZONE TEST COMPLETE")
print("="*60)
print("\nSemua datetime operations sekarang menggunakan Asia/Jakarta (UTC+7)")
