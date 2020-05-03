import React from 'react';
import './button.css';

const Button = (props) => (<div className="button-container">
<button {...props}>{props.text}</button>

</div>
)

export default Button;