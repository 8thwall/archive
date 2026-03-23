// Make sure to use Esp Dev Module
// More instructions https://github.com/Xinyuan-LilyGO/LilyGo-T5-Epaper-Series
#include <esp_now.h>
#include <WiFi.h>
#define LILYGO_T5_V24
#include <boards.h>
#include <GxEPD.h>
#include <GxDEPG0290R/GxDEPG0290R.h>      // 2.9" b/w/r  form DKE GROUP
#include <Fonts/FreeMonoBold9pt7b.h>
#include <GxIO/GxIO_SPI/GxIO_SPI.h>
#include <GxIO/GxIO.h>

GxIO_Class io(SPI,  EPD_CS, EPD_DC,  EPD_RSET);
GxEPD_Class display(io, EPD_RSET, EPD_BUSY);

// Configurable data
uint8_t senderMacAddress[] = {0x08, 0x3a, 0xf2, 0xa9, 0x9e, 0xbc}; // not used

// State of the app
struct State {
  int button1 = 0;
  int button2 = 0;
  bool needsDraw = false;
};
struct State state;

// constants
const char *ON_STR = "ON";
const char *OFF_STR = "OFF";

void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  if (state.button1 != incomingData[0] || state.button2 != incomingData[1]) {
    state.needsDraw = true;
  }
  state.button1 = incomingData[0];
  state.button2 = incomingData[1];
}

void setup() {
  Serial.begin(115200);  
  Serial.print("Receiver board: ");
  Serial.println(WiFi.macAddress());
  
  // initialize wifi + ESP-NOW
  WiFi.mode(WIFI_MODE_STA);
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // initialize display
  display.init();
  display.setTextColor(GxEPD_BLACK);
  display.setRotation(1);
  state.needsDraw = true;

  esp_now_register_recv_cb(OnDataRecv);
}

void draw() { 
  if (!state.needsDraw) {
    return;
  }
  state.needsDraw = false;
  
  // 2.9in display 296 x 128 (w x h when rotation = 1)
  const int DOOR_WIDTH = 100;
  const int MARGIN = 5;
  const int DOOR_HEIGHT = display.height() - MARGIN - 10;
  
  display.fillScreen(GxEPD_WHITE); 
  display.setFont(&FreeMonoBold9pt7b);
  display.setTextColor(GxEPD_BLACK);

  // draw the ground
  display.drawLine(MARGIN, 10 + DOOR_HEIGHT, display.width() - MARGIN, 10 + DOOR_HEIGHT, GxEPD_BLACK);
  
  // draw the left door
  int leftDoorX = (display.width() - MARGIN * 2 - DOOR_WIDTH * 2) / 4;
  if (state.button1) {
    display.fillRect(leftDoorX, 10, DOOR_WIDTH, DOOR_HEIGHT, GxEPD_RED);
//    display.fillRoundRect(leftDoorX + DOOR_WIDTH - 10, 10 + DOOR_HEIGHT / 2 - 20, 20, 40, 2, GxEPD_RED);
  } else {
    display.drawRect(leftDoorX, 10, DOOR_WIDTH, DOOR_HEIGHT, GxEPD_BLACK);
//    display.fillRoundRect(leftDoorX + DOOR_WIDTH - 10, 10 + DOOR_HEIGHT / 2 - 20, 20, 40, 2, GxEPD_BLACK);
  }
  
  // draw the right door
  int shiftX = display.width() / 2;
  int rightDoorX = shiftX + leftDoorX;
  if (state.button2) {
    display.fillRect(rightDoorX, 10, DOOR_WIDTH, DOOR_HEIGHT, GxEPD_RED);
//    display.fillRoundRect(rightDoorX + DOOR_WIDTH - 10, 10 + DOOR_HEIGHT / 2 - 20, 20, 40, 2, GxEPD_RED);
  } else {
    display.drawRect(rightDoorX, 10, DOOR_WIDTH, DOOR_HEIGHT, GxEPD_BLACK);
//    display.fillRoundRect(rightDoorX + DOOR_WIDTH - 10, 10 + DOOR_HEIGHT / 2 - 20, 20, 40, 2, GxEPD_BLACK);
  }
  
  display.update();
  display.powerDown();
}

void loop() {
  // The state is update on message received
  
  // Display locally to our local display
  char messageStr[30];
  sprintf(messageStr, "1=%s 2=%s draw=%d", 
    state.button1 ? ON_STR : OFF_STR, 
    state.button2 ? ON_STR : OFF_STR,
    state.needsDraw);

  Serial.println(messageStr);
  draw();
    
  delay(1000);
}
