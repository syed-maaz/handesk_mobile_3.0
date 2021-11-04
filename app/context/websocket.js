import React, { createContext, useState, useEffect, useRef } from "react";
// import { shallowEqual, useSelector, useDispatch } from "react-redux";
import WSClass from "../utility/ws";
import listingsApi from "../api/listings";
import { AsyncStorage } from "react-native";

import axios from "axios";

const WebSocketContext = createContext({});

export { WebSocketContext };
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

export default ({ children }) => {
  const ws = useRef(new WSClass({ user: "1" }));
  const userRef = useRef({ id: 0 });
  const watcherRef = useRef([]);
  const typerRef = useRef([]);
  const intervalRef = useRef();

  const [ticketNo, setTicketNo] = useState(0);
  const [watcher, setWatcher] = useState([]);
  const [typers, setTypers] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(0);
  const [allTicketActivities, setAllTicketActivities] = useState([]);
  const [ticketActivities, setTicketActivities] = useState();
  const ticketActivitiesRef = useRef();

  const getStoredNotification = async (data) => {
    try {
      await AsyncStorage.getItem("notification");
    } catch (error) {
      console.log("Error storing the ticket", error);
    }
  };

  const setStoredNotification = async (data) => {
    try {
      await AsyncStorage.setItem("notification", JSON.stringify(data));
    } catch (error) {
      console.log("Error storing the ticket", error);
    }
  };

  useEffect(() => {
    console.log("connected", ws.current.isConnected);
  }, [ws.current.isConnected]);

  useEffect(() => {
    if (!ws.current.isConnected) {
      try {
        console.log("connecting socket");
        ws.current.connect();
      } catch (e) {
        console.log(e);
      }
    }
    console.log("in socket");
    (async () => {
      const _notification = await getStoredNotification();
      console.log("stored", _notification);
      // setAllTicketActivities(JSON.parse(await getStoredNotification()));
    })();

    ws.current.subscribe(`ticket.created`).listen("ticket.created", (info) => {
      updateTicketNotifications(info);
    });

    ws.current.subscribe(`ticket.updated`).listen("ticket.updated", (info) => {
      updateTicketNotifications(info);
    });

    return () => {
      console.log("callback in socket");
      try {
        ws.current.unsubscribe(`ticket.created`);
        ws.current.unsubscribe(`ticket.updated`);
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  const updateTicketNotifications = async (data) => {
    // console.log("ticket created", info);
    const ticket = {
      action: data.action,
      id: data.ticket.id,
      updated: data.ticket.updated_at,
      title: data.ticket.title,
    };
    setTicketActivities(ticket);
    sendNotification(ticket);
    allTicketActivities.push(ticket);
    setAllTicketActivities([...allTicketActivities]);
    // await setStoredNotification(allTicketActivities);
    // console.log("test", await getStoredNotification());
  };

  const sendNotification = (item) => {
    // console.log("notification", item.action);
    return;
    const _content = `#${item.id} ${item.title}`;
    const _header = "Ticket is " + item?.action.split(".")[1];
    console.log("_content", _content);
    var data = {
      app_id: "f1c57cfe-35b2-4ddf-8c4e-fd6c54be62e2",
      contents: { en: _content },
      headings: { en: _header },
      included_segments: ["Subscribed Users"],
    };
    var config = {
      method: "post",
      url: "https://onesignal.com/api/v1/notifications",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Basic ZTc2YWExMGUtZWUwMS00ODdiLTlkNGQtNTEwMzdiN2JkMjc0",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const notifyWatcher = ({ user, ...rest }) => {
    // console.log(watcherRef.current);
    console.log(user, rest);

    const loginUserRef = userRef.current;

    if (
      user?.id !== loginUserRef?.id &&
      !watcherRef.current.find((d) => d.id === user?.id)
    ) {
      //   console.log("setttt!");
      const temp = [...watcherRef.current];
      temp.push(user);

      setTimeout(() => {
        subscribeWatcherSocket(rest?.ticket.id);
      }, 5000);
      watcherRef.current = temp;
      setWatcher(temp);
    }
  };

  const notifyUnWatcher = ({ user, ...rest }) => {
    // console.log(user);
    // console.log(rest, "unsubsscruot ");
    watcherRef.current = watcherRef.current.filter((d) => d.id !== user.id);
    setWatcher(watcherRef.current);
  };

  const notifyStartTyping = ({ user, ...rest }) => {
    // console.log("typing", rest);

    const loginUserRef = userRef.current;

    if (
      user?.id !== loginUserRef?.id &&
      !typerRef.current.find((d) => d.id === user?.id)
    ) {
      const temp = [...typerRef.current];
      temp.push(user);
      typerRef.current = temp;
      setTypers(temp);
    }
  };

  const notifyStopTyping = ({ user }) => {
    // console.log("stop writing");
    typerRef.current = typerRef.current.filter((d) => d.id !== user.id);
    setTypers(typerRef.current);
  };

  const subscribeToTicketEvents = (ticketId) => {
    if (!ws.current.isConnected) {
      try {
        console.log("connecting socket at event");
        ws.current.connect();
      } catch (e) {
        console.log(e);
      }
    }

    try {
      ws.current
        .subscribe(`ticket.${ticketId}`)
        .listen("ticket.subscribed", notifyWatcher);
      ws.current
        .subscribe(`ticket.${ticketId}`)
        .listen("ticket.unsubscribed", notifyUnWatcher);
      ws.current
        .subscribe(`ticket.${ticketId}`)
        .listen("ticket.start.type", notifyStartTyping);
      ws.current
        .subscribe(`ticket.${ticketId}`)
        .listen("ticket.stop.type", notifyStopTyping);
    } catch (e) {
      console.log(e);
    }

    // intervalRef.current = setInterval(() => subscribeWatcherSocket(id), 10000);
    subscribeWatcherSocket(ticketId);
  };

  const unsubscribeToTicketEvents = (id) => {
    ws.current.unsubscribe(`ticket.${id}`);
    unsubscribeWatcherSocket(id);
    clearInterval(intervalRef.current);
  };

  const subscribeWatcherSocket = async (id) => {
    // const { status } = await request("POST", `tickets/${id}/subscribe`);
    const { ok, status, data } = await listingsApi.socketSubscribe(id);

    // if (status === 200) {
    // }
  };

  const unsubscribeWatcherSocket = async (id) => {
    // console.log("unsubscrib socket");
    // const { status } = await request("POST", `tickets/${id}/unsubscribe`);
    const { ok, status, data } = await listingsApi.socketUnsubscribe(id);

    setWatcher([]);
    watcherRef.current = [];
    ws.current.unsubscribe(`ticket.${id}`);
  };

  const ticketTypingEvent = async (id, state = "stop") => {
    // const { status } = await request(
    //   "POST",
    //   `tickets/${id}/typing?${state}=true`
    // );
    const { ok, status, data } = await listingsApi.ticketTyping(id, state);
  };

  return (
    <WebSocketContext.Provider
      value={{
        watcher,
        typers,
        ticketTypingEvent,
        subscribeToTicketEvents,
        unsubscribeToTicketEvents,
        allTicketActivities,
        ticketActivities,
      }}>
      {children}
    </WebSocketContext.Provider>
  );
};
