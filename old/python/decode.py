import requests
import json
import base64

def fetch_and_process_url(url):
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    base64_url = data['url']
    decoded_data = base64.b64decode(base64_url)
    with open('decoded.zip', 'wb') as file:
        file.write(decoded_data)
    print("File saved successfully as 'decoded_file'")
url = input("Enter the URL: ")
fetch_and_process_url(env.store_url+"?id="+url)
