#include <TFT_eSPI.h>
#include <SPI.h>
#include <esp_now.h>
#include "WiFi.h"
#include <Wire.h>

// TFT Pins has been set in the TFT_eSPI library in the User Setup file TTGO_T_Display.h
// #define TFT_MOSI            19
// #define TFT_SCLK            18
// #define TFT_CS              5
// #define TFT_DC              16
// #define TFT_RST             23
// #define TFT_BL              4   // Display backlight control pin


#define ADC_EN              14  //ADC_EN is the ADC detection enable port
#define ADC_PIN             34
#define BUTTON_1            35
#define BUTTON_2            0

TFT_eSPI tft = TFT_eSPI(135, 240); // Invoke custom library

// State of the app
struct State {
  int button1 = 0;
  int button2 = 0;
};
struct State state;

void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  state.button1 = incomingData[0];
  state.button2 = incomingData[1];
}


//! Long time delay, it is recommended to use shallow sleep, which can effectively reduce the current consumption
void espDelay(int ms)
{
    esp_sleep_enable_timer_wakeup(ms * 1000);
    esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON);
    esp_light_sleep_start();
}

void setup()
{
    Serial.begin(115200);
    Serial.print("Start on ");
    Serial.println(WiFi.macAddress());

    /*
    ADC_EN is the ADC detection enable port
    If the USB port is used for power supply, it is turned on by default.
    If it is powered by battery, it needs to be set to high level
    */
    pinMode(ADC_EN, OUTPUT);
    digitalWrite(ADC_EN, HIGH);

    tft.init();
    tft.setRotation(0);
    esp_now_register_recv_cb(OnDataRecv);
}

void loop() {
    tft.fillScreen(TFT_BLACK);
    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.setTextDatum(MC_DATUM);

    char door1Str[20], door2Str[20];
    snprintf(door1Str, 20, "Door 1: %d", state.button1);
    snprintf(door2Str, 20, "Door 2: %d", state.button1);

    tft.setTextSize(5);
    tft.drawString(door1Str, tft.width() / 2, tft.height() / 2 - 50);
    tft.drawString(door2Str, tft.width() / 2, tft.height() / 2);
    tft.setTextDatum(TL_DATUM);
    espDelay(2000);
}
