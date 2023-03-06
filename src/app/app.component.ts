import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { UtilsService } from './utils/utils.service';
declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-mqtt';
  listOfDevices: any = [
    {
      id: '1',
      name: 'Voltas AC',
      brand: 'voltas',
      type: 'ac',
      floor: '1st Floor',
      onState: 0,
      userName: 'ryaan',
      userId: 1,
    },
    {
      id: '2',
      name: 'Sumsung AC',
      brand: 'sumsung',
      type: 'ac',
      floor: '2nd Floor',
      onState: 0,
      userName: 'ryaan',
      userId: 1,
    },
    // {
    //   id: '3',
    //   name: 'Syska Bulb',
    //   brand: 'Syska',
    //   type: 'light',
    //   floor: '1st Floor',
    //   onState: 0,
    // },
    {
      id: '4',
      name: 'LG Fridge',
      brand: 'LG',
      type: 'fridge',
      floor: '1st Floor',
      onState: 0,
      userName: 'robin',
      userId: 1,
    },
  ];
  client: any;
  settingHistory: any = [];
  constructor(private _utilService: UtilsService) {}

  ngOnInit() {
    // this.listOfDevices = this.listOfDevices.map((device: any) => {
    //   device.id = Math.random().toString(36).slice(2);
    //   return device;
    // })
    const url = 'ws://broker.emqx.io:8083/mqtt';
    const options = {
      // Clean session
      clean: true,
      connectTimeout: 100000,
      // Authentication
      clientId: '',
      username: 'emqx_test',
      password: 'emqx_test',
    };
    this.client = window?.mqtt.connect(url, options);
    this.client.on('connect', () => {
      this.client.subscribe('test', (err: any) => {
        if (!err) {
          // Publish a message to a topic
          this.client.publish('textexplorations/test', 'Hello mqtt');
        }
      });
      this.client.subscribe(
        'NOTIFY_CURRENT_DEVICE_INFO',
        (err: any, data: any) => {
          // console.log(data);
        }
      );
      this.client.subscribe('NEW_DEVICE_SETTINGS', (err: any, data: any) => {
        // console.log(data);
      });

      this.client.subscribe(
        'REQUEST_RECV_CONFIRMATION',
        (err: any, data: any) => {
          // console.log(data);
        }
      );
    });
    this.client.on('message', this.onReceivedMessage);

    // Receive messages
  }

  onReceivedMessage = (topic: string, msg: any) => {
    // const data = JSON.parse(msg.toString());
    // console.log(topic, msg.toString())
    // console.log(JSON.parse(msg.toString()));
    let data: any;
    switch (topic) {
      case 'NEW_DEVICE_SETTINGS':
        data = msg.toString();
        console.log(JSON.parse(data));
        break;
      case 'NOTIFY_CURRENT_DEVICE_INFO':
        data = msg.toString();
        this.onReceivedNewSettings(JSON.parse(data));
        break;
      case 'REQUEST_RECV_CONFIRMATION':
        data = msg.toString();
        this.settingHistory.push(JSON.parse(data));
        console.log('REQUEST_RECV_CONFIRMATION', this.settingHistory);
        break;
    }
  };

  onReceivedNewSettings(data: any): void {
    this.settingHistory = [...this.settingHistory].slice(-10);
    this.settingHistory.push(data);
    this.settingHistory = this.settingHistory.map((info: any) => {
      if (info.requestId == data.requestId) {
        info.updateTime = data.updateTime;
      }
      return info;
    });
    console.log('NOTIFY_CURRENT_DEVICE_INFO', this.settingHistory);
  }

  onSwitchOn(deviceId: number | string, deviceInfo: any): void {
    // let deviceInfo: any = [...this.listOfDevices].filter((device:any) => device.id == deviceId);
    if (deviceInfo.id) {
      deviceInfo.onState = 1;
      deviceInfo.delay = 5000;
      this.publishInfo('SWITCH_ON_OFF_DEVICE', deviceInfo);
    }
    // console.log(this.listOfDevices);
    // this.listOfDevices = [...this.listOfDevices].map((device: any) => {
    //   if (device.id == deviceId) {
    //     device.onState = 1
    //   }
    //   return device;
    // });
  }

  onSwitchOff(deviceId: number | string, deviceInfo: any): void {
    // let deviceInfo: any = [...this.listOfDevices].filter((device:any) => device.id == deviceId);
    if (deviceInfo.id) {
      deviceInfo.onState = 0;
      deviceInfo.delay = 5000;
      this.publishInfo('SWITCH_ON_OFF_DEVICE', deviceInfo);
    }
    // console.log(this.listOfDevices);
  }

  onTempDown(deviceId: number | string, deviceInfo: any): void {
    if (deviceInfo.id) {
      deviceInfo.temp = deviceInfo.temp - 1;
      this.publishInfo('ON_INCREASE_TEMP', deviceInfo);
    }
  }

  onTempUp(deviceId: number | string, deviceInfo: any): void {
    if (deviceInfo.id) {
      deviceInfo.temp = deviceInfo.temp + 1;
      this.publishInfo('ON_DECRESE_TEMP', deviceInfo);
    }
  }

  publishInfo(topic: string, payLoad: any): void {
    this.client.publish(topic, JSON.stringify(payLoad));
  }

  updateDeviceState(deviceInfo: any): void {
    this.listOfDevices = [...this.listOfDevices].map((device: any) => {
      if (device.id == deviceInfo.id) {
        device.onState = deviceInfo.onState;
      }
      return device;
    });
  }

  updateDevice(deviceInfo: any): void {
    this._utilService.notifyDeviceInfo(deviceInfo);
  }

  onUpdateForAll() {
    let testData:any = [
      {
        userName: 'robin',
        userId: 1,
        id: '1',
        name: 'Voltas AC',
        brand: 'voltas',
        type: 'ac',
        floor: '1st Floor',
        onState: 0,
        state: 'false',
        temp: '19',
        vSwing: 'false',
        hSwing: 'false',
        speed: '2',
        turbo: 'false',
        sleep: 'true',
        sleepTime: 15000,
        timerOn: 'true',
        onTime: 100,
        mode: 'fan',
        reqTime: 1675397508764,
        requestId: 'a46ryj74a3h',
      },
      {
        userName: 'robin',
        userId: 1,
        id: '2',
        name: 'Sumsung AC',
        brand: 'sumsung',
        type: 'ac',
        floor: '1st Floor',
        onState: 0,
        state: 'false',
        temp: '19',
        vSwing: 'false',
        hSwing: 'false',
        speed: '2',
        turbo: 'false',
        sleep: 'true',
        sleepTime: 25000,
        timerOn: 'true',
        onTime: 200,
        mode: 'fan',
        reqTime: 1675397508764,
        requestId: 'a46ryj74a3h',
      },
      {
        userName: 'robin',
        userId: 1,
        id: '3',
        name: 'LG AC',
        brand: 'lg',
        type: 'ac',
        floor: '1st Floor',
        onState: 0,
        state: 'false',
        temp: '19',
        vSwing: 'false',
        hSwing: 'false',
        speed: '2',
        turbo: 'false',
        sleep: 'true',
        sleepTime: 35000,
        timerOn: 'true',
        onTime: 300,
        mode: 'fan',
        reqTime: 1675397508764,
        requestId: 'a46ryj74a3h',
      },
    ];

    let testData2:any = [
      {
        userName: 'ryaan',
        userId: 1,
        id: '1',
        name: 'Blue Start',
        brand: 'blue',
        type: 'ac',
        floor: '1st Floor',
        onState: 0,
        state: 'false',
        temp: '19',
        vSwing: 'false',
        hSwing: 'false',
        speed: '2',
        turbo: 'false',
        sleep: 'true',
        sleepTime: 15000,
        timerOn: 'true',
        onTime: 100,
        mode: 'fan',
        reqTime: 1675397508764,
        requestId: 'a46ryj74a3h',
      },
      {
        userName: 'ryaan',
        userId: 1,
        id: '2',
        name: 'Llyod AC',
        brand: 'llyod',
        type: 'ac',
        floor: '1st Floor',
        onState: 0,
        state: 'false',
        temp: '19',
        vSwing: 'false',
        hSwing: 'false',
        speed: '2',
        turbo: 'false',
        sleep: 'true',
        sleepTime: 25000,
        timerOn: 'true',
        onTime: 200,
        mode: 'fan',
        reqTime: 1675397508764,
        requestId: 'a46ryj74a3h',
      },
      {
        userName: 'ryaan',
        userId: 1,
        id: '3',
        name: 'Whirlpool  AC',
        brand: 'whirlpool ',
        type: 'ac',
        floor: '1st Floor',
        onState: 0,
        state: 'false',
        temp: '19',
        vSwing: 'false',
        hSwing: 'false',
        speed: '2',
        turbo: 'false',
        sleep: 'true',
        sleepTime: 35000,
        timerOn: 'true',
        onTime: 300,
        mode: 'fan',
        reqTime: 1675397508764,
        requestId: 'a46ryj74a3h',
      },
    ];


    testData = testData.map((item: any) => {
      item.topic = `${item.userId}/${item.userName}/${item.type}/${item.id}`
      return item;
    })

    this.publishInfo('ON_CLIENT_REQUEST', testData);

    // setTimeout(() => {
    //   testData2 = testData2.map((item: any) => {
    //     item.topic = `${item.userId}/${item.userName}/${item.type}/${item.id}`
    //     return item;
    //   })
    //   this.publishInfo('ON_CLIENT_REQUEST', testData2);
    // }, 20000)
  }
  
  onUpdateDeviceInfo(data: any): void {
    let newData = [];
    const date = new Date();
    data = JSON.parse(data);
    data.sleepTime = +data.sleepTime;
    data.onTime = +data.onTime;
    data.reqTime = date.getTime();
    data.requestId = Math.random().toString(36).slice(2);
    console.log(data);
    newData.push(data);
    newData = newData.map((item: any) => {
      item.topic = `${item.userId}/${item.userName}/${item.type}/${item.id}`
      return item;
    })
    this.publishInfo('ON_CLIENT_REQUEST', newData);    
  }

  viewDetails(deviceId: string, deviceInfo: any): void {
    this._utilService.notifyViewModal(deviceId, deviceInfo);
  }
}
