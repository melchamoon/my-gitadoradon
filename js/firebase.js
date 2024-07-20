// Firebaseプロジェクトの設定
const firebaseConfig = {
  apiKey: "AIzaSyB8ISg8emhuMQ-ujbIq-Ob3cHv_H6wm8x4",
  authDomain: "gitadoradon.firebaseapp.com",
  projectId: "gitadoradon",
  storageBucket: "gitadoradon.appspot.com",
  messagingSenderId: "1054794233764",
  appId: "1:1054794233764:web:1056a77a661119aa08b331",
  measurementId: "G-3EE806DGKJ",
};
const databaseNameBase = "rankings_20240720";
const databaseNameAnonymous = `${databaseNameBase}_anonymous`;
const databaseNameNamed = `${databaseNameBase}_named`;

// Firebaseを初期化
firebase.initializeApp(firebaseConfig);

// Firestoreのインスタンスを初期化
let db = firebase.firestore();

let docRefID = "";
// データを追加
async function addPoint(point, name) {
  const databaseName = name !== "" ? databaseNameNamed : databaseNameAnonymous;

  await db.collection(databaseName).add({
    point: point,
    name: name,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
  })
    .then(function (docRef) {
      docRefID = docRef.id;
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

async function fetchRankings() {
  return await db.collection(databaseNameNamed)
    .where('point', '>=', 1)
    .orderBy('point', 'desc')
    .limit(300)
    .get();
}
