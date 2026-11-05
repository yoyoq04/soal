from supabase_client import supabase

try:
    print("Testing connection to Supabase...")
    response = supabase.table("User").select("*").execute()
    print("Success! Data retrieved:", response.data)
except Exception as e:
    print("Connection failed with error:", e)