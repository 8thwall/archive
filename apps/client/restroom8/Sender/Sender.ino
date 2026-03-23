#include "SSD1306Wire.h"
#include <esp_now.h>
#include <WiFi.h>

// Configurable data
const int door1Pin = 16;  // door 1 input pin
const int door2Pin = 17;  // door 2 input pin
uint8_t receiverMacAddress[] = {0x08, 0x3a, 0xf2, 0x47, 0x40, 0x00};
uint8_t monitorMacAddress[] = {0x3c, 0x61, 0x05, 0x0d, 0x8e, 0x54};

// State of the app
struct State {
  int button1 = 0;
  int button2 = 0; 
  int lastSentStatus = 0;
};
struct State state;

// SSD1306 display for local display
SSD1306Wire  display(0x3c, 21, 22);

// constants
const char *ON_STR = "ON";
const char *OFF_STR = "OFF";

void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
  state.lastSentStatus = status == ESP_NOW_SEND_SUCCESS;
}

void addPeer(const uint8_t *addr, int channel) {
  esp_now_peer_info_t peerInfo = {};
  memcpy(peerInfo.peer_addr, addr, 6);
  peerInfo.channel = 0;
  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }
}

void setup() {
  Serial.begin(115200);  
  // initialize wifi + ESP-NOW
  WiFi.mode(WIFI_MODE_STA);
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  esp_now_register_send_cb(OnDataSent);

  // Add our receiver to our peer list
  addPeer(receiverMacAddress, 0);
  addPeer(monitorMacAddress, 0);
  
  // initialize the pins for input
  pinMode(door1Pin, INPUT);
  pinMode(door2Pin, INPUT);

  // initialize display
  display.init();
  display.setContrast(255);
  display.setLogBuffer(5, 30);
}

void loop() {
  // update the state by reading locally
  state.button1 = digitalRead(door1Pin);
  state.button2 = digitalRead(door2Pin);

  // Display locally to our local display
  display.clear();
  char messageStr[30];
  sprintf(messageStr, "1=%s 2=%s Sent=%s", 
    state.button1 ? ON_STR : OFF_STR, 
    state.button2 ? ON_STR : OFF_STR,
    state.lastSentStatus ? "Y" : "N");
  display.println(messageStr);
  display.drawLogBuffer(0, 0);
  display.display();

  // Send the state to the receiver
  uint8_t payload[2];
  payload[0] = state.button1 ? 1 : 0;
  payload[1] = state.button2 ? 1 : 0;
  if(esp_now_send(receiverMacAddress, payload, 2) != ESP_OK){
    Serial.println("Had trouble sending payload");
  }
    
  delay(1000);
}
