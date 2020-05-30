import React, { forwardRef } from 'react';
import './input.css';

const Input = (props, ref) => <input ref={ref} {...props} />;

export default forwardRef(Input);
