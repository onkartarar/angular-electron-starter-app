import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  public isActive = true;
  public isMaximized = false;

  constructor(private electronService: ElectronService) {

    this.electronService.ipcRenderer.on('focused', () => {
      this.isActive = true;
    })

    this.electronService.ipcRenderer.on('blurred', () => {
      this.isActive = false;
    })

    this.electronService.ipcRenderer.on('maximized', () => {
      this.isMaximized = true;
    })

    this.electronService.ipcRenderer.on('unmaximized', () => {
      this.isMaximized = true;
    })

  }

  ngOnInit(): void {
  }

  minimizeHandler = () => {
    this.electronService.ipcRenderer.invoke('minimize-event');
  }

  maximizeHandler = () => {
    this.electronService.ipcRenderer.invoke('maximize-event');
  }

  closeHandler = () => {
    this.electronService.ipcRenderer.invoke('close-event');
  }

}
