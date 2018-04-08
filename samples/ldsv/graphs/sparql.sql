## works of art
select distinct ?art ?name ?auth ?thumb where {
  ?art a dbo:Artwork .
  ?art foaf:name ?name .
  ?art dbo:author ?auth .
  ?art dbo:thumbnail ?thumb .
  ?art dbp:year ?year .
  FILTER (?year > 1452 && ?year < 1512 )
} LIMIT 10000


## people in renaissance in Italy
select distinct ?person ?name where {
   ?person dct:subject ?renaissance .
   ?person a dbo:Person .
   ?person foaf:name ?name .
   FILTER (?renaissance IN (dbc:Italian_Renaissance_humanists, dbc:Italian_Renaissance_painters, dbc:Italian_Renaissance_writers, dbc:15th-century_Italian_painters))
} LIMIT 10000