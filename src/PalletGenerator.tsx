import {} from './color.ts'
import { JSX, useState } from 'react'

function Slider(color: String): [number, JSX.Element] {
  const [val, setval] = useState<number>(0)
  return [
    val,
    <div className={`val-color-picker ${color}`}>
      <div className='light-sel'>
        {' '}
        <input
          type='range'
          max='1000'
          min='0'
          step='1'
          onChange={(e) => {
            setval(parseInt(e.target.value) / 1000)
          }}
        />
        <div />
        <div className='chroma-sel' />
        <div className='hue-sel' />
      </div>
    </div>,
  ]
}

function ColorGenerator() {
  const [l, Lslider] = Slider('bg-linear-to-r from-red-100 from-blue-500')
  const [c, Cslider] = Slider('')
  const [h, Hslider] = Slider('')

  return (
    <div>
      {l}, {c}, {h}
      {Lslider}
      {Cslider}
      {Hslider}
    </div>
  )
}

export default function PalleteGenerator() {
  return ColorGenerator()
}
