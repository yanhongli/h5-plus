export function save(name, item) {
  let data;
  if (typeof item === "object") {
    data = JSON.stringify(item);
  } else {
    data = String(item);
  }

  window.localStorage.setItem(name, data);
}

export function read(name) {
  const item = localStorage.getItem(name);
  try {
    return JSON.parse(item);
  } catch (error) {
    return item;
  }
}
