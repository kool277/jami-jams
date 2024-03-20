export interface Contact {
  added: number;
  banned: boolean;
  confirmed: boolean;
  display: string;
  firstName: string;
  lastName: string;
  organization: string;
  profilePicture: string;
  removed: number;
  owner: string;
  uri: string;
  username: string;
  conversationId: string;
}

export interface ServerContact {
  owner: string;
  uri: string;
  displayName: string;
  added: number;
  removed: number;
  banned: boolean;
  confirmed: boolean;
  conversationId: string;
}
