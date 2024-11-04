import requests
from bs4 import BeautifulSoup
import os

# Set up search parameters
course_names = [
    "Amherst Golf Club", "Bacon's Par-3 Golf Course", "Antigonish Golf and Country Club",
    # add other courses here
]

image_folder = 'images'
if not os.path.exists(image_folder):
    os.makedirs(image_folder)

def fetch_image_url(query):
    search_url = f"https://www.bing.com/images/search?q={query.replace(' ', '+')}"
    response = requests.get(search_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    first_image = soup.find('img')
    if first_image and 'src' in first_image.attrs:
        return first_image['src']
    return None

# Download images
for name in course_names:
    print(f"Fetching image for: {name}")
    image_url = fetch_image_url(name + " golf course")
    if image_url:
        img_data = requests.get(image_url).content
        with open(f"{image_folder}/{name.replace(' ', '-').lower()}.jpg", 'wb') as handler:
            handler.write(img_data)
        print(f"Saved image for: {name}")
    else:
        print(f"No image found for: {name}")
