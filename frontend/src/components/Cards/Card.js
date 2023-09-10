import React, { useState } from 'react'

function Card ({ pokemon, Captured }) {
  const [isCaptured, setIsCaptured] = useState(Captured)
  const [loading, setLoading] = useState(false)

  const normalizedName = name => {
    const wordMapping = {
      x: 'x',
      y: 'y',
      '♀': 'f',
      '♂': 'm',
      '%': '',
      é: 'e'
    }

    const ignoreWords = ['size', 'forme', 'small', 'large', 'super']

    // Regular expression to match CamelCase and optional numbers followed by '%' (e.g. '50%') optionally followed by numbers (e.g. '50')
    const regex = /([a-z])([A-Z])|(\d+)%?|\d+/g

    // Replace CamelCase and numbers (with or without '%') with spaces
    name = name.replace(regex, (_, beforeUpper, afterLower, digits) => {
      if (beforeUpper && afterLower) {
        // Replace CamelCase with space
        return `${beforeUpper} ${afterLower}`
      } else if (digits) {
        // Replace numbers (with or without '%') with space
        return ` ${digits}`
      }
    })

    const transformedWords = []
    const words = name.toLowerCase().replace("'", '').split(' ')
    words.forEach(word => {
      if (transformedWords.includes(word) || ignoreWords.includes(word)) {
        // Skip duplicates like `<Alakazam>Mega <Alakazam>` or different unuseful words like `forme` etc
        return
      }
      const transformedWord = wordMapping[word] || word
      transformedWords.push(transformedWord)
    })

    const normalizedName = transformedWords.join('-')
    return normalizedName
  }

  const dubleClick = number => {
    fetch('/api/pokemon/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        number
      })
    })
      .then(response => response.json())
      .then(data => {
        setIsCaptured(true)
      })
  }

  const getProgresBarColord = (title, value) => {
    const allowedProrperties = [
      'attack',
      'defense',
      'hit_points',
      'special_attack',
      'special_defense',
      'speed'
    ]

    if (allowedProrperties.includes(title)) {
      return <ProgressBar title={title} value={value} />
    }
  }

  const pokemonName = normalizedName(pokemon.name)

  return (
    <div className='p-4 rounded'>
      <div
        className='card card-compact  bg-white border border-base-300 shadow-lg text-black'
        key={pokemon.name}
      >
        
        <figure className='h-[310px] bg-white'>
          {isCaptured && (
            <div className='absolute top-0 right-0'>
              <img src='images/logo.png' className='w-15 h-15' alt='logo' />
            </div>
          )}

          <img
            src={`https://img.pokemondb.net/artwork/large/${pokemonName}.jpg`}
            onError={e => {
              e.target.onerror = null
              e.target.src = 'https://via.placeholder.com/300'
            }}
            loading='lazy'
            onDoubleClick={() => dubleClick(pokemon.number)}
            alt={pokemonName}
          />
        </figure>
        <div className='card-body'>
          <h2 className='card-title '>{pokemon.name}</h2>
          <p>
            {Object.entries(pokemon).map(([key, value]) => {
              return <div key={key}>{getProgresBarColord(key, value)}</div>
            })}
          </p>

          <div className='flex flex-row'>
            <small className='mr-2 font-bold'>Types:</small>
            {pokemon.type_one && (
              <div className='badge badge-outline gap-2 capitalize mr-2'>
                {pokemon.type_one}
              </div>
            )}
            {pokemon.type_two && (
              <div className='badge badge-outline gap-2 capitalize mr-2'>
                {pokemon.type_two}
              </div>
            )}
          </div>

          <div className='flex flex-row'>
            <small className='mr-2 font-bold'>Generation:</small>
            {pokemon.generation && (
              <div className='badge badge-outline gap-2 capitalize mr-2'>
                {pokemon.generation}
              </div>
            )}
          </div>

          <div className='stats text-center'>
            <div className='stat bg-base-200'>
              <div className='stat-title'>Total Points</div>
              <div className='stat-value'>{pokemon.total}</div>

              {pokemon.legendary && (
                <div className='stat-desc text-green-500 text-bold text-md text-white'>
                  Legendary
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar ({ title, value }) {
  let barColor = ''

  if (value >= 1 && value <= 10) {
    barColor = 'bg-red-500' // Lowest values are red
  } else if (value > 10 && value <= 50) {
    barColor = 'bg-orange-500' // Medium values are orange
  } else if (value > 50 && value <= 90) {
    barColor = 'bg-yellow-500' // Higher values are yellow
  } else if (value > 90 && value <= 100) {
    barColor = 'bg-green-500' // Highest values are green
  } else if (value > 100) {
    barColor = 'bg-green-900' // Highest values are green
  }

  let width = value
  if (value > 100) {
    width = 100
  }

  title = title.replace('_', ' ')

  return (
    <div className='mb-4'>
      <div className='mb-1 capitalize'>{title}</div>
      <div className='w-full h-4 bg-gray-300 rounded'>
        <div
          className={`progress h-full rounded ${barColor}`}
          style={{ width: `${width}%` }}
        >
          <div className='text-md font-bold flex items-center justify-center h-full text-white capitalize'>
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
