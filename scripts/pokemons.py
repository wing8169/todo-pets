import requests
from bs4 import BeautifulSoup
import json

url = "https://pokemondb.net/pokedex/national"

page = requests.get(url)

soup = BeautifulSoup(page.content, "html.parser") # parse HTML elements

main_element = soup.find(id="main")
sprites = main_element.find_all("div")

result = {}
for sprite in sprites:
    try:
        name = sprite.span.a.span["data-alt"]
        # preprocess name to remove the word "sprite"
        space_index = name.rindex(" ")
        name = name[:space_index]
        src = sprite.span.a.span["data-src"]
        # preprocess src to keep the file name only
        slash_index = src.rindex("/")
        src = src[slash_index+1:]
        result[name] = src
    except:
        # Do nothing
        continue
print(result)

# Serializing json
json_object = json.dumps(result, indent=4)

# export result into JSON
with open("pokemons.json", "w") as outfile:
    outfile.write(json_object)
