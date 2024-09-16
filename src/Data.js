import React from 'react';

const Data = ({data_key, data_value}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ marginRight: '10px' }}>{ data_key }</p>
        <input type="text" value={ data_value }></input>
    </div>
  );
}

export default Data;
