drop table waiter_shifts;

create table waiter_shifts(
    id serial not null primary key,
    waiter_name text not null,
    monday text not null default false,
    tuesday text not null default false,
    wednesday text not null default false,
    thursday text not null default false,
    friday text not null default false,
    saturday text not null default false,
    sunday text not null default false
);



