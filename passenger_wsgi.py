import sys

import os

INTERP = os.path.expanduser("/var/www/u2758391/data/flaskenv/bin/python")
if sys.executable != INTERP:
   os.execl(INTERP, INTERP, *sys.argv)

sys.path.append(os.getcwd())

from shoescad import application
