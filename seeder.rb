
# Generate some TEST data.

require 'open-uri'
require 'json'
require 'awesome_print'

seed_json = %w(
  http://data.gov.au/geoserver/surf-coast-shire-garbage-collection/wfs?request=GetFeature&typeName=ckan_6d6feae0_46df_4b5a_8dc9_83969d6a2eec&outputFormat=json
  http://data.gov.au/geoserver/hrcc-garbage-collection/wfs?request=GetFeature&typeName=ckan_55364505_b0f4_4006_8544_95c9ed8d11ad&outputFormat=json
  http://data.gov.au/geoserver/wwsc-garbage-collection-zones/wfs?request=GetFeature&typeName=ckan_e77b6c07_39f2_454d_ae72_4976cab1dfb3&outputFormat=json
  http://data.gov.au/geoserver/hobsons-bay-garbage-collection/wfs?request=GetFeature&typeName=d369f648_d885_47f5_844c_782d8c1a2e56&outputFormat=json
)

def sql_header
  "INSERT INTO DATA(type, geometry, date, payload, source_uri)" \
  " values('test-bins', "
end

def create_insert_sql(area, crs, uri)
  geo = crs.merge(area["geometry"]).to_json
  payload = area["properties"].to_json
  sql =
    "#{sql_header} " \
    "ST_transform(ST_GeomFromGeoJSON( '#{geo}' ), 4326), \n" \
    "'now', \n" \
    "'#{payload}', \n" \
    "'#{uri}' );"
  sql + "\n\n"
end

file = File.open("seed_script.sql", "w")
seed_json.each do |json_uri|
  open(json_uri) do |f|
    f.each_line do |line|
      areas = JSON.parse(line)
      crs = {"crs" => areas["crs"]}
      areas["features"].each do |area|
        file.write create_insert_sql(area,crs,json_uri)
      end
    end
  end
end
file.close
