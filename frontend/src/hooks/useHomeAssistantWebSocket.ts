import { useEffect, useRef } from "react";

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

export function useHomeAssistantWebSocket(
    onThresholdUpdate?: (entity_id: string, state: string) => void
) {
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
                if (entity_id.endsWith("threshold")) {
                    const state = new_state.state;
                    onThresholdUpdate?.(entity_id, state);
                }

            }
        };

        ws.onerror = (err) => console.error("HA WebSocket error:", err);
        ws.onclose = () => console.warn("HA WebSocket closed");
    }, [onThresholdUpdate]);
}