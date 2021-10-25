import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

export const STATUS_NEW = 1;
// export const STATUS_ACCEPTED = 2;
export const STATUS_OPEN = 2;
export const STATUS_PENDING = 3;
export const STATUS_RESOLVED = 4;
export const STATUS_CLOSED = 5;
// export const STATUS_DECLINED = 6;
export const STATUS_MERGED = 6;
export const STATUS_SPAM = 7;

export function getStatusList() {
  return [
    { code: STATUS_OPEN, value: "open", label: "Open" },
    { code: STATUS_RESOLVED, value: "solved", label: "Solved" },
    { code: STATUS_CLOSED, value: "closed", label: "Closed" },
    { code: STATUS_MERGED, value: "merged", label: "Merged" },
    { code: 0, value: "unassigned", label: "Unassigned" },
    { code: 0, value: "assigned", label: "Recently Updated" },
    { code: STATUS_SPAM, value: "spam", label: "SPAM" },
  ];
}

export function statusName(status, showFullName = true) {
  let statusTitle = "";
  switch (status) {
    case STATUS_NEW:
      statusTitle = "New";
      break;
    case STATUS_OPEN:
      statusTitle = "Open";
      break;
    case STATUS_PENDING:
      statusTitle = "Pending";
      break;
    case STATUS_RESOLVED:
      statusTitle = "Solved";
      break;
    case STATUS_CLOSED:
      statusTitle = "Closed";
      break;
    case STATUS_MERGED:
      statusTitle = "Merged";
      break;
    case STATUS_SPAM:
      statusTitle = "Spam";
      break;
    default:
      statusTitle = "";
  }

  if (!showFullName) {
    return statusTitle.charAt(0);
  }

  return statusTitle;
}

export const converObjectToArray = (object) => {
  return Object.keys(object).map((key) => [key, object[key]]);
};

export function getCurrentUrl(location) {
  return location.pathname.split(/[?#]/)[0];
}

export function checkIsActive(location, url) {
  const current = getCurrentUrl(location);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
}

export function copyToClipboard(text) {
  var input = document.createElement("textarea");
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
}

export const humanizeDurationTime = (mint) => {
  const mintInt = parseInt(mint);
  if (mintInt < 1) {
    return 0;
  }

  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  return dayjs.duration(parseInt(mint), "minutes").humanize();

};
