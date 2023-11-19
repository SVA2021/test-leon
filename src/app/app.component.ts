import {TuiRootModule, TuiDialogModule, TuiAlertModule} from "@taiga-ui/core";
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';
import {of} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TuiRootModule, TuiDialogModule, TuiAlertModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    },
  ]
})
export class AppComponent {
  title = 'test-leon';
}
