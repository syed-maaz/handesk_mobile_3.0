import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";

import navigationTheme from "./app/navigation/navigationTheme";
import TabNavigator from "./app/navigation/TabNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { navigationRef } from "./app/navigation/rootNavigation";
import DrawerNavigator from "./app/navigation/DrawerNavigator";
import Toast from "react-native-toast-message";

import listingsApi from "./app/api/listings";

import OneSignal from "./app/utility/Onesignal";

import WebSocketProvider from "./app/context/websocket";

import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [metaData, setMetaData] = useState({});

  useEffect(() => {
    (async () => {
      let _data = {};
      _data = { ..._data, ...(await fetchMetaData()) };
      _data = { ..._data, users: await fetchUsers() };
      _data = { ..._data, intents: await fetchIntents() };
      // console.log("_data", _data);
      setMetaData(_data);
    })();
  }, []);

  const fetchMetaData = async () => {
    const { status, data } = await listingsApi.getDashboardInfo();

    if (status === 200) {
      return data.data.tickets;
    }
  };

  const fetchUsers = async () => {
    const { status, data } = await listingsApi.getAllUsers();

    if (status === 200) {
      return data.data.users;
    }
  };

  const fetchIntents = async () => {
    const { status, data } = await listingsApi.getAllIntents();

    if (status === 200) {
      return data.data.intents;
    }
  };

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  if (!isReady)
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={() => console.log("Error in Loading")}
      />
    );

  OneSignal.init("f1c57cfe-35b2-4ddf-8c4e-fd6c54be62e2");

  //OneSignal Init Code
  // OneSignal.setLogLevel(6, 0);
  // OneSignal.setAppId("f1c57cfe-35b2-4ddf-8c4e-fd6c54be62e2");
  // //END OneSignal Init Code

  // // //Prompt for push on iOS
  // OneSignal.promptForPushNotificationsWithUserResponse((response) => {
  //   console.log("Prompt response:", response);
  // });

  //Method for handling notifications received while app in foreground
  // OneSignal.setNotificationWillShowInForegroundHandler(
  //   (notificationReceivedEvent) => {
  //     console.log(
  //       "OneSignal: notification will show in foreground:",
  //       notificationReceivedEvent
  //     );
  //     let notification = notificationReceivedEvent.getNotification();
  //     console.log("notification: ", notification);
  //     const data = notification.additionalData;
  //     console.log("additionalData: ", data);
  //     // Complete with null means don't show a notification.
  //     notificationReceivedEvent.complete(notification);
  //   }
  // );

  // //Method for handling notifications opened
  // OneSignal.setNotificationOpenedHandler((notification) => {
  //   console.log("OneSignal: notification opened:", notification);
  // });

  return (
    <AuthContext.Provider value={{ metaData, user, setUser }}>
      <WebSocketProvider>
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          {user ? <DrawerNavigator /> : <AuthNavigator />}
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </WebSocketProvider>
    </AuthContext.Provider>
  );
}
