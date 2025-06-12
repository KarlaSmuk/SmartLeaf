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
                attributes: {
                    unit_of_measurement?: string;
                    friendly_name?: string;
                };
                last_updated: string;
            };
        };
    };
};

const HA_URL = import.meta.env.VITE_HA_URL;
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN;


export type SensorAlert = {
    type: "sensor_reading" | "watering_event";
    data: {
        plant_id?: string;
        sensor_type?: SensorType;
        state?: string;
        unit_of_measurement?: string;
        timestamp: string;
        message?: string;
        friendly_name?: string;
    };
};

type SensorType = "moisture" | "temperature" | "humidity" | "pressure";

export function useHomeAssistantWebSocket() {
    const [latestAlert, setLatestAlert] = useState<SensorAlert | null>(null);
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
                if (entity_id.startsWith("automation.")) {
                    console.log(msg)

                    const state = new_state.state;
                    const timestamp = new_state.last_updated;
                    const friendly_name = new_state.attributes.friendly_name;
                    const unit_of_measurement = new_state.attributes.unit_of_measurement;

                    const simplified: SensorAlert = {
                        type: "sensor_reading",
                        data: {
                            state,
                            timestamp,
                            friendly_name,
                            unit_of_measurement
                        },
                    };

                    setLatestAlert(simplified);
                }

            }
        };

        ws.onerror = (err) => console.error("HA WebSocket error:", err);
        ws.onclose = () => console.warn("HA WebSocket closed");

        return () => {
            ws.close();
        };
    }, []);


    return { latestAlert };
}