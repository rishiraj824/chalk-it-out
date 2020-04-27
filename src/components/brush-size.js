import React from 'react';
import './brush-size.css';

const sizes = ['0.5x', '1x', '2x']

export default ({ onSelection }) => <div className='sizes'>{sizes.map(size=><div key={size} onClick={onSelection.bind(this, size)} className={'size'}>{size}</div>)}</div>