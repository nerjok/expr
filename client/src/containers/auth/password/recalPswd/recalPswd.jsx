import React, { useState } from 'react';
import i18next from 'i18next';


export const RecalPswd = props => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const updEmail = ({target}) => setEmail(target.value);

  const recallPswd = async () => {
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (emailReg.test(email)) {
     let ats = await props.forgotPswd(email, props.history);
     if (ats && ats.error) {
       setError(ats.error)
     }
    }
  }

  return (
      <div className="row">

        <div className="col-md-6">
          <h5 className="mb-0">{i18next.t('Forgot password')}</h5>
            <small>{i18next.t('Please fulfil field to continue')}</small>
                <br/>
        </div>

        <div className="col-md-6">
        
        <div>
          <label>{i18next.t('Email')}:</label>
          <input type="email" onChange={updEmail} className="form-control form-control-sm input__invalid" name="email"/>
        </div>
          <br/>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <button 
            type="button" 
            className={"btn btn-success full-width"} 
            onClick={recallPswd}
            id="recall-button"
          >
            {i18next.t("Submit")}
          </button>
        </div>

      </div>  
  )
}
