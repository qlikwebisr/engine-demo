import requests
import json

headers = {"X-Qlik-XrfKey": "iiUNaaVTY3nQmTTZ", "X-Qlik-User": "UserDirectory=EC2AMAZ-OKLUS7R; UserId=qlikadmin"}

xref = 'iiUNaaVTY3nQmTTZ'
host = '54.216.153.136:4242'

certificate = ('client.pem','client_key.pem')

def test_connection():
	endpoint = 'qrs/about'
	response = requests.get("https://{0}/{1}?xrfkey={2}".format(host, endpoint, xref), headers=headers, verify=False, cert=certificate)
	respjson = json.loads(response.content.decode('utf-8'))
	return respjson
	
def get_apps():
	endpoint = 'qrs/app'
	response = requests.get("https://{0}/{1}?xrfkey={2}".format(host, endpoint, xref), headers=headers, verify=False, cert=certificate)
	respjson = json.loads(response.content.decode('utf-8'))
	return respjson

def get_all_qlik():
	all_apps = get_apps()
	for app in all_apps:
		if "Qlik" in app["name"]:
			print(app["name"])

def get_streams():
	endpoint = 'qrs/stream'
	response = requests.get("https://{0}/{1}?xrfkey={2}".format(host, endpoint, xref), headers=headers, verify=False, cert=certificate)
	respjson = json.loads(response.content.decode('utf-8'))
	print(respjson)
	return respjson

def create_stream():
	data = {"id": "2a63aa89-1af5-4e1c-9c18-bbcc612b188b", "name": "fixed_name"}
	endpoint = 'qrs/stream/2a63aa89-1af5-4e1c-9c18-bbcc612b188b'
	response = requests.put("https://{0}/{1}?xrfkey={2}".format(host, endpoint, xref), headers=headers, json=data, verify=False, cert=certificate)
	respjson = json.loads(response.content.decode('utf-8'))
	print(respjson)
	return respjson



create_stream()

# Every API endpoint is here - https://help.qlik.com/en-US/sense-developer/February2019/APIs/repositoryserviceapi/index.html?page=390
# pip install requests