#!/usr/bin/python

import web
import requests
import os
import sys


urls = [
  '/locations/.*', 'Proxy',
  '/(.*)', 'Static'
]


class Proxy(object):
    def GET(self):
        path = web.ctx.fullpath

        web.header('Content-Type', 'application/json')
        url = 'http://fallingfruit.org' + path
        r = requests.get(url)
        return r.text


class Static:
    def GET(self, path):
        types = {
            "png":"image/png",
            "jpg":"image/jpeg",
            "jpeg":"image/jpeg",
            "css":"text/css",
            "gif":"image/gif",
            "js":"text/javascript",
            "html":"text/html; charset=utf-8"
        }

        base_dir = os.getcwd()

        if path == '':
            path = 'index.html'

        if '?' in path:
            path = path.split('?')[0]

        folder = os.path.join(base_dir, os.path.dirname(path))
        fn = os.path.basename(path)
        full_path = os.path.join(folder, fn)

        ext = None
        if '.' in fn:
            ext = fn.split('.')[-1].lower()

        if '..' in path or ext not in types or fn not in os.listdir(folder):
            raise web.notfound(full_path)
        
        with open(full_path, 'rb') as fp:
            web.header("Content-Type", types[ext])
            return fp.read()

        
def run():
    web.config.debug = True

    # specify ip/port to listen on via command line arguments
    sys.argv = ['', '127.0.0.1:8080']

    app = web.application(urls, globals(), autoreload=True)
    app.run()


if __name__ == '__main__':
    run()
