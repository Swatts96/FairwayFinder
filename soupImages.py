import requests
from bs4 import BeautifulSoup
import os
import json
from PIL import Image
from io import BytesIO

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
    search_url = f"https://www.bing.com/images/search?q={query.replace(' ', '+')}&qft=+filterui:imagesize-large"
    response = requests.get(search_url)
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
        img_data = requests.get(image_url).content
        image = Image.open(BytesIO(img_data))

        # Check image dimensions (example: only save if width > 400px and height > 300px)
       # Check if image meets minimum dimensions (e.g., minimum width of 400px and height of 300px)
        if image.width >= 400 and image.height >= 300:
            filename = f"{name.replace(' ', '-').lower()}1.jpg"
            with open(f"{image_folder}/{filename}", 'wb') as handler:
                handler.write(img_data)
            print(f"Saved image for: {name}")
        else:
            print(f"Image for {name} did not meet minimum size requirements.")

