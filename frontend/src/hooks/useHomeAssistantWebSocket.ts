import { useEffect, useRef, useState } from "react";

type HAWebSocketEvent = {
    id: number;
    type: "event";
    event: {
        event_type: "state_changed";
        data: {
            entity_id: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            old_state: any;
            new_state: {
                state: string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                attributes: Record<string, any>;
                last_changed: string;
                last_updated: string;
            };
        };
        origin: string;
        time_fired: string;
    };
};

const HA_URL = import.meta.env.VITE_HA_URL;
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN;

const TARGET_ENTITIES = [
    "sensor.air_temperature",
    "sensor.air_humidity",
    "sensor.air_pressure",
    "sensor.leaf_moisture",
];


export type SensorAlert = {
    type: "sensor_reading" | "watering_event";
    data: {
        plant_id?: string;
        sensor_type?: SensorType;
        value?: number;
        timestamp: string;
        message?: string;
        friendly_name?: string;
        alert?: "above" | "below";
    };
};

type SensorType = "moisture" | "temperature" | "humidity" | "pressure";

export function useHomeAssistantWebSocket() {
    const [latestAlerts, setLatestAlerts] = useState<SensorAlert | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://${HA_URL}/api/websocket`);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("🔌 WebSocket connected, sending auth");
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "auth_required") {
                ws.send(JSON.stringify({ type: "auth", access_token: HA_TOKEN }));
            }

            if (msg.type === "auth_ok") {
                ws.send(
                    JSON.stringify({
                        id: 1,
                        type: "subscribe_events",
                        event_type: "state_changed",
                    })
                );
            }

            if (msg.type === "event") {
                const eventMsg = msg as HAWebSocketEvent;
                const { entity_id, new_state } = eventMsg.event.data;

                if (TARGET_ENTITIES.includes(entity_id)) {
                    const value = parseFloat(new_state.state);
                    const plantId = new_state.attributes?.plant_id;
                    const friendly_name = new_state.attributes?.friendly_name;
                    const timestamp = eventMsg.event.time_fired;
                    const alert = new_state.attributes.alert; // "above" or "below"
                    // Optional: map entity_id to sensor_type
                    const ENTITY_TYPE_MAP: Record<string, SensorType> = {
                        "sensor.air_temperature": "temperature",
                        "sensor.air_humidity": "humidity",
                        "sensor.air_pressure": "pressure",
                        "sensor.leaf_moisture": "moisture",
                    };
                    const sensor_type = ENTITY_TYPE_MAP[entity_id];

                    const simplified: SensorAlert = {
                        type: "sensor_reading",
                        data: {
                            plant_id: plantId,
                            sensor_type,
                            value,
                            timestamp,
                            friendly_name,
                            alert,
                        },
                    };

                    setLatestAlerts(simplified);
                }

            }
        };

        ws.onerror = (err) => console.error("HA WebSocket error:", err);
        ws.onclose = () => console.warn("HA WebSocket closed");

        return () => {
            ws.close();
        };
    }, []);

    return { latestAlerts };
}

export function getMockSensorAlerts(): SensorAlert[] {
    return mockSensorAlerts;
}
export const mockSensorAlerts: SensorAlert[] = [
    {
        type: "sensor_reading",
        data: {
            plant_id: "1",
            friendly_name: "Aloe Vera",
            sensor_type: "moisture",
            value: 25, // Below threshold (30)
            timestamp: "2025-06-06T10:00:00Z",
            alert: "below",
        },
    },
    {
        type: "sensor_reading",
        data: {
            plant_id: "1",
            friendly_name: "Aloe Vera",
            sensor_type: "temperature",
            value: 35, // Above threshold (30)
            timestamp: "2025-06-06T10:01:00Z",
            alert: "above",
        },
    },
    {
        type: "sensor_reading",
        data: {
            plant_id: "2",
            friendly_name: "Tomato Plant",
            sensor_type: "humidity",
            value: 25, // Below threshold (40)
            timestamp: "2025-06-06T10:02:00Z",
            alert: "below",
        },
    },
    {
        type: "sensor_reading",
        data: {
            sensor_type: "temperature",
            friendly_name: "Room Temperature",
            value: 34,
            timestamp: "2025-06-06T10:10:00Z",
            alert: "above",
        },
    },
    {
        type: "sensor_reading",
        data: {
            sensor_type: "humidity",
            friendly_name: "Room Humidity",
            value: 30,
            timestamp: "2025-06-06T10:11:00Z",
            alert: "below",
        },
    },
    {
        type: "sensor_reading",
        data: {
            sensor_type: "pressure",
            friendly_name: "Barometric Pressure",
            value: 1032,
            timestamp: "2025-06-06T10:12:00Z",
            alert: "above",
        },
    },
    {
        type: "watering_event",
        data: {
            plant_id: "1",
            message: "Watering started",
            timestamp: "2025-06-06T10:15:00Z",
        },
    },
];

