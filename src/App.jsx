import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChannelDetail, VideoDetail, SearchFeed, Feed } from './components';
import ProfileUser from "./components/ProfileUser";
import NotFound from "./components/NotFound";
import Main from "./layout/Main";
import AuthRoute from "./auth/AuthRoute";
import Signup from "./auth/Signup";
import Login from "./auth/Login";

import AdvancedSearchFeed from "./components/AdvancedSearchFeed";

import SmartScrollToTop from "./components/SmartScrollToTop";

import { MapProvider } from "./context/MapContext";


export default function App() {
  
  return (
  <MapProvider>
    <Router>
      <SmartScrollToTop />
      <Routes>
        <Route element={<Main />}>
          <Route path="/" element={<Feed />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/channel/:id" element={<ChannelDetail />} />
          <Route path="/search/:searchTerm" element={<SearchFeed />} />
          <Route path="/search-advanced" element={<AdvancedSearchFeed />} />
          <Route path="/profile" element={<AuthRoute> <ProfileUser /> </AuthRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  </MapProvider>
    );
  }
