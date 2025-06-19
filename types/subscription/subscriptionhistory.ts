export interface SubscriptionHistory {
  packageName: string;
  startDate: string; 
  endDate: string;   
  isActive: boolean;
}

export interface ActiveSubscription {
  packageName: string;
  expirationDate: string;   
  isActive: boolean;
}