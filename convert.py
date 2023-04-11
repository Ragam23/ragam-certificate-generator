import sys
import csv
import json

# Get the start line from the command-line arguments
if len(sys.argv) < 2:
    print('Usage: python script.py start_line')
    sys.exit(1)

start_line = int(sys.argv[1])
file = sys.argv[2]

# Open the CSV file
with open(file) as csv_file:
    # Parse the CSV data into a dictionary
    csv_reader = csv.DictReader(csv_file)

    # Create a dictionary to hold the JSON data
    json_data = {}

    # Iterate over each row in the CSV data, starting from the specified line
    for i, row in enumerate(csv_reader):
        if i < start_line - 1:
            continue

        # Get the Ragam id for the current row
        ragam_id = row['Ragam id']

        # If this Ragam id isn't already in the JSON data, create a new object for it
        if ragam_id not in json_data:
            json_data[ragam_id] = {
                'name': row['Name'].strip(),
                'college': row['College'].strip(),
                'workshops': [],
                'dates': []
            }

        # Append the workshop and date to the appropriate arrays in the JSON data
        json_data[ragam_id]['workshops'].append(row['Workshop'].upper().strip())

        date = row['Date'].split()
        json_data[ragam_id]['dates'].append(date[0]+'/03/2023')

# Save the JSON data to a file
    with open('output.json', 'w') as output_file:
        json.dump(json_data, output_file, indent=2)