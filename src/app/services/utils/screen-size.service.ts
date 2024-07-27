import { afterNextRender, Injectable } from '@angular/core';
import { debounce, fromEvent, map, Observable, timer } from 'rxjs';

const SCREEN_SIZE_DESKTOP_UP = 1200;

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  resizeEvent() {
    return fromEvent(window, 'resize').pipe(debounce(() => timer(200)));
  }

  isScreenSizeDesktopUp(): boolean {
    return document.documentElement.clientWidth >= SCREEN_SIZE_DESKTOP_UP;
  }
}
