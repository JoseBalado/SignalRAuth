import React, { useEffect, useRef } from 'react';

const secondsColumn = seconds => {
    if (seconds.current.children.length < 10) {
        for (let i = 1; i <= 10; i++) {
            var second = document.createElement('span');
            var text = document.createTextNode(`${i * 10}s`)
            second.appendChild(text);
            seconds.current.appendChild(second);
        }
    }
}

const Seconds = () => {

    const seconds = useRef(null);

    useEffect(() => {
        secondsColumn(seconds);
    }, []);

    return (
        <div id='seconds' ref={seconds}></div>
    )
};

export default Seconds;