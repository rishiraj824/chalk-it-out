import React from 'react';
const Input = (props) => (<div className="input-container">
    
    <input {...props} />
    <style jsx>
    {
        `
        .input-container {
            margin: 1rem;
        }
        input {
            font-family: "San Francisco";
            box-shadow: none;
            width: 80%;
            color: #353535;
            background-color: transparent;
            border: 1px solid #6275d0;
            border-radius: 0.4rem;
            outline: 0;    
            padding: 0.6rem 0.8rem;
        }
        `
    }
    </style>
    </div>
)

export default Input;