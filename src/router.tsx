import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import GithubConfirm from "./routes/GithubConfirm";
import Home from "./routes/Home";
import KakaoConfirm from "./routes/KakaoConfirm";
import NotFound from "./routes/NotFound";
import RoomDetail from "./routes/RoomDetail";
import UploadPhotos from "./routes/UploadPhotos";
import MyBookings from "./routes/MyBookings";
import CreateRoom from "./routes/CreateRoom";
import UpdateRoom from "./routes/UpdateRoom";
import ManageBookings from "./routes/ManageBookings";

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
        path: "rooms/create",
        element: <CreateRoom />,
      },
      {
        path: "rooms/:room_id",
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
        path: "bookings/manage",
        element: <ManageBookings />,
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