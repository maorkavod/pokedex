import React, { useState, useEffect } from 'react'
import Card from './Card'
import {
  FiltersIcon,
  ResetFiltersIcon,
  SortIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InfoIcon
} from '../../Utils/Svg'

function Cards () {
  const [pokemons, setPokemons] = useState([])
  const [pokemonsCount, setPokemonsCount] = useState(null)
  const [offset, setOffset] = useState(0)
  const [totalPokemons, setTotalPokemons] = useState(1)
  const [types, setTypes] = useState([])
  const [filtersModal, setFiltersModal] = useState(false)
  const [capturedPokemons, setCapturedPokemons] = useState([])

  const limit = 12
  const initialRanges = {
    attack: 0,
    defense: 0,
    hit_points: 0,
    special_attack: 0,
    special_defense: 0
  }

  const initialFilters = {
    attack: 0,
    defense: 0,
    hit_points: 0,
    special_attack: 0,
    special_defense: 0,
    generation: '',
    legendary: '',
    type: '',
    name: ''
  }

  const [ranges, setRanges] = useState(initialRanges)
  const [filters, setFilters] = useState(initialFilters)
  const [sort, setSort] = useState({
    by: 'number',
    order: 'asc'
  })

  useEffect(() => {
    fetchPokemons()
  }, [offset, filters, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      pokemons.length < totalPokemons
    ) {
      setOffset(prevOffset => prevOffset + limit)
    }
  }

  const fetchPokemons = () => {
    if (offset >= totalPokemons) {
      return
    }

    let queryString = {
      offset: offset,
      attack: filters.attack,
      defense: filters.defense,
      hit_points: filters.hit_points,
      generation: filters.generation,
      legendary: filters.legendary,
      type: filters.type,
      special_attack: filters.special_attack,
      special_defense: filters.special_defense,
      name: filters.name,
      sort_by: sort.by,
      sort_order: sort.order
    }

    // Remove empty values to keep the query string clean
    Object.keys(queryString).forEach(key => {
      if (queryString[key] === '' || parseInt(queryString[key]) === 0) {
        delete queryString[key]
      }
    })

    queryString = new URLSearchParams(queryString).toString()

    fetch(`api/pokemons?${queryString}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        setTotalPokemons(data.total)
        setPokemons(prevPokemons => [...prevPokemons, ...data.pokemons])
        setTypes(data.types)
        setPokemonsCount(data.pokemons.length)
        setCapturedPokemons(data.captured_pokemons)
      })
      .catch(() => {
        console.error('Error fetching data')
      })
      .finally(() => {})
  }

  const handleFiltersSearch = event => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)

    setOffset(0)
    setPokemons([])
    setFilters(filters)
    setFiltersModal(false)
  }

  const handleRangeChange = name => event => {
    setRanges({ ...ranges, [name]: event.target.value })
  }

  const toogleFiltersModal = () => {
    setFiltersModal(!filtersModal)
  }

  const handleSortChange = event => {
    setSort(prevSort => ({ ...prevSort, by: event.target.value }))
    setOffset(0)
    setPokemons([])
  }

  const handleSortOrder = () => {
    setSort(prevSort => ({
      ...prevSort,
      order: prevSort.order === 'asc' ? 'desc' : 'asc'
    }))
    setOffset(0)
    setPokemons([])
  }

  const resetFilters = () => {
    setPokemons([])
    setFilters(initialFilters)
    setRanges(initialRanges)
    setSort(prevSort => ({ ...prevSort, by: 'number', order: 'asc' }))
    setOffset(0)
  }

  return (
    <div className='container mx-auto mt-[120px] px-4 '>
      <div className='flex flex-wrap gap-2'>
        <label className='btn' htmlFor='filtersModal'>
          <FiltersIcon />
          Filters
        </label>

        <div className='flex flex-row gap-2'>
          <select
            className='select select-bordered join-item'
            onChange={handleSortChange}
            value={sort.by}
          >
            <option selected value='number'> Number </option>
            <option value='total'>Total</option>
            {Object.keys(filters).map((key, index) => {
              return (
                <option key={index} value={key} className='capitalize'>
                  {key.replace('_', ' ')}
                </option>
              )
            })}
          </select>
          <div className='indicator'>
            <button className='btn join-item' onClick={handleSortOrder}>
              <SortIcon />
              {sort.order === 'asc' && <ArrowDownIcon />}

              {sort.order === 'desc' && <ArrowUpIcon />}
            </button>
          </div>
        </div>

        <div className='ml-auto'>
          <button className='btn' onClick={resetFilters}>
            <ResetFiltersIcon />
            Reset Filters
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 content'>
        {pokemons.map((pokemon, index) => {
          return <Card pokemon={pokemon} key={index} Captured={capturedPokemons.includes(pokemon.number)} />
        })}
      </div>

      {pokemonsCount === 0 && (
        <div className='flex justify-center items-center p-6'>
          <div className='alert'>
            <InfoIcon />
            <span>
              {offset === 0 &&
                'No pokemons found. Try changing the filters or search term.'}
              {offset !== 0 && 'No more pokemons found.'}
            </span>
          </div>
        </div>
      )}

      {pokemonsCount !== undefined && pokemonsCount !== 0 && (
        <div className='flex justify-center items-center'>
          <span className='loading loading-ring loading-lg w-16 h-16'></span>
        </div>
      )}

      <input
        type='checkbox'
        id='filtersModal'
        className='modal-toggle'
        checked={filtersModal}
        onChange={toogleFiltersModal}
      />
      <div className='modal'>
        <div className='modal-box'>
          <form
            onSubmit={handleFiltersSearch}
            className='flex flex-wrap'
            method='dialog'
          >
            <div className='w-full'>
              <label className='block text-gray-600'>Min Attack</label>

              <input
                type='range'
                min='0'
                max='300'
                className='range'
                name='attack'
                value={ranges.attack}
                onChange={handleRangeChange('attack')}
              />
              <label className='label'>
                <span className='label-text-alt'> {ranges.attack} </span>
              </label>
            </div>

            <div className='w-full'>
              <label className='block text-gray-600'>Min Defense</label>

              <input
                type='range'
                min='0'
                max='300'
                className='range'
                name='defense'
                value={ranges.defense}
                onChange={handleRangeChange('defense')}
              />
              <label className='label'>
                <span className='label-text-alt'>{ranges.defense}</span>
              </label>
            </div>

            <div className='w-full'>
              <label className='block text-gray-600'>Min Hit Points</label>

              <input
                type='range'
                min='0'
                max='300'
                className='range'
                name='hit_points'
                value={ranges.hit_points}
                onChange={handleRangeChange('hit_points')}
              />
              <label className='label'>
                <span className='label-text-alt'>{ranges.hit_points}</span>
              </label>
            </div>

            <div className='w-full'>
              <label className='block text-gray-600'>Min Special Attack</label>

              <input
                type='range'
                min='0'
                max='300'
                className='range'
                name='special_attack'
                value={ranges.special_attack}
                onChange={handleRangeChange('special_attack')}
              />

              <label className='label'>
                <span className='label-text-alt'>{ranges.special_attack}</span>
              </label>
            </div>

            <div className='w-full'>
              <label className='block text-gray-600'>Min Special Defense</label>

              <input
                type='range'
                min='0'
                max='300'
                className='range'
                name='special_defense'
                value={ranges.special_defense}
                onChange={handleRangeChange('special_defense')}
              />

              <label className='label'>
                <span className='label-text-alt'>{ranges.special_defense}</span>
              </label>
            </div>

            <div className='w-full'>
              <label className='block text-gray-600'>Generation</label>

              <select
                className='select select-bordered w-full max-w-xs'
                name='generation'
              >
                <option value={''}>All</option>
                {[...Array(10)].map((_, index) => {
                  return (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className='w-full'>
              <label className='block text-gray-600'>Legendary</label>
              <select
                className='select select-bordered w-full max-w-xs'
                name='legendary'
              >
                <option value={''}>Both</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>

            <div className='w-full'>
              <label className='block text-gray-600'>Types</label>

              <select
                className='select select-bordered w-full max-w-xs'
                name='type'
              >
                <option value={''}>All</option>
                {types.map((type, index) => {
                  return (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className='w-full'>
              <label className='block text-gray-600'>Name</label>
              <input
                type='text'
                className='input input-bordered'
                name='name'
                minLength='3'
                maxLength='20'
              />
            </div>

            <div className='w-full mt-6'>
              <button className='btn btn-primary w-full' type='submit'>
                Search
              </button>
            </div>
          </form>
        </div>
        <label className='modal-backdrop' htmlFor='filtersModal'>
          Close
        </label>
      </div>
    </div>
  )
}

export default Cards
