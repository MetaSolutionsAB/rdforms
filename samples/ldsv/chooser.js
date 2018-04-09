require([
  'rdfjson/Graph',
  'rdforms/view/renderingContext',
  'rdforms/samples/ldsv/graphs/LeonardoDaVinci',
  'rdforms/samples/ldsv/graphs/ArtWork',
  'rdforms/samples/ldsv/graphs/PeopleRenaissance',
  'jquery',
  'bootstrap/modal',
], (Graph, renderingContext, rdf, works, people, jquery) => {

  const getWorks = () => works.results.bindings.map(bind => ({
    value: bind.art.value,
    label: bind.name.value,
  }));

  const getPeople = () => people.results.bindings.map(bind => ({
    value: bind.person.value,
    label: bind.name.value,
  }));

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
      works.results.bindings.forEach(res => {
        const html = `<div class="card" data-value="${res.art.value}">
            <img class="card-img-top" src="${res.thumb.value}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${res.name.value}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${getDBPediaIdFromURL(res.auth.value)}</h6>
                <p class="card-text"></p>
                <a href="#" class="btn btn-default btn-block select-work"          
                    data-label="${res.name.value}" data-ruri="${res.art.value}">Select</a>
            </div>
        </div>`;
        jquery('#artWorks .wrapper').append(html);
      });

      jquery('.select-work').click((e) => {
        onSelect({
          value: jquery(e.target).data('ruri'),
          label: { en: jquery(e.target).data('label') }
        });
        jquery('.select-work').off();
        jquery('#artWorks').modal('hide');
      });
      jquery('#artWorks').modal('show');
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
      return new Promise(resolve => resolve(getWorks()));
    },
  };

  const KnowsChoooser = {
    show(binding, onSelect) {
    },
    getChoice(item, value) {
      const { label } = getPeople().find(p => p.value === value);
      return { value, label };
    },
    search(item, term) {
      return new Promise(resolve => resolve(getPeople()));
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
