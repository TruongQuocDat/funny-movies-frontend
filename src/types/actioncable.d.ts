declare module '@rails/actioncable' {
  export interface Consumer {
    subscriptions: SubscriptionsManager;
    disconnect(): void;
  }

  export interface SubscriptionsManager {
    create(channelName: string | object, options: SubscriptionOptions): Subscription;
  }

  interface SubscriptionOptions {
    connected?: () => void;
    disconnected?: () => void;
    received: (data: any) => void;
  }

  interface Subscription {
    unsubscribe: () => void;
  }

  export function createConsumer(url?: string): Consumer;
}
