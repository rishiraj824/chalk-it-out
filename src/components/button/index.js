import React from 'react';
import './button.css';

const Button = ({ disabled, text, ...props }) => (<div className="button-container">
{disabled ? <button disabled {...props}>{text}</button>: <button {...props}>{text}</button>}
</div>
)

export default Button;