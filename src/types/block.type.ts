export interface BlockCreateRequest {
  blockerId: string;
  blockedId: string;
}

export interface BlockCreateUserRequest {
  blockedId: string;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  createdDate: string;
}