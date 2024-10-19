"""
The flask application package.
"""

from flask import Flask, render_template
import os
from flask_cors import CORS

application = Flask(__name__)
CORS(application)

application.config['UPLOAD_FOLDER'] = os.path.abspath('uploads/')
application.config['TEXT_FOLDER'] = os.path.abspath('texts/')
application.config['SAVE_GRADE_FOLDER'] = os.path.abspath('save_grade/')

application.secret_key = 'your_secret_key'

if not os.path.exists(application.config['UPLOAD_FOLDER']):
    os.makedirs(application.config['UPLOAD_FOLDER'])
    
if not os.path.exists(application.config['TEXT_FOLDER']):
    os.makedirs(application.config['TEXT_FOLDER'])

if not os.path.exists(application.config['SAVE_GRADE_FOLDER']):
    os.makedirs(application.config['SAVE_GRADE_FOLDER'])

import shoescad.views