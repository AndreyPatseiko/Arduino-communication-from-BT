int val;
int LED = 13;


void setup()
{
  Serial.begin(9600);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
}
void loop()
{  
  if (Serial.available())
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

void sendAndroidValues(){ 
  Serial.print('+');    
  delay(100);        
}
