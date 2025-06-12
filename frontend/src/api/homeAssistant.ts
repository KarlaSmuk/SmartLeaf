const HA_URL = "http://" + import.meta.env.VITE_HA_URL;
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN;

export type HAEntity = {
    entity_id: string;
    state: string;
    attributes: {
        // for all entities
        friendly_name?: string;
        timestamp?: string;
        // for plant entities
        plant_id?: string;
        moisture_threshold?: number;
        automation_watering_enabled?: boolean;
        moisture?: number;
        // for air entities
        temperature?: number;
        humidity?: number;
        pressure?: number;
    };
};


//my types
export type PlantThresholds = {
    moisture: number;
    temperature: number;
    humidity: number;
    pressure: number;
};

export type Plant = {
    id: string;
    friendly_name: string;
    sensors: {
        entity_id: string;
        sensor_type: keyof PlantThresholds;
    }[];
    thresholds: PlantThresholds;
};

//MARK: ENTITY STATE
export async function getEntityState(entityId: string): Promise<HAEntity> {
    const res = await fetch(`${HA_URL}/api/states/${entityId}`, {
        headers: {
            Authorization: `Bearer ${HA_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch sensor state for ${entityId}`);
    }

    return res.json();
}

//MARK: UPDATE THRESHOLD
export async function updateThreshold(entityId: string, value: number): Promise<void> {
    const res = await fetch(`${HA_URL}/api/services/input_number/set_value`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HA_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            entity_id: entityId,
            value,
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to update threshold for ${entityId}`);
    }
}

//MARK: TRIGGER WATERING
export async function triggerWatering(entityId: string): Promise<void> {
    const res = await fetch(`${HA_URL}/api/services/script/turn_on`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HA_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            entity_id: entityId,
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to trigger watering script ${entityId}`);
    }
}

//MARK: TOGGLE AUTOMATION
export async function toggleAutomation(entityId: string, enable: boolean) {
    const url = `${HA_URL}/api/services/input_boolean/${enable ? "turn_on" : "turn_off"}`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HA_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ entity_id: entityId }),
    });
    return res.ok;
}
