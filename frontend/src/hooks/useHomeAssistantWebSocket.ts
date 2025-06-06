import { useEffect, useRef, useState } from "react";

// -- Types --

export type LatestData = {
    type: "sensor_reading" | "watering_event";
    data: {
        plant_id?: string;
        value?: number;
        timestamp?: string;
        message?: string;
    };
};

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

export function useHomeAssistantWebSocket() {
    const [latest, setLatest] = useState<LatestData | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://${HA_URL}/api/websocket`);
        socketRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "auth", access_token: HA_TOKEN }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "auth_ok") {
                ws.send(
                    JSON.stringify({
                        id: 1,
                        type: "subscribe_events",
                        event_type: "state_changed",
                    })
                );
            }

            if (msg.type === "event" && msg.event?.data?.entity_id) {
                const eventMsg = msg as HAWebSocketEvent;
                const { entity_id, new_state } = eventMsg.event.data;

                if (TARGET_ENTITIES.includes(entity_id)) {
                    const value = parseFloat(new_state.state);
                    const plantId = new_state.attributes?.plant_id;

                    const simplified: LatestData = {
                        type: "sensor_reading",
                        data: {
                            plant_id: plantId,
                            value,
                            timestamp: eventMsg.event.time_fired,
                        },
                    };

                    setLatest(simplified);
                }
            }
        };

        ws.onerror = (err) => console.error("HA WebSocket error:", err);
        ws.onclose = () => console.warn("HA WebSocket closed");

        return () => {
            ws.close();
        };
    }, []);

    return { latest };
}
