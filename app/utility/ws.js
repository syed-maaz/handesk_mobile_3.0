import isArray from "lodash/isArray";
import isString from "lodash/isString";
import remove from "lodash/remove";
import forEach from "lodash/forEach";
import difference from "lodash/difference";
import intersection from "lodash/intersection";
import filter from "lodash/filter";
import includes from "lodash/includes";
// import {showSmallNotif} from './notifications';

/**
 * @param {string|array} channels
 * @returns {array}
 */
function getChannels(channels) {
  let ch = null;

  if (isString(channels)) {
    ch = [channels];
  } else if (isArray(channels)) {
    ch = channels;
  } else {
    throw new Error("Invalid channels format.");
  }

  return ch;
}

function getUniqueId(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class WS {
  /**
   * @param {object} [options]
   * @param {string} [options.url] - wss URL to make the connection into.
   * @param {object} [options.user] - user the will use the wss connection.
   * @param {object} [options.verbose] - switch for turning on/off console loggers.
   * @returns {void}
   */
  constructor(options = {}) {
    this.url =
      options.url ||
      process.env.VUE_APP_WS_URL ||
      "wss://websocket.digitaltolk.se";
    this.user = options.user;
    this.verbose = options.verbose || false;

    this.wsCon = null;
    this.isConnected = false;
    this.hasPongResponded = true;
    this.keepAlive = null;
    this.requestIdLength = 35;

    this.listeners = [];
    this.subscribedChannels = [];
    this.currentChannels = [];
    this.isDisconnectedProgrammatically = false;
    this.sendQueue = [];
    this.isProcessingSendQueue = false;
    this.sendQueueInterval = null;
    this.sendQueueDelay = 500;
  }

  /**
   * @returns {void}
   */
  resetVariables() {
    this.wsCon = null;
    this.isConnected = false;
    this.hasPongResponded = true;
    clearInterval(this.keepAlive);
    this.keepAlive = null;
  }

  /**
   * @returns {WS}
   */
  connect() {
    if (!this.isConnected) {
      this.wsCon = new WebSocket(this.url);

      this.wsCon.onerror = (event) => {
        this.logger(event, "error");
        throw new Error("Websocket error observed!");
      };

      this.wsCon.onopen = (event) => {
        console.log("opennn");
        this.isConnected = true;
        this.logger(["Successfully Connected to Websocket : ", event]);
        this.setCallbacks();
        this.activateHeartbeat();
      };

      return this;
    }
    throw new Error(
      `There is a websocket connection with ${this.url} already.`
    );
  }

  reconnect() {
    this.connect();
    this.subscribe(this.subscribedChannels);
  }

  /**
   * @returns {void}
   */
  disconnect() {
    this.isDisconnectedProgrammatically = true;
    if (!!this.wsCon) this.wsCon.close();
    this.resetVariables();
  }

  /**
   * @returns {void}
   */
  activateHeartbeat() {
    const beat = 20000; // 20 seconds
    const maxBeats = 720000; // 12 minutes
    let totalBeats = 0;

    let attempts = 0;
    const maxAttempts = 10;

    this.keepAlive = setInterval(() => {
      if (this.hasPongResponded) {
        this.hasPongResponded = false;

        this.sendBack({ action: "ping" });
        this.logger("Connection is ALIVE, continuing heartbeat...", "info");
      } else {
        this.logger("Experiencing intermittent/unstable connection...", "warn");

        if (attempts < maxAttempts) {
          this.logger("Attempting to PING again.");
          this.sendBack({ action: "ping" });
          attempts++;
        } else {
          this.logger(
            "Max attempts of PINGING reached. Clearing heartbeat interval.",
            "warn"
          );
          clearInterval(this.keepAlive);

          if (!this.isConnected) {
            this.reconnect();
          }
        }
      }

      totalBeats += beat;

      if (totalBeats >= maxBeats) {
        // showSmallNotif('danger', {
        //   message: 'Page is not actively updating. Refresh for realtime-updating of page',
        //   duration: 0
        // });
        this.disconnect();
      }
    }, beat);
  }

  /**
   * @param {object} data
   */
  sendBack(data) {
    let attempts = 0;
    let max = 10;
    const sec = 3000;
    let isSent = false;
    const payload = JSON.stringify(data);

    let interval = setInterval(() => {
      this.logger(
        `Attempt (${attempts + 1}) for sending back data to ws server.`
      );

      if (this.isConnected) {
        try {
          this.wsCon.send(payload);
          isSent = true;
          this.logger(["WS message was sent back to server.", payload]);
        } catch (e) {
          this.logger(["WS sending back failed.", payload], "error");
          throw e;
        }
      }

      attempts++;
      if (isSent || attempts === max) clearInterval(interval);
      // if (attempts === max)
      //   throw new Error("Websocket send attempts timed out.");
    }, sec);
  }

  /**
   * @param {object} data
   * @returns {void}
   */
  addToSendQueue(data) {
    data.request_id = getUniqueId(this.requestIdLength);
    this.sendQueue.push(data);
  }

  /**
   * @returns {void}
   */
  processSendQueue() {
    this.isProcessingSendQueue = true;

    if (this.sendQueue.length > 0) {
      this.sendQueueInterval = setInterval(() => {
        let payload = this.sendQueue[0];

        if (payload != null) {
          this.sendBack(payload);
          this.sendQueue.shift();
        } else {
          this.stopSendQueue();
        }
      }, this.sendQueueDelay);
    } else {
      this.stopSendQueue();
    }
  }

  stopSendQueue() {
    clearInterval(this.sendQueueInterval);
    this.sendQueueInterval = null;
    this.isProcessingSendQueue = false;
  }

  /**
   * @returns {void}
   */
  setCallbacks() {
    this.wsCon.onclose = () => {
      if (!this.isDisconnectedProgrammatically) {
        this.logger("Connection has been closed unexpectedly!", "error");
        this.resetVariables();
        this.reconnect();
      }
    };

    this.wsCon.onmessage = (response) => {
      let isDataAnObject = true;

      try {
        JSON.parse(response.data);
      } catch (e) {
        isDataAnObject = false;
      }

      if (isDataAnObject) {
        const event = JSON.parse(response.data);

        if (event.message === "Internal server error") {
          // showSmallNotif('danger', {
          //   message: 'Websocket failed'
          // });
          console.error(event);
        } else {
          const callbacks = filter(this.listeners, (o) => {
            return (
              includes(event.channels, o.channel) && o.event === event.name
            );
          });

          if (callbacks.length > 0) {
            forEach(callbacks, (o) => {
              o.callback(event.data);
            });
          }
        }
      } else {
        if (response.data === "pong") {
          this.hasPongResponded = true;
        }
      }
    };
  }

  /**
   * @param {string} event
   * @param {function} callback
   * @return {WS}
   */
  listen(event, callback) {
    if (this.currentChannels.length === 0) {
      throw new Error(
        'Missing channels to connect the listeners into. Please call ".channel(channels)" first.'
      );
    }

    this.logger(
      `Added Listener ${event} to channel(s) ${this.currentChannels.join(", ")}`
    );

    forEach(this.currentChannels, (channel) => {
      this.listeners.push({
        channel,
        event,
        callback,
      });
    });

    return this;
  }

  /**
   * @param {string} event
   * @param {function} [callback = null]
   * @return {WS}
   */
  unlisten(event, callback = null) {
    if (this.currentChannels.length === 0) {
      throw new Error(
        'Missing channels to connect the listeners into. Please call ".channel(channels)" first.'
      );
    }

    this.logger(
      `Removed Listener ${event} from channel(s) ${this.currentChannels.join(
        ", "
      )}`
    );

    forEach(this.currentChannels, (channel) => {
      if (callback === null) {
        remove(this.listeners, (o) => {
          return o.channel === channel && o.event === event;
        });
      } else {
        remove(this.listeners, (o) => {
          return (
            o.channel === channel &&
            o.event === event &&
            o.callback === callback
          );
        });
      }
    });

    return this;
  }

  /**
   * @param {array} channels
   * @return {WS}
   */
  unlistenChannel(channels) {
    this.logger(`Removing all listeners from channel ${channels.join(", ")}`);

    forEach(channels, (channel) => {
      remove(this.listeners, (o) => {
        return o.channel === channel;
      });
    });

    return this;
  }

  /**
   * @param {string|array} channels
   * @return {WS}
   */
  channel(channels) {
    channels = getChannels(channels);

    const diff = difference(channels, this.subscribedChannels);
    if (diff.length > 0) {
      throw new Error(
        `The following channel(s) doesn't exist in the subcribed list of channels : ${diff.join(
          ", "
        )}`
      );
    }

    this.currentChannels = intersection(channels, this.subscribedChannels);
    return this;
  }

  /**
   * @param {string|array} channels
   * @param {object} [data = null]
   * @return {WS}
   */
  subscribe(channels, data = null) {
    this.currentChannels = getChannels(channels);

    let ch = difference(this.currentChannels, this.subscribedChannels);

    this.logger("--------------------------------------------------");
    this.logger(["Current Subscribed : ", this.subscribedChannels]);
    this.logger(["Provided Channel(s) : ", this.currentChannels]);
    this.logger(["Channel(s) to be subscribed : ", ch]);

    forEach(ch, (c) => {
      this.subscribedChannels.push(c);
    });

    this.logger(["Subscription Result : ", this.subscribedChannels]);

    if (ch.length > 0) {
      let payload = {
        action: "join",
        channels: ch,
      };
      if (data == null) payload.data = {};
      payload.data.user_id = this.user.id;

      this.addToSendQueue(payload);
      if (!this.isProcessingSendQueue) {
        this.processSendQueue();
      }
    }

    return this;
  }

  /**
   * @param {string|array} channels
   * @param {object} [data = null]
   * @return {WS}
   */
  unsubscribe(channels, data = null) {
    const provided = getChannels(channels);
    const ch = intersection(provided, this.subscribedChannels);

    this.logger("--------------------------------------------------");
    this.logger(["Current Subscribed : ", this.subscribedChannels]);
    this.logger(["Provided Channel(s) : ", provided]);
    this.logger(["Channel(s) to be unsubscribed : ", ch]);

    forEach(ch, (c) => {
      remove(this.subscribedChannels, (sc) => {
        return sc === c;
      });
    });

    this.logger("Subscription Result : ", this.subscribedChannels);

    this.unlistenChannel(ch);

    if (ch.length > 0) {
      let payload = {
        action: "leave",
        channels: ch,
      };
      if (data == null) payload.data = {};
      payload.data.user_id = this.user.id;

      this.addToSendQueue(payload);
      if (!this.isProcessingSendQueue) {
        this.processSendQueue();
      }
    }

    return this;
  }

  /**
   * @returns {void}
   */
  resetCurrentChannels() {
    this.currentChannels = [];
  }

  /**
   * @param {string|array} params - regular parameters for console.log
   * @param {string} type - distiction on what kind of console.log to use.
   * @returns {void}
   */
  logger(params, type = "log") {
    if (this.verbose) {
      params = isString(params) ? [params] : params;

      if (type === "log") console.log(...params);
      else if (type === "warn") console.warn(...params);
      else if (type === "info") console.info(...params);
      else if (type === "error") console.error(...params);
    }
  }
}

export default WS;
