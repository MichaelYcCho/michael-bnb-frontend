// User

export interface IUser {
  last_login: string;
  username: string;
  email: string;
  date_joined: string;
  avatar: string;
  name: string;
  is_host: boolean;
  gender: string;
  language: string;
  currency: string;
}

interface ISignUp{
  name: string;
  username: string;
  password: string;
  password_confirm: string;
  email: string;
  phone: string;
}

export interface IUsernameLogin {
  username: string;
  password: string;
}


// Room
export interface ICreateRoom {
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

export interface IUpdateRoom extends ICreateRoom {
  room_id: string;
}

export interface IUploadImage {
  file: FileList;
  uploadURL: string;
}

export interface ICreatePhoto {
  description: string;
  file: string;
  room_id: string;
}


export interface IRoomPhotoPhoto {
    id: string;
    file: string;
    description: string;
  }
  
  export interface IRoomList {
    id: number;
    name: string;
    country: string;
    city: string;
    price: number;
    rating: number;
    is_owner: boolean;
    is_wish_listed: boolean;
    photos: IRoomPhotoPhoto[];
  }
  
  export interface IRoomOwner {
    name: string;
    avatar: string;
    username: string;
  }
  
  export interface IAmenity {
    id: number;
    name: string;
    description: string;
  }

  export interface ICategory {
    id: number;
    name: string;
    kind: string;
  }
  
  export interface IRoomDetail extends IRoomList {
    id: number;
    created_at: string;
    updated_at: string;
    rooms: number;
    toilets: number;
    description: string;
    address: string;
    pet_friendly: true;
    kind: string;
    is_owner: boolean;
    category: ICategory;
    owner: IRoomOwner;
    amenities: IAmenity[];
  }

  export interface IRoomReview {
    content: string;
    rating: number;
    user: IRoomOwner;
  }


  // Booking
  export interface ICreateBooking {
    room_id: string;
    check_in: string;
    check_out: string;
    guests: number;
  }

  export interface IBooking {
    id: number;
    room: {
      name: string;
      price: number;
    };
    kind: string;
    check_in: string;
    check_out: string;
    guests: number;
    is_canceled: boolean;
  }

  interface IManageBooking {
    id: number;
    room: {
      name: string;
      price: number;
    };
    check_in: string;
    check_out: string;
    guests: number;
    is_canceled: boolean;
    user: {
      name: string;
      phone: string;
    };
  }
  