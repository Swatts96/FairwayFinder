import requests
from bs4 import BeautifulSoup
import os
import json
from PIL import Image
from io import BytesIO
import time

# Define the path to the JSON file
json_file_path = 'public/courses.json'

# Load course names from the JSON file
def load_course_names():
    with open(json_file_path, 'r') as file:
        data = json.load(file)
        return [course['name'] for course in data]

# Create an images folder if it doesn't exist
image_folder = './images/courseImages'
if not os.path.exists(image_folder):
    os.makedirs(image_folder)

# Fetch the first large image URL for a given query
def fetch_image_url(query):
    search_url = f"https://www.bing.com/images/search?q={query.replace(' ', '+')}&qft=+filterui:imagesize-medium"  # Search for medium-sized images
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    response = requests.get(search_url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    images = soup.find_all('img')

    for img in images:
        if 'src' in img.attrs:
            image_url = img['src']
            # Check if URL is valid and is a .jpg or .png image
            if image_url.startswith('http') and ('.jpg' in image_url or '.png' in image_url):
                return image_url
            else:
                print(f"Invalid URL skipped: {image_url}")

    return None

# Load course names from JSON
course_names = load_course_names()

# Download images for each course
for name in course_names:
    print(f"Fetching image for: {name}")
    image_url = fetch_image_url(name + " golf course Nova Scotia")
    
    if image_url:
        try:
            img_data = requests.get(image_url).content
            image = Image.open(BytesIO(img_data))

            # Check image dimensions (minimum width: 200px, minimum height: 200px)
            if image.width >= 200 and image.height >= 200:
                filename = f"{name.replace(' ', '-').lower()}.jpg"
                with open(f"{image_folder}/{filename}", 'wb') as handler:
                    handler.write(img_data)
                print(f"Saved image for: {name}")
            else:
                print(f"Image for {name} did not meet minimum size requirements (200x200).")
        
        except Exception as e:
            print(f"Error saving image for {name}: {e}")
    
    # Sleep to avoid making requests too quickly
    time.sleep(1)  # Adjust the sleep time if you encounter rate-limiting
