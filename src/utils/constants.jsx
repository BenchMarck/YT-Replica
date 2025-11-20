import HomeIcon from "@mui/icons-material/Home";
import DataObjectIcon from "@mui/icons-material/DataObject";
import RadioIcon from "@mui/icons-material/Radio";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RedBull from "./RedBullLogo";
import L from "leaflet";

export const categories = [
  { name: "Home", icon: <HomeIcon /> },
  { name: "Red Bull", icon: <RedBull /> },
  { name: "Coding", icon: <DataObjectIcon /> },
  { name: "Music", icon: <RadioIcon /> },
  { name: "Gaming", icon: <SportsEsportsIcon /> },
  { name: "Sports", icon: <EmojiEventsIcon /> },
];

export const demoProfilePicture = "/demoProfilePicture.jpg";
export const demoChannelUrl = "/channel/UCECJDeK0MNapZbpaOzxrUPA";
export const demoChannelID = "UCECJDeK0MNapZbpaOzxrUPA";
export const demoChannelTitle = "Luisito Comunica";
export const demoVideoUrl = "/video/3pKqiHSfirM";
export const demoVideoID = "3pKqiHSfirM";
export const demoVideoTitle = "Me quedé en el hotel “más lujoso” de todo el mundo: ¿es verdad? | BURJ AL ARAB";
export const demoThumbnailUrl = "/demoThumbnail.jpg";

export const channelObj = [
  {
    id: { channelId: "UC_FAKE_CHANNEL" },
    snippet: {
      title: "Mock Channel",
      description: "This is a locally mocked channel.",
      customUrl: "@mockchannel",
      publishedAt: "2020-01-01T00:00:00Z",
      thumbnails: {
        high: {
          url: "https://wallpapers-clan.com/wp-content/uploads/2024/11/just-a-chill-guy-pfp-01.jpg",
        },
      },
    },
  },
];

// The icon for the user location marker
export const greenIcon = new L.Icon({
  iconUrl: "marker-icon-2x-green.png",
  shadowUrl: "marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// The icon for the video markers
export const videoIcon = new L.Icon({
  iconUrl: "/location.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
