drop table if exists towns CASCADE;
drop table if exists reg_numbers;

create table towns(
    id serial not null primary key,
    town_name text not null unique,
    town_code text unique
);

create table reg_numbers(
    id serial not null primary key,
    reg_number text not null unique,
    town_id int,
	foreign key (town_id) references towns(id)
);