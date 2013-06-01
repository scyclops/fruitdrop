
// assumption is that items w/ description containing one of these words
// will use the icon with the image named with that word
//
// eg. Apple Tree has will match apple so will use images/apple.png
var icons = [
      'apple',
      'avocado',
      'cherry',
      'fig',
      'grape',
      'lemon',
      'mushroom',
      'nut',
      'olive',
      'orange',
      'peach',
      'pear',
      'pine',
      'plum',
      'raspberry',
      'strawberry',
      'tree',
      'walnut',
      'palm'
    ],
    default_icon = 'images/red_dot.png';

function getIcon(s) {
    if (!s) {
        return default_icon;
    }
    if (s.indexOf('@') !== -1) {
        s = s.split('@')[0];
    }
    s = s.toLowerCase();

    for (var i = 0, ilen = icons.length; i < ilen; ++i) {
        if (s.indexOf(icons[i]) !== -1) {
            return 'images/' + icons[i] + '.png?v=2';
        }
    }

    if (/((black|honey) ?locust|linden|maple|oak|mulberry|hackberry|hawthorn)/.test(s)) {
        return 'images/tree.png';
    }

    // no matching image found
    return default_icon;
}

