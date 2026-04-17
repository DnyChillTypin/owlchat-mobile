export interface Friendship {
  id: string;
  firstUserId: string;
  secondUserId: string;
  createdDate: string; 
}
export interface FriendshipCreateRequest {
  firstUserId: string;
  secondUserId: string;
}