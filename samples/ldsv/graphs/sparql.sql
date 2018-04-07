select distinct ?art ?name ?auth ?thumb where {
  ?art a dbo:Artwork .
  ?art foaf:name ?name .
  ?art dbo:author ?auth .
  ?art dbo:thumbnail ?thumb .
  ?art dbp:year ?year .
  FILTER (?year > 1452 && ?year < 1512 )
} LIMIT 10000