import { Component, inject } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { routeAnimation } from './shared/animations/route-animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  animations: [routeAnimation],
  template: `
    <app-navbar />
    <main [@routeAnimation]="getRouteAnimationData()">
      <router-outlet />
    </main>
  `,
  styles: `
    main {
      padding-top: 72px;
      min-height: 100vh;
      position: relative;
    }
  `
})
export class App {
  private contexts = inject(ChildrenOutletContexts);

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
