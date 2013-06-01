#!/usr/bin/python

import csv
import sys
import json


def run(fn, outfn):
    ints = ['id', 'yield_rating', 'quality_rating', 'access', 'season_start']
    floats = ['lat', 'lng']
    bools = ['unverified']

    data = []

    with open(outfn, 'w') as out:
        out.write("data = [\n")

        i = 0

        with open(fn, 'r') as fp:
            reader = csv.DictReader(fp)

            for row in reader:
                for k, v in row.iteritems():
                    if not v.strip():
                        # assume empty strings represent null/no data
                        v = None
                    elif k in ints:
                        row[k] = int(v)
                    elif k in floats:
                        row[k] = float(v)
                    elif k in bools:
                        assert v in ['f', 't']
                        row[k] = (v == 't')

                out.write(json.dumps(row) + ",\n")

                i += 1

                if i % 10000 == 0:
                    print i

        out.write("]")

    print 'fin'


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print 'Usage: ' + __file__ + ' /path/to/data.csv /path/to/output/json_data.js'
        sys.exit(0)

    run(sys.argv[1], sys.argv[2])


