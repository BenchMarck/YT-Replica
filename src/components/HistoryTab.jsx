import React from "react";
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import { HistoryVideoCard } from "./HistoryVideoCard";

export default function HistoryTab({ history, onClear, onRemove }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
        <HistoryIcon sx={{ fontSize: "18px", color: "white", mr: "5px" }} />
          Watch History
        </h2>
        {history.length > 0 && (
          <button

            onClick={onClear}
            className="border border-gray-600 px-3 py-1 rounded hover:bg-red-600 hover:border-red-600"
          >
            <DeleteIcon sx={{ fontSize: "18px", color: "white", mr: "5px" }} />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No watch history yet</p>
      ) : (

          history.map((video) => {
            const videoId = video?.video_id || video?.id?.videoId || video?.id;
            return (
            <HistoryVideoCard
              key={videoId}
              video={video}
              onRemove={() => onRemove(videoId)}
            />
          )})
      )}
    </div>

  );
}
