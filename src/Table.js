import React from 'react';
import './Table.css';

function Table({ countries }) {
    return (
        <div>
            <div className="table">
                {countries.map(country => (
                    <tr>
                        <td>{country.country}</td>
                        <td><strong>{country.cases}</strong></td>
                     </tr>   
                ))}
            </div>
        </div>
    )
}

export default Table
