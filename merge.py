import json
import sys

# specify the directory containing the json files
if(len(sys.argv) < 1):
    print("Usage: merge.py <FILE 1> <FILE 2>")
    exit()

json1 = open(sys.argv[1],"r")
json2 = open(sys.argv[2],"r")

json1_data = json.load(json1)
json2_data = json.load(json2)

for data in json2_data:
    if data in json1_data:
        json1_data[data]['events'] = json2_data[data]['events']
    else:
        json1_data[data] = json2_data[data]


# write the combined data to a new json file
with open("merged.json", "w") as file:
    json.dump(json1_data, file)

