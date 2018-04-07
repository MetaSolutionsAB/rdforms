require([
  'rdfjson/Graph',
  'rdforms/view/renderingContext',
  'rdforms/samples/ldsv/graphs/LeonardoDaVinci',
  'rdforms/samples/ldsv/graphs/ArtWorks',
  'jquery',
  'bootstrap/modal',
], (Graph, renderingContext, rdf, works, jquery) => {

  const getWorks = () => {
    const graph = new Graph(rdf);

    return graph
      .find(null, 'http://dbpedia.org/ontology/author', 'http://dbpedia.org/resource/Leonardo_da_Vinci')
      .map((stmt) => stmt.getSubject());
  }

  const getDBPediaIdFromURL = url => url.substring(url.lastIndexOf('/') + 1);

  const getDBPediaURLFromId = (id, type = 'resource') => {
    switch (type) {
      case 'json':
        return `http://dbpedia.org/data/${id}.json`;
    }
    return `http://dbpedia.org/${type}/${id}`;
  }

  const getResourceLabel = (graph, ruri, lang = 'en') => {
    const nameProperties = [
      'foaf:name',
      'dbo:birthName',
      'rdfs:label',
    ];

    let name; // return URI if no name found
    const nameProp = nameProperties.find((p) => {
      name = graph.findFirstValue(ruri, p);
      return name;
    });

    return name || ruri;
  }

  const WorksChooser = {
    show(binding, onSelect) {

      const cardTemplate = template`
        <div class="card" data-value="${'value'}">
            <img class="card-img-top" src="${'thumb'}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${'title'}</h5>
                <p class="card-text">${'desc'}</p>
            </div>
        </div>`;
      works.results.bindings.forEach(res => {
        const html = cardTemplate({
          value: res.art.value,
          thumb: res.thumb.value,
          name: res.name.value,
        });
        jquery('#myModal .wrapper')[0].append(html);
      })

      jquery('#myModal').modal('show');
      // when search icon is clicked.. you can bring up a dialog
      //onSelect({ value: 'http://example.com/3', label: { en: 'Example 3' } });
    },
    getChoice(item, value) {
      return {
        value,
        load(onSuccess) {
          const onError = () => {
            this.label = value;
            this.mismatch = true; // TODO replace with something else
            onSuccess();
          };
          const resourceId = getDBPediaIdFromURL(value);
          const resourceJson = getDBPediaURLFromId(resourceId, 'json');
          return fetch(resourceJson)
            .then((response) => {
              return response.json();
            }).then((jsonGraph) => {
              const graph = new Graph(jsonGraph, false);
              this.label = getResourceLabel(graph, getDBPediaURLFromId(resourceId));
            }).then(onSuccess, onError)
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    search(item, term) {
      return new Promise(resolve => resolve(getWorks().map(value => ({value, label: {en: getDBPediaIdFromURL(value)}}))));
    },
  };

  const KnowsChoooser = {
    show(binding, onSelect) {

      // when search icon is clicked.. you can bring up a dialog
      //onSelect({ value: 'http://example.com/3', label: { en: 'Example 3' } });
    },
    getChoice(item, value) {
      return {
        value,
        load(onSuccess) {
          const onError = () => {
            this.label = value;
            this.mismatch = true; // TODO replace with something else
            onSuccess();
          };
          const resourceId = getDBPediaIdFromURL(value);
          const resourceJson = getDBPediaURLFromId(resourceId, 'json');
          return fetch(resourceJson)
            .then((response) => {
              return response.json();
            }).then((jsonGraph) => {
              const graph = new Graph(jsonGraph, false);
              this.label = getResourceLabel(graph, getDBPediaURLFromId(resourceId));
            }).then(onSuccess, onError)
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    search(item, term) {
      console.log('lala');
      return new Promise(resolve => resolve(getWorks().map(value => ({value, label: {en: getDBPediaIdFromURL(value)}}))));
    },
  }

  renderingContext.chooserRegistry
    .itemtype('choice')
    .predicate('foaf:knows')
    .register(KnowsChoooser);

  renderingContext.chooserRegistry
    .itemtype('choice')
    .predicate('http://dbpedia.org/property/works')
    .register(WorksChooser);

  renderingContext.chooserRegistry
    .itemtype('choice')
    .predicate('foaf:made')
    .register(WorksChooser);
});
