import React from "react";
import HistoryTab from "./HistoryTab";

export default function ProfileTabs({
  activeTab,
  setActiveTab,
  profileData,
  watchHistory,
  onClearHistory,
  onRemoveFromHistory,
}) {
  
  const tabs = ["home", "history", "about"];

  return (
    <>
      {/* ---- Tabs Navigation ---- */}
      <div className="max-w-6xl mx-auto px-4 mt-6 border-b border-gray-700 flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---- Tabs Content ---- */}
      <div className="max-w-6xl mx-auto px-4 mt-6 text-gray-300">
        {activeTab === "home" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p>{profileData.description || "No description yet."}</p>
          </div>
        )}

        {activeTab === "history" && (
          <HistoryTab
            history={watchHistory}
            onClear={onClearHistory}
            onRemove={onRemoveFromHistory}
          />
        )}

        {activeTab === "about" && (
          <div className="max-w-2xl space-y-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p>📧 {profileData?.email || "No email found"}</p>
              <p>
                📅 Joined:{" "}
                {new Date(
                  profileData?.joinDate?.seconds * 1000
                ).toDateString() || "No join date found"}
              </p>
            </div>
          </div>
        )}        
      </div>
    </>
  );
}
