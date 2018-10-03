drop table if exists waiters CASCADE;
drop table if exists waiter_shifts;

create table waiters(
    id serial not null primary key,
    waiter_name text not null unique
);

create table waiter_shifts(
    id serial not null primary key,
    waiter_id int,
    foreign key (waiter_id) references waiters(id),
    monday boolean not null default false,
    tuesday boolean not null default false,
    wednesday boolean not null default false,
    thursday boolean not null default false,
    friday boolean not null default false,
    saturday boolean not null default false,
    sunday boolean not null default false
);


