const HA_URL = "http://" + import.meta.env.VITE_HA_URL;
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN;

const headers = {
    Authorization: `Bearer ${HA_TOKEN}`,
    "Content-Type": "application/json"
};

export type HAEntity = {
    entity_id: string;
    state: string;
    attributes: {
        // for all entities
        friendly_name?: string;
        timestamp?: string;
        // for plant entities
        plant_id?: string;
        species?: string;
        moisture_threshold?: number;
        automation_watering_enabled?: boolean;
        moisture?: number;
        // for air entities
        temperature?: number;
        humidity?: number;
        pressure?: number;
    };
};

export const fetchSensorHistory = async (
    entityId: string,
    fromISO: string
) => {
    const res = await fetch(
        `${HA_URL}/api/history/period/${fromISO}?filter_entity_id=${entityId}`,
        { headers }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch history");
    }

    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data[0].map((entry: any) => ({
        timestamp: new Date(entry.last_changed),
        value: parseFloat(entry.state)
    }));
};

export async function getPlantEntities(): Promise<HAEntity[]> {
    const res = await fetch(`${HA_URL}/api/states`, {
        headers: {
            Authorization: `Bearer ${HA_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch plant entities");
    }

    const allEntities: HAEntity[] = await res.json();
    return allEntities.filter((e) => e.entity_id.startsWith("plant."));
}