from flask import Flask, jsonify, request
from pokemons import Pokemons

app = Flask(__name__)
app.secret_key = 'secret_key_for_demo_purposes_only'
pokemons_instance = Pokemons() # This is the singleton instance, it will be created only once per hour

@app.after_request
def add_header(response):
    response.cache_control.max_age = 10800 # 3 hours - should be respected by the CDN and the browser.
    return response

@app.route('/api/pokemons', methods=['GET'])
def pokemons():
    pokemons_result = pokemons_instance.get(**request.args)
    return jsonify(pokemons_result)

@app.route('/api/pokemon/capture', methods=['POST'])
def capture():
    capture = pokemons_instance.capture(**request.json)
    return jsonify(capture)

if __name__=='__main__':
    app.run(port=8080)