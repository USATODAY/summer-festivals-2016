import json
import requests
import os

slack_url = os.environ.get("SLACK_URL", None)

def slack_notify(message, channel):
  jsonpayload = json.dumps({"text": message, "username": "Rasberry Pi", "icon_url": "http://www.gannett-cdn.com/experiments/usatoday/_common/_images/raspberry_pi_logo.png", "channel": channel})
  r = requests.post(slack_url, data=jsonpayload)
