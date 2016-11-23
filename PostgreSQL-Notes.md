Notes on what we have done on PostgreSQL in case we need to re-create it:

CREATE EXTENSION postgis;

create table data(id serial primary key, type varchar(255), geometry geometry, date timestamp with time zone, payload text);

INSERT INTO data(type, geometry, date, payload)
values ('test', 'POLYGON((607123.43036143 5935441.89561979, 607123.37808827 5935309.3081312, 606957.58917645 5935315.37656502, 606968.4856831 5935443.94506618, 607123.43036143 5935441.89561979
))', 'now', 'the payload');


