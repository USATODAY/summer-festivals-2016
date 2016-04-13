from gdocs import GoogleDoc

doc_1 = {
    "key": "1pMS2qys4yN8tATPIv_PmXXunCMsEK1JKJfb5bIbibgY",
    "file_name": "data",
    "file_format": "xlsx"
}

def get_data():
    g = GoogleDoc(**doc_1)
    g.get_auth()
    g.get_document()
    
if __name__ == "__main__":
    get_data()
