
import React, { useEffect, useRef } from 'react';

const percentageColumn = percentage => {
    if (percentage.current.children.length < 10) {
        for (let i = 10; i >= 1; i--) {
            var value = document.createElement('span');
            var text_percentage = document.createTextNode(`${i * 10}`)
            value.appendChild(text_percentage);
            percentage.current.appendChild(value);
        }
    }
}

const Percentage = () => {

    const percentage = useRef(null);

    useEffect(() => {
        percentageColumn(percentage);
    }, []);

    return (
        <div id='percentage' ref={percentage}></div>
    )
};

export default Percentage