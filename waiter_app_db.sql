drop table if exists waiters CASCADE;
drop table if exists shifts;
drop table if exists waiter_shifts;

create table waiters (
    id serial not null primary key,
    waiter_name text not null
);

create table shifts(
    id serial not null primary key,
    shift text not null unique
);

INSERT INTO shifts(shift) VALUES('monday');
INSERT INTO shifts(shift) VALUES('tuesday');
INSERT INTO shifts(shift) VALUES('wednesday');
INSERT INTO shifts(shift) VALUES('thursday');
INSERT INTO shifts(shift) VALUES('friday');
INSERT INTO shifts(shift) VALUES('saturday');
INSERT INTO shifts(shift) VALUES('sunday');

create table waiter_shifts(
    id serial not null primary key,
    waiter_id int,
    shift_id int,
    foreign key (waiter_id) references waiters(id),
    foreign key (shift_id) references shifts(id)
);


