import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

const generateUsername = (email) => {
  const prefix = email?.split("@")[0] || "user";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
};

export const createUserDocument = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const defaultAvatar = user.photoURL ||
      "https://wallpapers-clan.com/wp-content/uploads/2024/11/just-a-chill-guy-pfp-01.jpg";

    const defaultBanner =
      "https://cdna.artstation.com/p/marketplace/presentation_assets/001/578/196/large/file.jpg";

    await setDoc(userRef, {
      id: user.uid,
      username: user.displayName || generateUsername(user.email),
      handle: `@${user.displayName || user.email.split("@")[0]}`,
      email: user.email,
      avatarUrl: defaultAvatar,
      bannerUrl: defaultBanner,
      joinDate: serverTimestamp(),
    });
  }
};
