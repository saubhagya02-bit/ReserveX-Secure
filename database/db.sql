Table users {
  user_id int [pk, increment]
  business_name varchar
  email varchar [unique]
  username varchar [unique]
  password varchar
  no_of_current_bookings int
  role enum('VENDOR','EMPLOYEE')
  created_at timestamp
  last_updated_at timestamp
}

Table stalls {
  stall_id int [pk, increment]
  stall_name varchar [unique]
  size enum('small','medium','large')
  price decimal
  gridCol int
  gridRow int
  is_Confirmed boolean
}

Table reservations {
  reservation_id int [pk, increment]
  user_id int
  reservation_date timestamp
  status enum('Pending','Approved','Rejected')
  qr_code_path varchar
}

Table reservation_stalls {
  reservation_id int
  stall_id int

  indexes {
    (reservation_id, stall_id) [pk]
  }
}

Table reservation_genres {
  reservation_id int
  stall_id int
  genre_name varchar

  indexes {
    (reservation_id, stall_id, genre_name) [pk]
  }
}

Ref: reservations.user_id > users.user_id
Ref: reservation_stalls.reservation_id > reservations.reservation_id
Ref: reservation_stalls.stall_id > stalls.stall_id
Ref: reservation_genres.reservation_id > reservations.reservation_id
