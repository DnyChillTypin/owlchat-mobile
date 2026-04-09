export interface Account {
  id: string;
  username: string;
  password: string;

}

export interface UserProfile {
  id: string;
  account: Account;
  name: string;
  gender?: boolean; 
  dateOfBirth?: string; 
  avatar?: string;
  email: string;
  phoneNumber: string;
  createdDate?: string; 
  updatedDate?: string; 
}

export interface UserProfileRequest {
  name: string;
  gender?: boolean; 
  dateOfBirth?: string; 
  email: string;
  phoneNumber: string;
}

export interface UserProfileCreateRequest {
  account: AccountRequest;
  userProfile: UserProfileRequest;
}

export interface AccountRequest {
  username: string;
  password: string;
}