import { createConsumer } from "@rails/actioncable";
import { Notification } from "../types";

const getToken = () => localStorage.getItem('jwtToken');
const WEBSOCKET_HOST = process.env.REACT_APP_WEBSOCKET_HOST;

let consumer = createConsumer();

export const initConsumer = (): void => {
  if (consumer) {
    consumer.disconnect();
  }

  consumer = createConsumer(`${WEBSOCKET_HOST}?token=${getToken()}`);
};

export const disconnectConsumer = (): void => {
  if (consumer) {
    consumer.disconnect();
  }
};

initConsumer();

export const subscribeToNotifications = (callback: (notification: Notification) => void): void => {
  if (!consumer) {
    console.error("WebSocket consumer is not initialized.");
    return;
  }

  consumer.subscriptions.create("NotificationChannel", {
    connected() {
      console.log("Connected to the channel");
    },
    disconnected() {
      console.log("Disconnected from the channel");
    },
    received(data: Notification) {
      console.log("Data received:", data);
      callback(data);
    },
  });
};
