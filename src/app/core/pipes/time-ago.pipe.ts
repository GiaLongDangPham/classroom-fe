import { inject, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
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

  transform(value: Date | undefined): string  {
    if (!value) return '';
    
    const lang = this.translate.currentLang || this.translate.getDefaultLang();
    const locale = lang === 'vi' ? vi : enUS;

    return formatDistanceToNow(new Date(value), { addSuffix: true, locale });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
