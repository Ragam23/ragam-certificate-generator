import json
import os

# specify the directory containing the json files
directory = "/home/SinadShan/dev/webdev/rcertgen/data/data/"

# create an empty dictionary to hold the combined data
combined_data = {}

# loop through each file in the directory
for filename in os.listdir(directory):
    # check that the file is a json file
    if filename.endswith(".json"):
        # read the json data from the file
        with open(directory + filename, "r") as file:
            json_data = json.load(file)
        # add the data to the combined dictionary, using the filename as the key
        combined_data[filename[:-5]] = json_data

# write the combined data to a new json file
with open("combined.json", "w") as file:
    json.dump(combined_data, file)

# This script first specifies the directory containing the json files, then creates an empty dictionary to hold the combined data. It then loops through each file in the directory, reads the json data from each file, and adds it to the combined dictionary using the filename (with the ".json" extension removed) as the key.

# Finally, it writes the combined dictionary to a new json file named "combined.json" using the json.dump() method.
