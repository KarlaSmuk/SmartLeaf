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

export function getMockLeafMoistureHistory() {
    return mockLeafMoistureHistory;
}

const mockLeafMoistureHistory = [
    { timestamp: new Date("2025-05-30T10:00:00Z"), value: 45.2 },
    { timestamp: new Date("2025-05-31T10:00:00Z"), value: 47.5 },
    { timestamp: new Date("2025-06-01T10:00:00Z"), value: 42.1 },
    { timestamp: new Date("2025-06-02T10:00:00Z"), value: 39.8 },
    { timestamp: new Date("2025-06-03T10:00:00Z"), value: 35.6 },
    { timestamp: new Date("2025-06-04T10:00:00Z"), value: 31.2 },
    { timestamp: new Date("2025-06-05T10:00:00Z"), value: 28.9 },
    { timestamp: new Date("2025-06-06T10:00:00Z"), value: 33.4 }
];


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

//mocks 
export function getMockPlantEntities(): HAEntity[] {
    return mockPlants;
}

const mockPlants: HAEntity[] = [
    {
        entity_id: "sensor.plant_1_moisture",
        state: "27",
        attributes: {
            friendly_name: "Aloe Vera",
            moisture: 27,
            species: "Succulent",
            moisture_threshold: 30,
            automation_watering_enabled: true,
            plant_id: "1",
            timestamp: "2025-06-05T14:00:00Z",
        },
    },
    {
        entity_id: "sensor.plant_2_moisture",
        state: "55",
        attributes: {
            friendly_name: "Tomato Plant",
            moisture: 55,
            species: "Solanum Lycopersicum",
            moisture_threshold: 50,
            automation_watering_enabled: false,
            plant_id: "2",
            timestamp: "2025-06-05T14:10:00Z",
        },
    },
];

export function getMockAirEntities(): HAEntity[] {
    return airEntities;
}

const airEntities: HAEntity[] = [
    {
        entity_id: "sensor.air_temperature",
        state: "23.1",
        attributes: {
            friendly_name: "Room Air Temperature",
            temperature: 23.1,
            timestamp: "2025-06-06T08:30:00Z",
        },
    },
    {
        entity_id: "sensor.air_humidity",
        state: "45",
        attributes: {
            friendly_name: "Room Humidity",
            humidity: 45,
            timestamp: "2025-06-06T08:30:00Z",
        },
    },
    {
        entity_id: "sensor.air_pressure",
        state: "1015",
        attributes: {
            friendly_name: "Room Air Pressure",
            pressure: 1015,
            timestamp: "2025-06-06T08:30:00Z",
        },
    },
];

