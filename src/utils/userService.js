import { doc, getDoc, updateDoc, deleteDoc,
        collection, getDocs, query, orderBy, } from "firebase/firestore";
import { writeBatch, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";


export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("User not found");
  return { id: snap.id, ...snap.data() };
}

export async function updateUserProfile(uid, newData) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, newData);
}

export async function deleteUserProfile(uid) {
  const ref = doc(db, "users", uid);
  await deleteDoc(ref);
}


// watch history is a subcollection: users/{uid}/watch_history
export async function getUserHistory(uid) {
  const ref = collection(db, "users", uid, "watch_history");
  const q = query(ref, orderBy("watched_on", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    uploaded_at:
    typeof doc.data().uploaded_at === "string"
    ? doc.data().uploaded_at
    : doc.data().uploaded_at?.toDate?.().toLocaleDateString() || "N/A",
    watched_on: doc.data().watched_on?.toDate?.().toLocaleDateString() || "N/A",
  }));
}

export async function removeHistoryItem(uid, videoId) {
  const ref = doc(db, "users", uid, "watch_history", videoId);
  await deleteDoc(ref);
}

export async function clearUserHistory(uid) {
  const ref = collection(db, "users", uid, "watch_history");
  const snap = await getDocs(ref);
  const batch = writeBatch(db);
  snap.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}


// Add a video to watch history (full data)
export async function addToHistory(uid, data, videoId) {
  if (!uid || !data || !videoId) return;

  const historyRef = doc(db, "users", uid, "watch_history", videoId);

  const fullData = {
    video_id: videoId,
    title: data.snippet?.title,
    thumbnail: data.snippet?.thumbnails?.high?.url,
    channel_id: data.snippet?.channelId,
    channel_title: data.snippet?.channelTitle,
    uploaded_at: data.snippet?.publishedAt,
    duration: formatDuration(data.contentDetails?.duration) || "00:00",
    views: data.statistics?.viewCount || "0",
    likes: data.statistics?.likeCount || "0",
    watched_on: serverTimestamp(),
  };
  
  await setDoc(historyRef, fullData);
}

// update watched_on timestamp
export async function updateHistoryField(uid, videoId) {
  if (!uid || !videoId) return;
  const ref = doc(db, "users", uid, "watch_history", videoId);
  const snap = await getDoc(ref);
  if (snap.exists()) await updateDoc(ref, { watched_on: serverTimestamp() });
  else return "not found";
}


  function formatDuration(iso) {
    if (!iso) return;
    if (typeof iso !== "string") return;
    if (!iso.startsWith("PT")) return;

    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = parseInt(match[1] || 0, 10);
    const minutes = parseInt(match[2] || 0, 10);
    const seconds = parseInt(match[3] || 0, 10);

    const h = hours > 0 ? `${hours}:` : "";
    const m = (hours > 0 ? String(minutes).padStart(2, "0") : String(minutes)) || "0";
    const s = String(seconds).padStart(2, "0");

    return `${h}${m}:${s}`;
  }
  
  export { formatDuration };
