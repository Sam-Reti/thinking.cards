import {
  Directive,
  ElementRef,
  inject,
  output,
  OnInit,
  OnDestroy,
  NgZone,
} from '@angular/core';

@Directive({
  selector: '[appSwipe]',
})
export class SwipeDirective implements OnInit, OnDestroy {
  swipeLeft = output<void>();
  swipeRight = output<void>();

  private el = inject(ElementRef);
  private zone = inject(NgZone);

  private startX = 0;
  private startY = 0;
  private tracking = false;

  private onPointerDown = (e: PointerEvent) => {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.tracking = true;
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.tracking) return;
    this.tracking = false;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Must travel at least 50px horizontally and be more horizontal than vertical
    if (absDx > 50 && absDx > absDy) {
      this.zone.run(() => {
        if (dx < 0) {
          this.swipeLeft.emit();
        } else {
          this.swipeRight.emit();
        }
      });
    }
  };

  ngOnInit() {
    const el = this.el.nativeElement as HTMLElement;
    this.zone.runOutsideAngular(() => {
      el.addEventListener('pointerdown', this.onPointerDown);
      el.addEventListener('pointerup', this.onPointerUp);
    });
  }

  ngOnDestroy() {
    const el = this.el.nativeElement as HTMLElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointerup', this.onPointerUp);
  }
}
