import React from 'react'


export const AdvertisementField = ({label, name, input, defaultValue, meta: {error, touched}}) => {
  return (
    <div className="form-group">
      <label htmlFor="email">{label}:</label>
      <input name={name} {...input} defaultValue={defaultValue} type="text" className="form-control" id="email"/>
      <div className="text-danger" style={{marginBottom:'20px'}}>
        {touched && error}
      </div>
    </div>
  )
}
