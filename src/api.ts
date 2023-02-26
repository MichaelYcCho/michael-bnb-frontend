import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { formatDate } from "./lib/utils";
import { ICreateBooking, ICreatePhoto, ICreateRoom, ISignUp, IUpdateRoom, IUploadImage, IUsernameLogin } from "./types";

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 
  "development" 
  ? "http://127.0.0.1:8000/api/"
  : `${process.env.REACT_APP_API_URL}`,
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
          `/users/v0/sign-up`,
          { name, username, password, password_confirm, email, phone },
          {
              headers: {
                  "X-CSRFToken": Cookie.get("csrftoken") || "",
              },
          }
      )
      .then((response) => response.data);



export const getMe = () =>
instance.get(`users/v0/me`).then((response) => response.data);


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
    `users/v0/log-in`,
    { username, password },
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );

export const logOut = () =>
instance
  .post(`users/v0/log-out`, null, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  })
  .then((response) => response.data);

  export const changeMode = () =>
  instance
    .patch(`users/v0/change-mode`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const githubLogIn = (code: string) =>
instance
  .post(
    `users/v0/github`,
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
    `users/v0/kakao`,
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
  instance.get("rooms/v1/list").then((response) => response.data);

export const getRoom = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_id] = queryKey;
  return instance.get(`rooms/v1/detail/${room_id}`).then((response) => response.data);
};

export const getRoomAmenities = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_id] = queryKey;
  return instance
      .get(`rooms/v1/${room_id}/amenities`)
      .then((response) => response.data.results);
};

export const getRoomReviews = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_id] = queryKey;
  return instance
    .get(`reviews/v1/list/${room_id}`)
    .then((response) => response.data);
};

export const getAmenities = () =>
  instance.get(`rooms/v1/amenities/list`).then((response) => response.data);

export const getCategories = () =>
  instance.get(`categories/v1/list`).then((response) => response.data);

export const createRoom = (variables: ICreateRoom) =>
  instance
    .post(`rooms/v1/create`, variables, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const getUploadURL = () =>
  instance
    .post(`medias/v0/photos/get-url`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const updateRoom = (variables: IUpdateRoom) =>
    instance
        .put(`rooms/v1/update/${variables.room_id}`, variables, {
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
  room_id,
}: ICreatePhoto) =>
  instance
    .post(
      `rooms/v1/${room_id}/photos`,
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
        `bookings/v1/check/${room_id}?check_in=${check_in}&check_out=${check_out}`
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
            `bookings/v1/create`,
            { room_id, check_in, check_out, guests },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.data);
};

export const getManageBookings = () =>
  instance.get("bookings/v1/manage").then((response) => response.data);

export const getBookings = () =>
  instance.get("bookings/v1/my").then((response) => response.data);

export const cancelBooking = (booking_pk: number) =>
  instance
    .patch(`bookings/v1/cancel/${booking_pk}`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.status);


// WhishList
export const toggleWishList = (room_pk: number) =>
  instance
    .put(`wishlists/v0/toggle/${room_pk}`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);