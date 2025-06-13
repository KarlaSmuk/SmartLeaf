import json
import time
import random
import paho.mqtt.publish as publish

broker_host = "192.168.197.179"
broker_port = 1883
mqtt_username = "mqttuser"
mqtt_password = "mqttuser"  

node_id = "MESH001"
wasp_id = "WASP123"
secret = "SECRET456"
topic_base = f"waspmote/868LP/{node_id}"

plants = ["1", "2"]

sensor_generators = {
    "soil": lambda: round(random.uniform(15.0, 40.0), 2),   
    "temp": lambda: round(random.uniform(18.0, 30.0), 1),   
    "pressure": lambda: round(random.uniform(1015.0, 1114.0), 1), 
}
while True:
    for plant_id in plants:
        for sensor_type, value_generator in sensor_generators.items():
            sensor_name = f"{sensor_type}{plant_id}"  

            payload = {
                "id": node_id,
                "id_wasp": wasp_id,
                "id_secret": secret,
                "sensor": sensor_name,
                "value": value_generator(),
                "timestamp": str(int(time.time()))
            }

            
            publish.single(
                topic=topic_base,
                payload=json.dumps(payload),
                hostname=broker_host,
                port=broker_port,
                auth={
                    "username": mqtt_username,
                    "password": mqtt_password
                }
            )

            print(f"[{time.strftime('%H:%M:%S')}] Sent {sensor_name}: {payload['value']} to {topic_base}")
            time.sleep(3)  

    time.sleep(1)  
