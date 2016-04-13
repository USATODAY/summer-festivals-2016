import xlrd
import json
import os
import datetime
import re
from slack_tools import slack_notify

source_file = os.path.join(os.path.dirname(__file__), 'src/data.xlsx')
output_json_file = os.path.join(os.path.dirname(__file__), 'output/data.json')

def open_file():
    wb = xlrd.open_workbook(source_file)
    return wb

def create_master_list(festivals_list):
    master_dict = {}
    master_list = []
    for festival_list in festivals_list:
        for artist_dict in festival_list:
            artist_key_name = clean_band_name(artist_dict["artist"])
            if artist_key_name in master_dict.keys():
                master_dict[artist_key_name]["festivals"].append(artist_dict["festivals"][0])
            else:
                print "+ %s" % artist_dict["artist"]
                master_dict[artist_key_name] = artist_dict

    for artist_name, artist_dict in master_dict.iteritems():
        master_list.append(artist_dict)

    return master_list

def clean_band_name(name_string):
    no_spaces = re.sub(r"\s+", "_", name_string.strip())
    no_ampersands = re.sub(r"&+", "and", no_spaces)
    return no_ampersands.lower()

def clean_festival_name(name_string):
    no_spaces = re.sub(r"\s+", "_", name_string.strip())
    no_exclamation = re.sub(r"!+", "", no_spaces)
    no_ampersands = re.sub(r"&+", "", no_exclamation)
    no_punctuation = re.sub(r"[\.,-\/#!$%\^&\*;:{}=\-\'`~()]+", "", no_ampersands)
    return no_punctuation.lower()


def create_festival_list(sheet):
    festival_list = []
    for rownum in range(1, sheet.nrows):
        if sheet.cell(rownum, 0).ctype is not 1:
            artist_name = str(int(sheet.cell(rownum, 0).value))
        else:
            artist_name = sheet.cell(rownum, 0).value
        artist_dict = {
            "artist": artist_name,
            "genre": sheet.cell(rownum, 1).value,
            "festivals": [create_festival_tag(sheet.name)]
        }
        festival_list.append(artist_dict)
    return festival_list

def create_festival_tag(festival_name):
    #This name gets truncated by Google. Fixing manually for now
    if festival_name == "New Orleans Jazz & Heritage Fes":
        festival_name = "New Orleans Jazz & Heritage Fest"
    return {
        "full_name": festival_name,
        "tag_name": clean_festival_name(festival_name)
    }

def create_festivals_list(sheet):
    festivals_list = []
    for rownum in range(1, sheet.nrows - 1):
        festival_dict = {
            "name": sheet.cell(rownum, 0).value.encode('utf-8'),
            "tagName": clean_festival_name(sheet.cell(rownum, 0).value.encode('utf-8')),
            "date": sheet.cell(rownum, 1).value,
            "location": sheet.cell(rownum, 2).value,
            "url": sheet.cell(rownum, 3).value
        }
        festivals_list.append(festival_dict)

    return festivals_list


def format_data():
    print "opening source file"
    wb = open_file()

    #a list in which to store each festival
    festivals_list = []

    # loop through the sheets and app the results to the list
    print "looping through source festivals"
    for sheet_num in range(1, wb.nsheets - 2):
        sh = wb.sheet_by_index(sheet_num)
        festival_list = create_festival_list(sh)
        festivals_list.append(festival_list)

    # create master artist list
    artist_list = sorted(create_master_list(festivals_list), key=lambda k: len(k["festivals"]))

    #create master festivals dict
    festivals_master_list = create_festivals_list(wb.sheet_by_index(0))
    
    print "Saving data to JSON"

    with open (output_json_file, 'w') as output_file:
        json.dump({'artists': artist_list, 'festivals': festivals_master_list}, output_file)

    print "success"


if __name__ == "__main__":
    format_data()
