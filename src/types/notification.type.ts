export interface NotificationItem {
    id: string;
    userId: string;
    type: string;       // FRIEND_REQUEST, FRIENDSHIP, BLOCK, MESSAGE
    action: string;     // CREATED, UPDATED, DELETED
    referenceId: string;
    content: string;
    data: any;
    isRead: boolean;
    createdDate: string;
}
