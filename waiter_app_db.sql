drop table if exists waiters CASCADE;
drop table if exists shifts;

create table waiters(
    id serial not null primary key,
    waiter_name text not null unique
);

create table shifts(
    id serial not null primary key,
    monday boolean not null,
    tuesday boolean not null,
    wednesday boolean not null,
    thursday boolean not null,
    friday boolean not null,
    saturday boolean not null,
    sunday boolean not null,
    waiter_id int,
	foreign key (waiter_id) references waiters(id)
);
