import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Trans } from 'react-i18next';

export const Breadcrumb = ({links}) => {
  return (
    <div style={{position: 'relative', paddingBottom: '2rem'}} className="mb-3 mt-3">
      <div className="verticaly-center ">
        <div className="float-left">
          <Link to={"/"} className="breadcrumb-link index-page">
            <Trans>Home</Trans>
          </Link>
          {_.map(links, ({link, title}, index) => {
            return (
              <React.Fragment key={title + index}>
                {' '}&#187;{' '}
                <Link to={link} className="breadcrumb-link">{title}</Link>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

Breadcrumb.propTypes = {
  links: PropTypes.array.isRequired
}
