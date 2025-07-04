type PlantSensorType = "moisture" | "temperature" | "air_pressure";

type Thresholds = {
    moisture: string;
    temperature_min: string;
    temperature_max: string;
};

export type PlantData = {
    friendly_name: string;
    entity_id: string;
    sensors: Record<PlantSensorType, string>;
    thresholds: Thresholds;
    watering: {
        duration: string;
        start: string;
    };
    thresholdsValues: Thresholds;
    currentValues: {
        moisture: number;
        temperature: number;
        pressure: number;
    };
};

export const initialPlantsData: PlantData[] = [
    {
        friendly_name: "Plant 1",
        entity_id: "plant_1",
        sensors: {
            moisture: "sensor.plant_1_moisture",
            temperature: "sensor.plant_1_temperature",
            air_pressure: "sensor.plant_1_air_pressure",
        },
        thresholds: {
            moisture: "input_number.plant_1_moisture_threshold",
            temperature_min: "input_number.plant_1_temperature_min_threshold",
            temperature_max: "input_number.plant_1_temperature_max_threshold",
        },
        watering: {
            duration: "input_number.plant_watering_time",
            start: "input_number.plant_watering_start",
        },
        thresholdsValues: {
            moisture: "0",
            temperature_min: "0",
            temperature_max: "0",
        },
        currentValues: {
            moisture: 0,
            temperature: 0,
            pressure: 0
        }
    },
    {
        friendly_name: "Plant 2",
        entity_id: "plant_2",
        sensors: {
            moisture: "sensor.plant_2_moisture",
            temperature: "sensor.plant_2_temperature",
            air_pressure: "sensor.plant_2_air_pressure",
        },
        thresholds: {
            moisture: "input_number.plant_2_moisture_threshold",
            temperature_min: "input_number.plant_2_temperature_min_threshold",
            temperature_max: "input_number.plant_2_temperature_max_threshold",
        },
        watering: {
            duration: "input_number.plant_2_watering_time",
            start: "input_number.plant_2_watering_start",
        },
        thresholdsValues: {
            moisture: "0",
            temperature_min: "0",
            temperature_max: "0",
        },
        currentValues: {
            moisture: 0,
            temperature: 0,
            pressure: 0
        }
    },
];