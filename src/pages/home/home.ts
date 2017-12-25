import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial';
import {AlertController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {NgZone} from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BluetoothSerial]
})
export class HomePage {
  public zone = new NgZone({enableLongStackTrace: false});
  preloader = this.loadingCtrl.create({
    content: 'Connection ...'
  });
  public onLed = false;
  public arduinoBTData = [];
  public unpairedDevices: any;
  public pairedDevices: any;
  public gettingDevices: Boolean;
  public temperatureSensor = 0;
  public data = {
    temperatureSensor: 0
  };

  constructor(public navCtrl: NavController,
              private bluetoothSerial: BluetoothSerial,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
    this.preloader.present();
    this.bluetoothSerial.enable().then(
      () => {
        this.connectForInsecure({address: '98:D3:31:FD:28:7E'});
      }
    )
  }

  connectToBth(data): void {
    this.bluetoothSerial.connect(data.address).subscribe(
      res => {
        this.bluetoothSerial.write('0');
        this.arduinoBTData.push({target: 'Connection', message: 'success'})
      }
    );
  }

  connectForInsecure(data): void {
    this.bluetoothSerial.connectInsecure(data.address).subscribe(
      () => {
        this.preloader.dismiss();
        this.arduinoBTData.push({target: 'Connection', message: 'success'});
        this.subscribereadData();
        this.gettingDevices = false;
      },
      err => {
        this.arduinoBTData.push({target: 'Connection error', message: err.message})
      }
    );
  }

  triggerLED(): void {
    this.onLed = !this.onLed;
    this.bluetoothSerial.write(this.onLed ? '1' : '0');
  }


  subscribereadData() {
    // this.bluetoothSerial.subscribeRawData().subscribe(res => {
    //   alert('row subscribe ' + res);
    // });

    this.bluetoothSerial.subscribe('|').subscribe(res => {
      this.zone.run(() => {
        const resObj = JSON.parse(res.slice(0, -1));
        this.temperatureSensor = Number(resObj.temperatureSensor);
      });
      // this.arduinoBTData.push(resObj);
      // this.updateData(resObj);
    });
  }

  updateData(obj: any): void {
    // alert(obj);
    if (typeof(obj) === 'object') {
      for (const key in obj) {
        this.data[key] = obj[key];
      }
    }

  }

  startScanning(): void {

    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired().then((success) => {
        this.unpairedDevices = success;
        this.gettingDevices = false;
        success.forEach(element => {
          // alert(element.name);
        });
      },
      (err) => {
        console.log(err);
      })

    this.bluetoothSerial.list().then((success) => {
        this.pairedDevices = success;
      },
      (err) => {

      })
  }

  success = (data) => alert(data);
  fail = (error) => alert(error);


  selectDevice(address: any) {

    let alert = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    alert.present();

  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    alert.present();
  }
}
