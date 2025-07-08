import { Routes } from '@angular/router';
import { MessagePageComponent } from './message-page/message-page.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';

export const MESSAGES_ROUTES: Routes = [
  {
    path: '',
    component: MessagePageComponent,
    children: [
      {
        path: '',
        component: MessageListComponent
      },
      {
        path: ':classroomId',
        component: MessageDetailComponent 
      }
    ]
  }
];