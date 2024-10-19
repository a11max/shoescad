"""
Routes and views for the flask application.
"""

from datetime import datetime
from shoescad import application
from flask import Flask, request, redirect, url_for, render_template, flash, send_file
import os
import numpy
import re
from stl import mesh

def secure_filename(filename):
    filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
    return filename

@application.route('/')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )

@application.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    additional_file = request.files.get('fileInput')

    if file and file.filename != '':
        file.save(os.path.join(application.config['UPLOAD_FOLDER'], file.filename))

    if additional_file and additional_file.filename != '':
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        original_filename = secure_filename(additional_file.filename)
        additional_file.filename = timestamp + '_' + original_filename 
        additional_file.save(os.path.join(application.config['UPLOAD_FOLDER'], additional_file.filename))
        
    dropdown1 = request.form.get('dropdown1')
    dropdown2 = request.form.get('dropdown2')
    size = request.form.get('field5')
    
    with open(os.path.join(application.config['TEXT_FOLDER'], 'form_data.txt'), 'a') as f:
        f.write(f"File_name: {additional_file.filename}\n")
        f.write(f"Dropdown 1: {dropdown1}\n")
        f.write(f"Dropdown 2: {dropdown2}\n")
        f.write(f"Size: {size}\n")
        f.write("-" * 20 + "\n")
    
    # Using an existing stl file:
    your_mesh = mesh.Mesh.from_file(f"{application.config['UPLOAD_FOLDER']}/{additional_file.filename}")
    
    # The mesh normals (calculated automatically)
    your_mesh.normals
    # The mesh vectors
    your_mesh.v0, your_mesh.v1, your_mesh.v2

    maxx = your_mesh.x.max()
    minx = your_mesh.x.min()

    miny = your_mesh.y.min()
    maxy = your_mesh.y.max()

    minz = your_mesh.z.min()
    maxz = your_mesh.z.max()

    n = int(dropdown1) - int(size)

    length_factor = float(20 / 3)
    width_facrot = 1.33
    height_factor = 2

    if n == 0:
        return redirect(url_for('home'))

    elif n > 0:
        
        scale_factor_x = (length_factor / (minx + maxx)) * n + 1
        scale_factor_y = ((abs(miny) + abs(maxy) + (width_facrot*n)) * 100 / (abs(miny) + abs(maxy))) / 100
        scale_factor_z = ((abs(minz) + abs(maxz) + (height_factor*n)) * 100 / (abs(minz) + abs(maxz))) / 100
    
    elif n < 0:
        
        n = abs(n)
        scale_factor_x = 1 - ((length_factor / (minx + maxx)) * n)
        scale_factor_y = ((abs(miny) + abs(maxy) - (width_facrot*n)) * 100 / (abs(miny) + abs(maxy))) / 100
        scale_factor_z = ((abs(minz) + abs(maxz) - (height_factor*n)) * 100 / (abs(minz) + abs(maxz))) / 100

    for i in range(len(your_mesh)):

        your_mesh.points[i][0:1] = your_mesh.points[i][0:1] * scale_factor_x
        your_mesh.points[i][3:4] = your_mesh.points[i][3:4] * scale_factor_x
        your_mesh.points[i][6:7] = your_mesh.points[i][6:7] * scale_factor_x

        your_mesh.points[i][1:2] = your_mesh.points[i][1:2] * scale_factor_y
        your_mesh.points[i][4:5] = your_mesh.points[i][4:5] * scale_factor_y
        your_mesh.points[i][7:8] = your_mesh.points[i][7:8] * scale_factor_y

        your_mesh.points[i][2:3] = your_mesh.points[i][2:3] * scale_factor_z
        your_mesh.points[i][5:6] = your_mesh.points[i][5:6] * scale_factor_z
        your_mesh.points[i][8:] = your_mesh.points[i][8:] * scale_factor_z

    your_mesh.save(f"{application.config['SAVE_GRADE_FOLDER']}/{additional_file.filename}")
    
    return redirect(url_for('download_page', filename=additional_file.filename))

@application.route('/download/<filename>', methods=['GET'])
def download_page(filename):
    return render_template('download.html', filename=filename)

@application.route('/download_file/<filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(application.config['SAVE_GRADE_FOLDER'], filename)
    if not os.path.exists(file_path):
        return "File not found", 404
    return send_file(file_path, as_attachment=True)
