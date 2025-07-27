import { MemberResponse } from "./member.response";

export interface ClassroomResponse {
  id?: number;
  name?: string;
  description?: string;
  joinCode?: string;
  createdBy?: string;
  members?: MemberResponse[];

  lastMessage?: string;
  lastMessageTimestamp?: Date;
}