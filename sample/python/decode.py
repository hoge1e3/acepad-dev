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
fetch_and_process_url("https://edit.tonyu.jp/acepad/hash.php?id="+url)
#25c63671221de9b29a98aac7864d636c802084e21be9ab52b309471cabd0262b")