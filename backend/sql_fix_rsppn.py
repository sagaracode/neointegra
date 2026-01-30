"""
Direct SQL update for RSPPN password
"""
import sqlite3
import bcrypt

# Connect to database
db_path = "neointegratech.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

email = "web@rsppn.co.id"
password = "rsppn178#"

# Hash password
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

print(f"Updating RSPPN user: {email}")

# Check if user exists
cursor.execute("SELECT id, email, full_name FROM users WHERE email = ?", (email,))
user = cursor.fetchone()

if user:
    print(f"Found user: ID={user[0]}, Name={user[2]}")
    
    # Update password and other fields
    cursor.execute("""
        UPDATE users 
        SET hashed_password = ?,
            full_name = 'RSPPN Soedirman',
            company_name = 'RSPPN Soedirman',
            is_active = 1,
            is_verified = 1
        WHERE email = ?
    """, (hashed, email))
    
    conn.commit()
    print(f"✅ Password updated successfully!")
    print(f"✅ Login credentials:")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
else:
    print(f"User not found. Creating...")
    cursor.execute("""
        INSERT INTO users (email, full_name, phone, company_name, hashed_password, is_active, is_verified)
        VALUES (?, 'RSPPN Soedirman', '08123456789', 'RSPPN Soedirman', ?, 1, 1)
    """, (email, hashed))
    conn.commit()
    print(f"✅ User created!")

conn.close()
print(f"\n✅ DONE! Try logging in now.")
