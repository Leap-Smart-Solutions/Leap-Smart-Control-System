from firebase_admin import credentials, db, initialize_app

cred = credentials.Certificate("secrets/firebase_admin.json")
initialize_app(cred, {
    'databaseURL': 'https://leap-smart-band-default-rtdb.firebaseio.com/'
})

db.reference("thief").set(1)
print("✅ thief set to 1")
