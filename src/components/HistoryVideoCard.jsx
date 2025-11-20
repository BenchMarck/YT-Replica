//import { X } from "lucide-react";
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";

export function HistoryVideoCard({ video, onRemove, }) {
  
  const videoId = video?.id?.videoId || video?.id || video?.video_id;
  const title = video?.snippet?.title || video?.title;
  const thumbnail = video?.snippet?.thumbnails?.high?.url || video?.thumbnail;
  const timestamp = video?.snippet?.publishedAt ? new Date(video.snippet.publishedAt).toLocaleDateString() : video?.uploaded_at || "time ago";
  const watchedAt = video?.watched_on || "today";
  
  const duration = video?.contentDetails?.duration || video?.duration || "00:00";
  const views = video?.statistics?.viewCount || video?.views || "0";

  return (
    <div className="group flex gap-3 p-2 rounded-lg hover:bg-gray-500 items-center">
      <Link to={`/video/${videoId}`}  className="relative w-40 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {duration}
        </div>
      </Link>
      <Link to={`/video/${videoId}`}  className="flex-1 min-w-0 cursor-pointer">
        <h3 className="text-sm font-medium text-white hover:text-black line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-xs"> {views} views · {timestamp} </p>
        <p className="text-gray-200 text-xs">Watched {watchedAt}</p>
      </Link>
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity
        bg-red-600 text-white rounded-lg hover:text-gray-400 px-2 py-1"
      >
        <CloseIcon sx={{fontSize: "18px", color: "black", mr: "2px"}} />
        Remover
      </button>
    </div>
  );
}
