import os
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, send

template_dir = os.getcwd()
template_dir = os.path.join(template_dir, 'templates')

app = Flask(__name__, template_folder=template_dir)
#app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route("/")
def index():
    print(template_dir)
    return render_template('index.html')

@socketio.on('client_connect')
def handle_my_custom_event(json):
    print('received json: ' + str(json))

@socketio.on('load_map')
def load_map(json):
    #print('received json: ' + str(json))
    map = json.get("loaded_map")
    print(map)
    socketio.emit('backend_response', 'Backend has received map')

@socketio.on('start_exploration')
def start_exploration(json):
    print('received json: ' + str(json))

@socketio.on('start_fastest_path')
def start_fastest_path(json):
    print('received json: ' + str(json))

if __name__ == "__main__":
    socketio.run(app)