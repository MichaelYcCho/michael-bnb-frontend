import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { formatDate } from "./lib/utils";
import { ICreateBooking, ISignUp } from "./types";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v0/",
  withCredentials: true,
});



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


// Room

export const getRooms = () =>
  instance.get("rooms/").then((response) => response.data);

export const getRoom = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_pk] = queryKey;
  return instance.get(`rooms/${room_pk}`).then((response) => response.data);
};

export const getRoomAmenities = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_pk] = queryKey;
  return instance
      .get(`rooms/${room_pk}/amenities`)
      .then((response) => response.data);
};

export const getRoomReviews = ({ queryKey }: QueryFunctionContext) => {
  const [_, room_pk] = queryKey;
  return instance
    .get(`rooms/${room_pk}/reviews`)
    .then((response) => response.data);
};

export const getMe = () =>
  instance.get(`users/me`).then((response) => response.data);

export const logOut = () =>
  instance
    .post(`users/log-out`, null, {
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

export interface IUsernameLoginVariables {
  username: string;
  password: string;
}
export interface IUsernameLoginSuccess {
  ok: string;
}
export interface IUsernameLoginError {
  error: string;
}

export const usernameLogIn = ({
  username,
  password,
}: IUsernameLoginVariables) =>
  instance.post(
    `users/log-in`,
    { username, password },
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );

export const getAmenities = () =>
  instance.get(`rooms/amenities`).then((response) => response.data);

export const getCategories = () =>
  instance.get(`categories`).then((response) => response.data);

export interface ICreateRoomVariables {
  name: string;
  country: string;
  city: string;
  price: number;
  rooms: number;
  toilets: number;
  description: string;
  address: string;
  pet_friendly: boolean;
  kind: string;
  amenities: number[];
  category: number;
}


export const createRoom = (variables: ICreateRoomVariables) =>
  instance
    .post(`rooms/`, variables, {
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

export interface IUpdateRoomVariables extends ICreateRoomVariables {
  room_pk: string;
}

export const updateRoom = (variables: IUpdateRoomVariables) =>
    instance
        .put(`rooms/${variables.room_pk}`, variables, {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);


export interface IUploadImageVarialbes {
  file: FileList;
  uploadURL: string;
}

export const uploadImage = ({ file, uploadURL }: IUploadImageVarialbes) => {
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

export interface ICreatePhotoVariables {
  description: string;
  file: string;
  room_pk: string;
}

export const createPhoto = ({
  description,
  file,
  room_pk,
}: ICreatePhotoVariables) =>
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
  const [_, room_pk, dates] = queryKey;
  if (dates) {
    const [firstDate, secondDate] = dates;
    const check_in = formatDate(firstDate);
    const check_out = formatDate(secondDate);
    return instance
      .get(
        `bookings/${room_pk}/check?check_in=${check_in}&check_out=${check_out}`
      )
      .then((response) => response.data);
  }
};





export const createBooking = ({
    room_pk,
    check_in,
    check_out,
    guests,
}: ICreateBooking) => {
    return instance
        .post(
            `bookings/${room_pk}`,
            { check_in, check_out, guests },
            {
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken") || "",
                },
            }
        )
        .then((response) => response.data);
};