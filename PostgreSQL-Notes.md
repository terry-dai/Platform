Notes on what we have done on PostgreSQL in case we need to re-create it:

```
CREATE EXTENSION postgis;

create table data(
  id serial primary key,
  type varchar(255),
  geometry geometry,
  date timestamp with time zone,
  payload jsonb);

INSERT INTO data(type, geometry, date, payload)
values (
   'test',
   ST_GeomFromGeoJSON(
   '{"type":"MultiPolygon",
         "coordinates":[[[[607123.43036143,5935441.89561979],[607123.37808827,5935309.3081312],[606957.58917645,5935315.37656502],[606968.4856831,5935443.94506618],[607123.43036143,5935441.89561979]]]]
         }'),
   'now',
    '{"type":"Feature",
     "id":"ckan_5d904cc1_b419_4bef_8777_94da6cb69e4b.1",
     "geometry":
       {"type":"MultiPolygon",
         "coordinates":[[[[607123.43036143,5935441.89561979],[607123.37808827,5935309.3081312],[606957.58917645,5935315.37656502],[606968.4856831,5935443.94506618],[607123.43036143,5935441.89561979]]]]
       },
       "geometry_name":"geom",
         "properties":
           {"id":0,
             "status":"no",
             "name":"Botanical Gardens",
             "regulation":"Horsham Rural City Council",
             "comment":null,
             "off_rules":null,
             "on_rules":null,
             "no_rules":null,
             "url":null,
             "ref":null}
   }'
);
```

