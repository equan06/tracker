import React from 'react';
import './Metrics.css';

export default function Metrics({data}) {
    return (
        <div>
            <MetricSection name="Activities" value={data != null ? data.length : 0}></MetricSection>
            <MetricSection name="Miles" value={data != null ? data.map(x => x.miles).reduce((prev, curr) => prev + parseFloat(curr), 0) : 0}></MetricSection>
        </div>
    );
}

function MetricSection({name, value}) {
    return (
        <>
            <div className="metric-label">{name}</div>
            <div className="metric-value">{value}</div>
        </>
    );
}