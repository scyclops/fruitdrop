
var api_url = (native_app ? 'http://fallingfruit.org' : 'http://localhost:8080');


function _get(path, args, dataType) {
    var dfd = D();

    $.ajax({
      type: 'GET',
      url: api_url + path,
      data: args,
      dataType: dataType || 'json',
      success: dfd.resolve,
      error: dfd.reject
    });

    return dfd.promise;
}

function get_markers(nelat, nelng, swlat, swlng, muni) {
    var args = {
        muni: muni ? 1 : 0,
        nelat: nelat,
        nelng: nelng,
        swlat: swlat,
        swlng: swlng
    };
    return _get('/locations/markers.json', args);
}

function get_clusters(nelat, nelng, swlat, swlng, zoom, muni) {
    var args = {
        method: 'grid',
        muni: muni ? 1 : 0,
        grid: zoom,
        nelat: nelat,
        nelng: nelng,
        swlat: swlat,
        swlng: swlng
    };
    return _get('/locations/cluster.json', args);
}

function get_info(loc_id) {
    var dfd = D();

    /*
    returns {
      location_id: 123,
      description: 'abc def xyz ...',
      author: 'joe',
      types: [
        title: 'Plum',
        wiki_url: 'http://..',
        usda_url: 'http://..'
      ]
    }
    */

    _get('/locations/' + loc_id + '/infobox', {}, 'html').then(function(html){
        var tree = $(html),
            info = {types:[],
                    location_id: loc_id,
                    description: $('#description p', tree).text().trim(),
                    author: $('#added_by i', tree).text().trim()};

        $('#type_list li', tree).each(function(){
            var atype = {title: $(this).text().trim()};

            $('a', this).each(function(){
                if (/wikipedia\.org/.test(this.href)) {
                    atype.wiki_url = this.href;
                } else if (/usda\.gov/.test(this.href)) {
                    atype.usda_url = this.href;
                }
            });

            info.types.push(atype);
        });
        dfd.resolve(info);
    }, dfd.reject);

    return dfd.promise;
}