import db
import time

# This is a singleton class, it will be created only once per hour  (for this demo purpose)
# In production, a better approach would be to use a cache like Redis or Memcached to avoid the overhead the database
class PokemonsCache:
    CACHE_DURATION = 3600  # 1 hour

    def __init__(self):
        self.data = None
        self.last_created_time = None
        self.min_value_keys = ['attack', 'defense', 'hit_points', 'special_attack', 'special_defense', 'speed', 'total']

    def load_data(self):
        current_time = time.time()
        if self.data is None or (current_time - self.last_created_time) >= self.CACHE_DURATION:
            self.data = db.get()
            self.last_created_time = current_time

    def get_pokemon_types(self):
        types = set()
        for pokemon in self.data:
            types.add(pokemon['type_one'])
            if pokemon['type_two']:
                types.add(pokemon['type_two'])
        return list(types)

    def filter_pokemon_by_name(self, name):
        return [pokemon for pokemon in self.data if name.lower() in pokemon['name'].lower()]

    def filter_pokemon_by_type(self, pokemon_type, pokemons):
        return [pokemon for pokemon in pokemons if pokemon_type == pokemon['type_one'] or pokemon_type == pokemon['type_two']]

    def filter_pokemon_by_offset_and_limit(self, offset, limit, pokemons):
        return pokemons[offset:offset + limit]
    
    def filter_generation(self, generation, pokemons):
        return [pokemon for pokemon in pokemons if pokemon['generation'] == int(generation)]
    
    def filter_legendary(self, legendary, pokemons):
        legendary = False if legendary.lower() == 'false' else bool(legendary)
        return [pokemon for pokemon in pokemons if bool(pokemon['legendary']) == legendary]
    
    def filter_pokemon_by_min_value(self, kwargs, pokemons):
        min_value_filters = {key: value for key, value in kwargs.items() if key in self.min_value_keys}
        
        if not min_value_filters:
            return pokemons

        filtered_pokemons = []
        for pokemon in pokemons:
            is_valid = True
            for key, value in min_value_filters.items():
                if pokemon.get(key, 0) < int(value):
                    is_valid = False
                    break
            if is_valid:
                filtered_pokemons.append(pokemon)
        
        return filtered_pokemons
    
    def sort_pokemos(self, sort_by, sort_order, pokemons):
        if sort_by and sort_order:
            if sort_by == 'type':
                pokemons = sorted(pokemons, key=lambda pokemon: pokemon['type_one'], reverse=sort_order.lower() == 'desc')
                pokemons = sorted(pokemons, key=lambda pokemon: pokemon['type_two'], reverse=sort_order.lower() == 'desc')
            else:
                pokemons = sorted(pokemons, key=lambda pokemon: pokemon[sort_by], reverse=sort_order.lower() == 'desc')
        return pokemons