import { inject, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS, fr, zhCN, ja } from 'date-fns/locale';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false // Làm cho pipe impure để tự động cập nhật
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {

  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  private langSubscription?: Subscription;
  private currentLang: string = '';

  constructor() {
    // Lắng nghe sự thay đổi ngôn ngữ
    this.langSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.cdr.markForCheck(); // Trigger change detection
    });
    
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang();
  }

  transform(value: Date | string | undefined): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const locale = this.getLocale(this.currentLang);

    return formatDistanceToNow(date, { addSuffix: true, locale });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private getLocale(lang: string) {
    switch (lang) {
      case 'vi': return vi;
      case 'fr': return fr;
      case 'zh': return zhCN;
      case 'ja': return ja;
      default: return enUS;
    }
  }
}
