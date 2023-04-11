import sys
import csv
import json

# Get the start line from the command-line arguments
if len(sys.argv) < 2:
    print('Usage: python script.py start_line')
    sys.exit(1)

start_line = int(sys.argv[1])
file = sys.argv[2]

rid = [
    'R23-AEMLK',
    'R23-BZDTC',
    'R23-CTQNK',
    'R23-DSWJF',
    'R23-ETRUI',
    'R23-FGKOP',
    'R23-HXVNM',
    'R23-IJLYB',
    'R23-JQWAR',
    'R23-KNFBZ',
    'R23-LGTHD',
    'R23-MVCXS',
    'R23-NROPE',
    'R23-OXZUY',
    'R23-PFADI',
    'R23-QEWKS',
    'R23-RAZXB',
    'R23-SVLNU',
    'R23-TYCJH',
    'R23-UJMPG',
    'R23-VHKRI',
    'R23-WXBNL',
    'R23-XQOEF',
    'R23-YADTZ',
    'R23-ZELJC',
    'R23-AWQXY',
    'R23-BNPKR',
    'R23-CMDZV',
    'R23-DFJSG',
    'R23-EPHOU',
    'R23-FGTWI',
    'R23-HVLNX',
    'R23-IGKMY',
    'R23-JRACE',
    'R23-KBQFD',
    'R23-LUZSJ',
    'R23-MWTOY',
    'R23-NAIPX',
    'R23-OGHEB',
    'R23-PYVRC',
    'R23-QNKJZ',
    'R23-RBTDW',
    'R23-SZMVF',
    'R23-TULXG',
    'R23-VCJYN',
    'R23-WIKPA',
    'R23-XRBNQ',
    'R23-YEGOT',
    'R23-ZLUDH',
    'R23-AFJQK',
    'R23-BPIML',
    'R23-COZTX',
    'R23-DNRSW',
    'R23-EUYVI',
    'R23-FLHDC',
    'R23-GJKNB',
    'R23-HTQAE',
    'R23-IEZFX',
    'R23-JMUYG',
    'R23-KVWLR',
    'R23-LBTZO',
    'R23-MRXNJ',
    'R23-NSDYP',
    'R23-OGAIC',
    'R23-PFVKU',
    'R23-QJWXB',
    'R23-RHYTM',
    'R23-SIKDP',
    'R23-TLNOZ',
    'R23-UMXFC',
    'R23-VSRYJ',
    'R23-WGTHP',
    'R23-XEQUZ',
    'R23-YPCNB',
    'R23-ZODVI',
    'R23-AAPOI',
    'R23-IOPUA',
]

count = 0

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
        ragam_id = rid[count]
        count+=1

        # If this Ragam id isn't already in the JSON data, create a new object for it
        if ragam_id not in json_data:
            json_data[ragam_id] = {
                'name': row['NAME'].strip(),
                'college': row['COLLEGE'].strip(),
                'workshops': [],
                'dates': []
            }

        # Append the workshop and date to the appropriate arrays in the JSON data
        json_data[ragam_id]['workshops'].append(row['PROGRAM'][3:-18])

        if (row['PROGRAM'][0] == '1'):
            date = '11/03/2023'
        else:
            date = '12/03/2023'

        json_data[ragam_id]['dates'].append(date)

# Save the JSON data to a file
    with open('output.json', 'w') as output_file:
        json.dump(json_data, output_file, indent=2)