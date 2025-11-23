import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export function ProfileHeader({
  username,
  handle,
  description,
  avatarUrl,
  bannerUrl,
  onEditProfile,
  onDeleteProfile,
}) {
  return (
    <div>
      <div className="w-full h-24 sm:h-32 md:h-48 bg-gray-800 overflow-hidden">
        <img
          src={bannerUrl}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-row gap-4">
          <img
            src={avatarUrl}
            alt={username}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-green-600"
          />
          <div className="flex flex-col flex-1">
            <h1 className="text-xl font-semibold flex items-center gap-2 text-green-600">
              {username}
              <CheckCircleIcon
                sx={{ fontSize: "18px", color: "gray", ml: "5px" }}
              />
            </h1>
            <p className="text-gray-500 text-sm">{handle}</p>
            <p className="mt-2 text-gray-200 line-clamp-2">{description}</p>

            <div className="mt-4 hidden md:flex gap-3">
              <button
                onClick={onEditProfile}
                className="bg-blue-500 text-white border px-4 py-1 rounded flex items-center gap-2"
              >
                {/* <Settings className="w-4 h-4" /> */}
                <SettingsIcon
                  sx={{ fontSize: "18px", color: "black", ml: "5px" }}
                />
                Editar perfil
              </button>
              <button
                onClick={onDeleteProfile}
                className="bg-red-500 text-white border px-4 py-1 rounded flex items-center gap-2"
              >
                <RemoveCircleIcon
                  sx={{ fontSize: "18px", color: "black", ml: "5px" }}
                />
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
        <div className="flex md:hidden gap-3 mt-4 w-full">
          <button
            onClick={onEditProfile}
            className="flex-1 bg-blue-500 text-white px-2 py-1.5 rounded flex items-center justify-center gap-2"
          >
            <SettingsIcon sx={{ fontSize: 18, color: "black" }} />
            Editar perfil
          </button>

          <button
            onClick={onDeleteProfile}
            className="flex-1 bg-red-500 text-white px-2 py-1.5 rounded flex items-center justify-center gap-2"
          >
            <RemoveCircleIcon sx={{ fontSize: 18, color: "black" }} />
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
