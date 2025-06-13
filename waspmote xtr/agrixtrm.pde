#include <WaspSensorXtr.h>
#include <WaspFrame.h>
#include <WaspXBee868LP.h>

//za ws-3000
#include <WaspSensorAgr_v30.h>
#include <WaspFrameConstantsv12.h>


bme THP_sensor(XTR_SOCKET_D);
leafWetness leaf_wetness;
weatherStationClass weather;

char RX_ADDRESS[] = "0013A20041A6C049";

char WASPMOTE_ID[] = "node_01";

uint8_t  PANID[] = {0x00, 0x0F};

float anemometer;
float pluviometer1; 
float pluviometer2;
float pluviometer3;

int vane;


char nodeID[] = "node_WS";



void setup() {
    USB.ON();
    
    
    xbee868LP.ON(); 
    delay(2000);
    
    xbee868LP.setPAN(PANID);
    
    if (xbee868LP.error_AT == 0) {
        USB.println(F("PAN ID set OK"));
    } else {
        USB.println(F("PAN ID error"));
    }
    
    xbee868LP.setChannel(15);
    if (xbee868LP.error_AT == 0) {
        USB.println(F("Channel set OK"));
    } else {
        USB.println(F("Channel error"));
    }
    
    xbee868LP.getChannel();
    
    USB.println(F("Reading current settings..."));
    
    xbee868LP.writeValues();
    if (xbee868LP.error_AT == 0) {
        USB.println(F("Settings saved OK"));
    } else {
        USB.println(F("Save error"));
    }
    
    //Agriculture.ON();
    
}

void loop() {
    THP_sensor.ON();
    float temperature = THP_sensor.getTemperature();
    float humidity = THP_sensor.getHumidity();
    float pressure = THP_sensor.getPressure();

    
    THP_sensor.OFF();

    leaf_wetness.ON();

    leaf_wetness.read();

    leaf_wetness.OFF();

    
    //ws-3000
    weather.ON();
    
    anemometer = weather.readAnemometer();
    vane = weather.readVaneDirection();
    pluviometer1 = weather.readPluviometerCurrent();
    pluviometer2 = weather.readPluviometerHour();
    pluviometer3 = weather.readPluviometerDay();

    weather.OFF();

    USB.print(F("Anemometer: "));
    USB.println(anemometer);
    USB.print(F("Vane: "));
    USB.println(vane);
    USB.print(F("Pluviometer (hour): "));
    USB.println(pluviometer1);
    USB.print(F("Pluviometer (current): "));
    USB.println(pluviometer2);
    USB.print(F("Pluviometer (day): "));
    USB.println(pluviometer3);

    
    
    USB.println(F("Creating frame..."));
    frame.createFrame(ASCII, WASPMOTE_ID);
    frame.setFrameType(INFORMATION_FRAME_AGR_XTR);
    frame.addSensor(AGRX_TC_A, temperature);
    frame.addSensor(AGRX_HUM_A, humidity);
    frame.addSensor(AGRX_PRES_A, pressure);
    frame.addSensor(AGRX_LW, leaf_wetness.wetness);

    
    frame.addSensor(SENSOR_ANE, anemometer);
    frame.addSensor(SENSOR_WV, vane);
    frame.addSensor(SENSOR_PLV, pluviometer1);
    frame.addSensor(SENSOR_PLV, pluviometer2);
    frame.addSensor(SENSOR_PLV, pluviometer3);

    
    
    USB.print(F("Frame length: "));
    USB.println(frame.length);

    USB.print(F("Frame content: "));
    for(int i = 0; i < frame.length; i++) {
        USB.print((char)frame.buffer[i]);
    }
    USB.println();
    
    USB.println(F("Sending data..."));
    int result = xbee868LP.send(RX_ADDRESS, frame.buffer, frame.length);

    USB.print(F("Send result: "));
    USB.println(result);
    
    USB.print(F("AT Error Code: "));
    USB.println(xbee868LP.error_AT);
    
    USB.print(F("TX Error Code: "));
    USB.println(xbee868LP.error_TX);
    
      
    
    if (result == 0) {
        USB.println(F("Data sent OK"));
    } else {
        USB.println(F("Send error - check connection"));
    }
    
    delay(3000);
}
