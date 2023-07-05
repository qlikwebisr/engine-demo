import ssl
import websocket
import json
import pandas as pd


engine_header = {'X-Qlik-User: UserDirectory=QLIK; UserId=student2'}
certs = ({"ca_certs": "certs/root.pem", "certfile": "certs/client.pem", "keyfile": "certs/client_key.pem", "cert_reqs": ssl.CERT_NONE, "server_side": False})
engine_endpoint = "ec2amaz-bajlcb5.qlik.default.com"

getDocList = {
	"handle": -1,
	"method": "GetDocList",
	"params": {},
	"outKey": -1,
	"id": 3
}


getScript = {
	"handle": 1,
	"method": "GetScript",
	"params": {},
	"outKey": -1,
	"id": 3
}

publish = {
	"handle": 1,
	"method": "Publish",
	"params": {
		"qStreamId": "2a63aa89-1af5-4e1c-9c18-bbcc612b188b",
		"qName": "Vered_Order Model Process"
	}
}

def get_doc_list(ws):
	ws.send(json.dumps(getDocList))
	return json.loads(ws.recv())

def get_script(ws):
	ws.send(json.dumps(getScript))
	return json.loads(ws.recv())

def open_doc(ws, appid):
	ws.send(json.dumps({
		"method": "OpenDoc",
		"handle": -1,
		"params": [
			f"{appid}"
		],
		"outKey": -1,
		"id": 2
		}))
	return ws.recv()

def swap_script(app_id):
	uri = f"wss://{engine_endpoint}:4747/app"
	ws = websocket.create_connection(uri, sslopt=certs, header=engine_header, verify=False)
	#rec = ws.recv()
	#rec = open_doc(ws, app_id)
	ws.send(json.dumps(getDocList))
	receieve = json.loads(ws.recv())
	print(receieve)
	# rec = get_script(ws)
	# newscript = addword + rec["result"]["qScript"]
	# print(newscript)
	# #print(newscript)
	# ws.send((json.dumps({"handle": 1,
	# 	"method": "SetScript",
	# 	"params": {
	# 		"qScript": f"{newscript}"
	# 	}})))
	ws.close()

#swap_script("06b38521-db59-40eb-92b2-14bf95c2e040")

# pip install websocket-client
# connection name	connection type	path or ip	user	password
# Sales_DB	folder	D:\QlikData\Sales_DB
# Sales_ETL	folder	D:\QlikData\Sales_ETL
# Sales_Final	folder	D:\QlikData\Sales_Final
# erp	MsSql	192.168.1.1	qlik	123456


createApps = {
	"handle": -1,
	"method": "CreateApp",
	"params": {
		"qAppName": "",
		"qLocalizedScriptMainSection": "Test app 2"
	}
}

def get_app_names():
	#df = pd.read_excel('C:/Users/student2/Desktop/Project/ravine-demo-main/ravine-demo-main/Python_API_Project.xlsx',sheet_name='general', index_col=0)
	df = pd.read_excel('./Python_API_Project.xlsx',sheet_name='Create_Apps', index_col=0)
	app_values = df[''].values
	print(app_values)
	
def create_apps():
	uri = f"wss://{engine_endpoint}:4747"
	ws = websocket.create_connection(uri, sslopt=certs, header=engine_header, verify=False)
	ws.send(json.dumps(createApps))
	receieve = json.loads(ws.recv())
	print(receieve)
	receieve2 = json.loads(ws.recv())
	print(receieve2)
 
     

# create_apps()
get_app_names()
