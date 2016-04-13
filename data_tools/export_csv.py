import csv
import os
import json

source_file = os.path.join(os.path.dirname(__file__), 'output/data.json')
output_file = os.path.join(os.path.dirname(__file__), 'output/data.csv')


def import_json():
    with open(source_file, 'rb') as input_file:
        artist_list = json.loads(input_file.read())["artists"]
        artist_list = sorted(artist_list, key=lambda k: k["artist"])

    return artist_list

def export_csv():
    artist_list = import_json()
    print artist_list
    field_names = ["artist", "genre", "festivals"]
    with open(output_file, 'w') as output_csv:
        writer = csv.DictWriter(output_csv, fieldnames=field_names)
        writer.writeheader()
        for artist in artist_list:
            artist["artist"] = artist["artist"].encode('utf-8')
            writer.writerow(artist)

if __name__ == "__main__":
    export_csv()
