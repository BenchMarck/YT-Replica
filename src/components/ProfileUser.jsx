import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import { ProfileHeader } from "./ProfileHeader";
import { EditProfileDialog } from "./EditProfileDialog";
import ProfileTabs from "./ProfileTabs";

import { updateUserProfile, deleteUserProfile,
          getUserHistory, removeHistoryItem, clearUserHistory, } from "../utils/userService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileUser() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [isClearHistoryDialogOpen, setIsClearHistoryDialogOpen] = useState(false);
  const [isDeleteProfileDialogOpen, setIsDeleteProfileDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // -------- Fetch user data ---------- //
  const loadUserData = useCallback(async () => {
    if (!user || !profile) return;
    try {
      const [history] = await Promise.all([
        getUserHistory(user.uid),
      ]);
      setProfileData(profile);
      setWatchHistory(history);
    } catch (err) {
    }
  }, [user, profile]);

  useEffect(() => { loadUserData(); }, [loadUserData]);

  // -------- Handlers ---------- //
  const handleSaveProfile = async (newData) => {
    await updateUserProfile(user.uid, newData);
    setProfileData((prev) => ({ ...prev, ...newData }));
    toast.success("Perfil actualizado con éxito!");
  };

  const handleDeleteProfile = async () => {
    await deleteUserProfile(user.uid);
    setIsDeleteProfileDialogOpen(false);
    toast.success("Perfil eliminado");
    navigate("/");
  };

  const handleRemoveFromHistory = async (videoId) => {
    await removeHistoryItem(user.uid, videoId);
    setWatchHistory((prev) => prev.filter((v) => v.id !== videoId));
    toast.success("Eliminado del historial de reproducción");
  };

  const handleClearHistory = async () => {
    await clearUserHistory(user.uid);
    setWatchHistory([]);
    setIsClearHistoryDialogOpen(false);
    toast.success("Historial de reproducción borrado");
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in first.</p>;
  if (!profile) return <p>Loading profile1...</p>;
  if (profileData === null) return <p>Loading profile2...</p>;
  if (!profileData) return <p>No profile found</p>;

  return (
    <div className="min-h-screen">
      <ToastContainer position="bottom-right" />

      <div>
        <ProfileHeader
          username={profileData.username}
          handle={profileData.handle}
          description={profileData.description}
          avatarUrl={profileData.avatarUrl}
          bannerUrl={profileData.bannerUrl}
          onEditProfile={() => setIsEditDialogOpen(true)}
          onDeleteProfile={() => setIsDeleteProfileDialogOpen(true)}
        />
      </div>

      {isEditDialogOpen && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          currentData={profileData}
          onSave={handleSaveProfile}
        />
      )}

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profileData={profileData}
        watchHistory={watchHistory}
        onClearHistory={() => setIsClearHistoryDialogOpen(true)}
        onRemoveFromHistory={handleRemoveFromHistory}
      />
      {isClearHistoryDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Eliminar historial de reproducción?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Esto eliminará permanentemente todos los videos de su historial de reproducción.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsClearHistoryDialogOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearHistory}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteProfileDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Eliminar perfil?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Esto eliminará permanentemente su perfil y todos los datos asociados.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setIsDeleteProfileDialogOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={handleDeleteProfile}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
