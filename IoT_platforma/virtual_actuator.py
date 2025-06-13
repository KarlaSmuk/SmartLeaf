import paho.mqtt.client as mqtt
import json

BROKER = "192.168.197.179"
PORT = 1883
USERNAME = "mqttuser"
PASSWORD = "mqttuser"
TOPIC = "plant/actuator/command"

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        plant = payload.get("plant")
        action = payload.get("action")
        value = payload.get("value")
        print(payload)
        if action == "water":
            print(f"[ACTUATOR] Watering Plant {plant} | Moisture was {value}%")
    except Exception as e:
        print(f"Error handling message: {e}")

client = mqtt.Client()
client.username_pw_set(USERNAME, PASSWORD)
client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER, PORT, 60)
client.loop_forever()
