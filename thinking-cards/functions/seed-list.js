const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp({ projectId: "thinking-cards" });
const db = admin.firestore();
db.collection("categories").orderBy("order").get().then(snap => {
  snap.docs.forEach(d => {
    const data = d.data();
    console.log(d.id, "|", data.name, "|", data.type || "standard", "|", data.order);
  });
  process.exit(0);
});
