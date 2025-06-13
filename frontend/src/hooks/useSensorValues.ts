import { useEffect, useState } from "react";
import { getEntityState } from "../api/homeAssistant";
import { initialPlantsData, type PlantData } from "../api/plants";

export function useSensorValues() {
    const [plants, setPlants] = useState<PlantData[]>(initialPlantsData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSensorStates = async () => {
            try {
                const updated = await Promise.all(
                    plants.map(async (plant: PlantData) => {
                        const { sensors, thresholds } = plant;

                        const [
                            moisture,
                            temperature,
                            pressure,
                            moistureThreshold,
                            tempMinThreshold,
                            tempMaxThreshold,
                        ] = await Promise.all([
                            getEntityState(sensors.moisture),
                            getEntityState(sensors.temperature),
                            getEntityState(sensors.air_pressure),
                            getEntityState(thresholds.moisture),
                            getEntityState(thresholds.temperature_min),
                            getEntityState(thresholds.temperature_max),
                        ]);
                        return {
                            ...plant,
                            currentValues: {
                                moisture: parseFloat(moisture.state),
                                temperature: parseFloat(temperature.state),
                                pressure: parseFloat(pressure.state),
                            },
                            thresholdsValues: {
                                moisture: moistureThreshold.state,
                                temperature_min: tempMinThreshold.state,
                                temperature_max: tempMaxThreshold.state,
                            },
                        };
                    })
                );

                setPlants(updated);
            } catch (error) {
                console.error("Error fetching sensor and threshold values:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSensorStates();
    }, []);

    return { plants, loading };
}
