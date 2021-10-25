import OneSignal from "react-native-onesignal";
// import { result } from 'validate.js';

export default {
  init(appId) {
    OneSignal.setAppId(appId);
  },

  notificationOpenedHandler(callback) {
    OneSignal.setNotificationOpenedHandler((openedEvent) => {
      console.log("OneSignal: notification opened:", openedEvent);
      //const { action, notification } = openedEvent;
      callback(openedEvent);
    });
  },

  promptForPushNotificationsWithUserResponse(callback) {
    OneSignal.promptForPushNotificationsWithUserResponse(callback);
  },

  async getDeviceState() {
    const deviceState = await OneSignal.getDeviceState();
    return deviceState;
  },

  enabledPush(userId, email) {
    OneSignal.sendTag("email", email);
    OneSignal.setExternalUserId(userId, (result) => {});
    OneSignal.disablePush(false);
  },

  disabledPush() {
    OneSignal.deleteTag("email");
    OneSignal.disablePush(true);
  },

  //show the access popup again to opt in if user is opt out after login

  /**
   * HOW TO FIX THE ISSUE:
   *  1. upgrade onesignal package!! √
   *  2. In Dashboard, excute the getDeviceState and check the status. √
   *    - isSubscribed
   *    - isPushDisabled
   *    - userId
   *    - emailAddress
   *    - isEmailSubscribed
   *    - hasNotificationPermission / notificationPermissionStatus
   *  3. setExternalUserId √
   */
};
