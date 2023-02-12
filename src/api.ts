import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { formatDate } from "./lib/utils";
import { ICreateBooking, ICreatePhoto, ICreateRoom, ISignUp, IUpdateRoom, IUploadImage, IUsernameLogin } from "./types";

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 
  "development" 
  ? "http://127.0.0.1:8000/api/v0/"
  : "https://backend.michael-bnb.store/api/v0/",
  withCredentials: true,
});

// User
export const userSignUp = ({
  name,
  username,
  password,
  password_confirm,
  email,
  phone,
}: ISignUp) =>
  instance
      .post(
          `/users/sign-up`,
          { name, username, password, password_confirm, email, phone },
          {
              headers: {
                  "X-CSRFToken": Cookie.get("csrftoken") || "",
              },
          }
      )
      .then((response) => response.data);



export const getMe = () =>
instance.get(`users/me`).then((response) => response.data);


export interface IUsernameLoginSuccess {
  ok: string;
}
export interface IUsernameLoginError {
  error: string;
}

export const usernameLogIn = ({
  username,
  password,
}: IUsernameLogin) =>
  instance.post(
    `users/log-in`,
    { username, password },
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );

export const logOut = () =>
instance
  .post(`users/log-out`, null, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  })
  .then((response) => response.data);

  export const changeMode = () =>
  instance
    .patch(`users/change-mode`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const githubLogIn = (code: string) =>
instance
  .post(
    `users/github`,
    { code },
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  )
  .then((response) => response.status);

export const kakaoLogIn = (code: string) =>
instance
  .post(
    `users/kakao`,
    { code },
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  )
  .then((response) => response.status);

// Room
export const getRooms = () =>
  instance.get("rooms/list").then((response) => response.data);

export const getRoom = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_id] = queryKey;
  return instance.get(`rooms/${room_id}`).then((response) => response.data);
};

export const getRoomAmenities = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_id] = queryKey;
  return instance
      .get(`rooms/${room_id}/amenities`)
      .then((response) => response.data);
};

export const getRoomReviews = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_id] = queryKey;
  return instance
    .get(`rooms/${room_id}/reviews`)
    .then((response) => response.data);
};

export const getAmenities = () =>
  instance.get(`rooms/amenities`).then((response) => response.data);

export const getCategories = () =>
  instance.get(`categories`).then((response) => response.data);

export const createRoom = (variables: ICreateRoom) =>
  instance
    .post(`rooms/create`, variables, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const getUploadURL = () =>
  instance
    .post(`medias/photos/get-url`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const updateRoom = (variables: IUpdateRoom) =>
    instance
        .put(`rooms/${variables.room_pk}`, variables, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

export const uploadImage = ({ file, uploadURL }: IUploadImage) => {
  const form = new FormData();
  form.append("file", file[0]);
  return axios
    .post(uploadURL, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export const createPhoto = ({
  description,
  file,
  room_pk,
}: ICreatePhoto) =>
  instance
    .post(
      `rooms/${room_pk}/photos`,
      { description, file },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);


// Booking
type CheckBookingQueryKey = [string, string?, Date[]?];

export const checkBooking = ({
  queryKey,
}: QueryFunctionContext<CheckBookingQueryKey>) => {
  const [_, room_id, dates] = queryKey;
  if (dates) {
    const [firstDate, secondDate] = dates;
    const check_in = formatDate(firstDate);
    const check_out = formatDate(secondDate);
    return instance
      .get(
        `bookings/${room_id}/check?check_in=${check_in}&check_out=${check_out}`
      )
      .then((response) => response.data);
  }
};

export const createBooking = ({
    room_id,
    check_in,
    check_out,
    guests,
}: ICreateBooking) => {
    return instance
        .post(
            `bookings/${room_id}`,
            { check_in, check_out, guests },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.data);
};

export const getManageBookings = () =>
  instance.get("bookings/manage").then((response) => response.data);

export const getBookings = () =>
  instance.get("bookings/my").then((response) => response.data);

export const cancelBooking = (booking_pk: number) =>
  instance
    .post(`bookings/cancel/${booking_pk}`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.status);


// WhishList
export const toggleWishList = (room_pk: number) =>
  instance
    .put(`wishlists/toggle/${room_pk}`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);