// src/db/ticketDB.js
import Dexie from "dexie";

const db = new Dexie("HospitalTicketDB");

// Define schema
db.version(1).stores({
  tickets: "++id, date", // id is auto-increment, date used for filtering
  meta: "key", // for storing ticket counter & last reset date
});

// Initialize meta on first load
async function initializeMeta() {
  const lastReset = await db.meta.get("lastReset");
  const today = new Date().toDateString();

  if (!lastReset || lastReset.value !== today) {
    await db.meta.put({ key: "lastReset", value: today });
    await db.meta.put({ key: "ticketCounter", value: 1 });
  }
}

initializeMeta();

export default db;
