import subprocess
import os

env_vars = {
    "MONGODB_DB": "yardvybes",
    "NEXTAUTH_SECRET": "your-super-secret-key-here-make-it-long-and-random",
    "NEXTAUTH_URL": "https://yardvybes.news",
    "NEXT_PUBLIC_APP_NAME": "YaadFeed",
    "NEXT_PUBLIC_SITE_URL": "https://yardvybes.news",
    "NEXT_PUBLIC_USE_AUTO_ADS": "false",
    "OPENAI_API_KEY": "your_openai_api_key_here",
    "ELEVENLABS_API_KEY": "sk_781bd736193726dccbe031713866fbf6afc8d54d428f026f",
    "ELEVENLABS_VOICE_ID": "dhwafD61uVd8h85wAZSE"
}

for k, v in env_vars.items():
    print(f"Updating {k}...")
    subprocess.run(["npx", "vercel", "env", "add", k, "production", "--value", v, "--force", "--yes"])
    
print("Done!")
