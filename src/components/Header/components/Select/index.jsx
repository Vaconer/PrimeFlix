import React from "react";
import { Link } from 'react-router-dom'

export function Select({ options, onChangeOption }) {
    return (
        options.map(option => <Link to="/" onClick={() => onChangeOption(option.id)}>{option.name}</Link>)
    )
} 