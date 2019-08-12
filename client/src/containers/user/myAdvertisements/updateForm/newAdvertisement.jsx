import React from 'react'
import _ from 'lodash'
import { reduxForm, Field } from 'redux-form';
import FIELDS from './formFields'
import { AdvertisementField } from './advertisementField'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';


import { updateAdvertisement, newAdvertisement, removeAdvertisement } from '../../../../store/actions'
import { MapInput } from './mapInput'
import Card from '../../../../hoc/cardBorders';
import { DateTimePicker } from './dateTimePicker';


class NewAdvertisement extends React.Component {

  submitForm = (values) => {
    const { formValues } = this.props
    if (formValues.values) {
      const advertisement = formValues.values//, ...this.state}
      this.props.newAdvertisement(advertisement, this.props.history);
    }
  }


  render() {
    return (
      <Card showCard={this.props.advertisement && this.props.advertisement._id}>
      <form 
        onSubmit={this.props.handleSubmit(this.submitForm) }

        >
        {_.map(FIELDS, ({label, name}) => {
          let fieldComp;
          if (name === 'dateTime')
            fieldComp = DateTimePicker;
          else if (name === 'location')
           fieldComp = MapInput;
          else 
            fieldComp = AdvertisementField;   
          return (
              <Field
                  key={name}
                  type="text"
                  name={name}
                  component={fieldComp}
                  label={label}
              />
          )
        })}

        <br/>
        <br/>
        <button type="submit" className="btn btn-outline-dark">Submit</button>
      </form>
      </Card>
  )
      }
}

const validate = (values) => {
  const errors= {};
  
  _.each(FIELDS, ({name})=>{
    if (!values[name] || (values[name].length < 20 && name !== 'location'))
      errors[name] = "You must provide data!";
  })

  return errors
}

function mapStateToProps(state) {
  return {
      formValues: state.form.advertisementUpdate
  };
}


export default withRouter(reduxForm({
  validate,
  form: 'advertisementUpdate',
  initialValues: {}
})(connect(mapStateToProps, {updateAdvertisement, newAdvertisement, removeAdvertisement})(NewAdvertisement)));
