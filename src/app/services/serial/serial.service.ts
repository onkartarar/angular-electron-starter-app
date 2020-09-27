import { Injectable } from '@angular/core';
import * as SerialPort from 'serialport';
import * as ReadLine from '@serialport/parser-readline';

@Injectable({
  providedIn: 'root'
})
export class SerialService {

  serialPort : typeof SerialPort;
  readLine: typeof ReadLine;
  port: typeof SerialPort;
  setComPort: string;
  portList = [];

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    if (this.isElectron) {
      this.serialPort = window.require('serialport');
      this.readLine = window.require('@serialport/parser-readline');
    }
    this.getPorts();
  }

  setPort = (comPort: string) => {
    if(comPort != this.setComPort){
      this.port = new this.serialPort(comPort,
        {
          autoOpen: true,
          baudRate: 9600,
          dataBits: 8,
          parity: 'none'
        },
        (error) => { if(error) console.log(error); }
      )
      this.setComPort = comPort;
      this.port.pipe(new this.readLine({ delimiter: '\r\n' }));
      this.port.on('data', (data) => { console.log("data: "+ this.getBufferValue(data)); })
      this.port.on('close', (error) => { if(error){ console.log("error while Closing port " + error); } else { console.log("port closed")}})
    }
  }

  getPorts = async () => {
    var s = this.serialPort.list();
    await s.then(
      ports => {
        this.portList = [];
        ports.forEach(port => {
        console.log(port.path);
        this.portList.push(port.path);
      });
    },
      err => console.log(err)
    );
  }

  getBufferValue = (data: Buffer) => {
    let buf = []
      data = Buffer.from(data);
      data.forEach(x => {
        buf.push(x.toString(16));
      });
      return buf;
  }

  sendQuery = (data: Buffer) => {
    this.port.write(data);
    console.log("Writing DATA ->");
    console.log("DATA: "+ this.getBufferValue(data));
    console.log("PORT: "+ this.setComPort);
    this.port.drain((error) => { if(error) console.log(error)});
  }


  sleep = (millis) => {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < millis);
  }

}
