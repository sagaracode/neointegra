import requests
r = requests.get('https://api.neointegratech.com/api/services/')
services = r.json()
print(f"Total services: {len(services)}")
for s in services:
    marker = ">>> " if s['slug'] == 'test-payment' else "    "
    print(f"{marker}{s['slug']}: Rp {s['price']:,.0f}")
