# import pokemons_cache.py as cache
from pokemons_cache import PokemonsCache
from flask import session

class Pokemons:
    def __init__(self):
        self.cache = PokemonsCache()

    def get(self, **kwargs):
        self.cache.load_data()
        pokemons = self.cache.data
        types = self.cache.get_pokemon_types()
        captured_pokemons = session.get('captured_pokemons', [])

        if kwargs.get('name') and len(kwargs['name']) > 3:
            pokemons = self.cache.filter_pokemon_by_name(kwargs['name'])
            return {'pokemons': pokemons, 'total': len(pokemons), 'types': types}

        if kwargs.get('type'):
            pokemons = self.cache.filter_pokemon_by_type(kwargs['type'], pokemons)

        if any(key in self.cache.min_value_keys for key in kwargs):
            pokemons = self.cache.filter_pokemon_by_min_value(kwargs, pokemons)

        if kwargs.get('generation'):
            pokemons = self.cache.filter_generation(kwargs['generation'], pokemons)
        
        if kwargs.get('legendary'):
            pokemons = self.cache.filter_legendary(kwargs['legendary'], pokemons)

        if kwargs.get('sort_by') and kwargs.get('sort_order'):
            pokemons = self.cache.sort_pokemos(kwargs['sort_by'], kwargs['sort_order'], pokemons)

        offset = int(kwargs.get('offset', 0))
        limit = 12
        pokemons = self.cache.filter_pokemon_by_offset_and_limit(offset, limit, pokemons)

        return {'pokemons': pokemons, 'total': len(self.cache.data), 'types': types, 'captured_pokemons': captured_pokemons}
    
    def capture(self, **kwargs):
        pokemon_number = kwargs.get('number', None)
        if pokemon_number:
            session['captured_pokemons'] = session.get('captured_pokemons', [])
            session['captured_pokemons'].append(pokemon_number)
            session.modified = True
            return {'success': True}