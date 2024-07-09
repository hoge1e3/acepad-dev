import requests
import json
import base64

def fetch_and_process_url(url):
    try:
        # Fetch JSON data from the given URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Parse the JSON data
        data = response.json()
        
        # Check if 'url' attribute exists in the JSON data
        if 'url' not in data:
            raise KeyError("The 'url' attribute is missing from the JSON data")
        
        # Get the base64 encoded URL
        base64_url = data['url']
        
        # Decode the base64 URL
        decoded_data = base64.b64decode(base64_url)
        
        # Save the decoded data to a file
        with open('decoded_file', 'wb') as file:
            file.write(decoded_data)
        
        print("File saved successfully as 'decoded_file'")
    
    except requests.RequestException as e:
        print(f"Error fetching data from URL: {e}")
    except json.JSONDecodeError:
        print("Error decoding JSON data")
    except KeyError as e:
        print(f"Error: {e}")
    except base64.binascii.Error:
        print("Error decoding base64 data")
    except IOError:
        print("Error writing to file")

# Example usage
#url = input("Enter the URL: ")
fetch_and_process_url("https://edit.tonyu.jp/acepad/hash.php?id=25c63671221de9b29a98aac7864d636c802084e21be9ab52b309471cabd0262b")