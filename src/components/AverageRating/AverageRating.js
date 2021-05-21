import React from 'react';

import './AverageRating.css';

function AverageRating({ value }) {
    let colorClass = '';
    if(value <= 3) colorClass = "very-low";
    else if(value <= 5) colorClass = "low";
    else if(value <= 7) colorClass = "medium";
    else colorClass = "high";
    return (<React.Fragment>
        {!(value === undefined || value === null) && <div className={`average-rating ${colorClass}`}>{value}</div>}
    </React.Fragment>);
}

export default AverageRating;
