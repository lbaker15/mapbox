import React, { useEffect, useState } from "react";

const Zoom = React.forwardRef(({ }, ref) => {
    const [value, setValue] = useState(7)
    const handleChange = (e) => {
        setValue(e.target.value)
    }
    useEffect(() => {
        if (ref.current) {
            ref.current.setZoom(value)
        }
    }, [value])
    useEffect(() => {
        if (ref.current) {
            ref.current.on('zoomend', function (e) {
                setValue(ref.current.getZoom())
            });
        }
    }, [ref.current])
    return (
        <div className="zoom">
            <input
                onChange={handleChange} value={value}
                min="7" max="20" step="0.01" type="range" />
        </div>
    )
})

export default Zoom;