#include <OneWire.h>                  // Подключаем библиотеку для взаимодействия с устройствами, работающими на шине и по протоколу 1-Wire
#include <DallasTemperature.h>        // Подключаем библиотеку с функциями для работы с DS18B20 (запросы, считывание и преобразование возвращаемых данных)

#define ONE_WIRE_BUS 36                // Указываем пин подключения data-вывода датчика температуры
#define term_power 22                  // Указываем пин подключения питания датчика температуры

OneWire oneWire(ONE_WIRE_BUS);        // Сообщаем библиотеке об устройстве, работающем по протоколу 1-Wire
DallasTemperature sensors(&oneWire);  // Связываем функции библиотеки DallasTemperature с нашим 1-Wire устройством (DS18B20)

int val;
int LED = 13;
char message = "";

typedef struct TText{
    byte x;      
   String text;
};


void setup()
{
  Serial.begin(9600);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);
  sensors.begin();                // Запускаем библиотеку измерения температуры
  pinMode(term_power, OUTPUT);    // Определяем пин подключения питания датчика температуры
}

void loop()
{    
  temperature(); 
  
  if (Serial.available())     // Логика переключения светодиода
  {
    val = Serial.read();
    // При символе "1" включаем светодиод
    if (val == '1')
    {
      digitalWrite(LED, HIGH);
      Serial.println("{\"target\":\"ledContraller1\",\"message\":\"You turn on Led!\"}|");       
    }
    // При символе "0" выключаем светодиод
    if ( val == '0')
    {
      digitalWrite(LED, LOW);
     Serial.println("{\"target\":\"ledContraller2\",\"message\":\"Why do you turn on Led?\"}|");
    }
    
  }
}

float temperature() { // Измеряем температуру через 3 секунды
  digitalWrite(term_power, HIGH);                // Включаем питание датчика температуры
  delay(100);                                    // Задержка перед первым измерением 
  sensors.requestTemperatures();                 // Запрос на измерение температуры (1-й ошибочный)
  delay(500);                                    // Задержка перед поторным измерением
  sensors.requestTemperatures();                 // Запрос на измерение температуры (повторный)
  float t = float(sensors.getTempCByIndex(0));   // Получаем значение температуры
  digitalWrite(term_power, LOW);                 // Отключаем питание датчика температуры                                   
  Serial.print("{\"temperatureSensor\":"); 
  Serial.print(t);                                // Выводим текущее значение температуры датчика, округленное до десятых
  Serial.print("}");
  Serial.println("|");
  delay(2500);                                    // Задержка, чтобы датчик не нагревался от частых измерений
  //return(t);                                     // Возвращаем значение температуры в место вызова функции
}

void sendAndroidValues(){ 
  Serial.print('+');    
  delay(100);        
}
