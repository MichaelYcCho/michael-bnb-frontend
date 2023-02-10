import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import GithubConfirm from "./routes/GithubConfirm";
import Home from "./routes/Home";
import KakaoConfirm from "./routes/KakaoConfirm";
import NotFound from "./routes/NotFound";
import RoomDetail from "./routes/RoomDetail";
import UploadPhotos from "./routes/UploadPhotos";
import CreateRoom from "./routes/CreateRoom";
import UpdateRoom from "./routes/UpdateRoom";
import MyBookings from "./routes/MyBookings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "rooms/upload",
        element: <CreateRoom />,
      },
      {
        path: "rooms/:room_pk",
        element: <RoomDetail />,
      },
      {
        path: "rooms/:room_pk/update",
        element: <UpdateRoom />,
    },
      {
        path: "rooms/:room_pk/photos",
        element: <UploadPhotos />,
      },
      {
        path: "bookings/my",
        element: <MyBookings />,
      },
      {
        path: "social",
        children: [
          {
            path: "github",
            element: <GithubConfirm />,
          },
          {
            path: "kakao",
            element: <KakaoConfirm />,
          },
        ],
      },
    ],
  },
]);

export default router;