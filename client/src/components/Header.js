import React, { Component} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import Payments from './Payments'
//import { link } from 'fs';

import {Dropdown, DropdownButton} from 'react-bootstrap';

class Header extends Component {

    renderContent() {
    const { auth } = this.props
    const email = (auth.email ||auth.name) || false

		switch(email) {
            case null:
                return;
            case false:
                return (
                    <React.Fragment>
                      <a key="googleLogin" href="auth/google" className="p-2 text-dark">Login with Google</a>
                      <a key="login" href="login" className="p-2 text-dark">Login with username</a>
                    </React.Fragment>
                );
            default:
                return ([
                    <Payments key="payments"/>,
										<React.Fragment key="credits">Credits: {this.props.auth.credits}</React.Fragment>,
										<Link 
										  key="surveys"
										  to={this.props.auth ? "/surveys" : "/"} 
										  className="p-2 text-dark">
										  Surveys
										</Link>,
											<DropdownButton key="user-profiles" id="dropdown-basic-button" bsPrefix="btn btn-sm btn-info inline" title="Profiles">
												<Dropdown.Item>
													<Link 
														key="surveys"
														to={this.props.auth ? "/profile" : "/"} 
														className="p-2 text-dark">
														Profile
													</Link>
												</Dropdown.Item>
                        <Dropdown.Item>
													<Link 
														key="surveys"
														to={this.props.auth ? "/profiles" : "/"} 
														className="p-2 text-dark">
														Profiles
													</Link>
												</Dropdown.Item>
												<Dropdown.Item href="/surveys">
												<Link 
														key="surveys"
														to={this.props.auth ? "/surveys" : "/"} 
														className="p-2 text-dark">
														Surveys
													</Link>
												</Dropdown.Item>
                        <Dropdown.Item href="/advertisements">
												<Link 
														key="advertisements"
														to={this.props.auth ? "/advertisements" : "/"} 
														className="p-2 text-dark">
														Advertisements
													</Link>
												</Dropdown.Item>
												<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
											</DropdownButton>,
                    <a key="logout" href="/api/logout" className="p-2 text-dark">Log out</a>
                ]
                );
        }
    }

    render() {
        return (
            <div className="navbar navbar-expand-sm bg-light stickie-nav">
            <h5 className="my-0 mr-md-auto font-weight-normal">
             <Link 
                to="/"
                className="brand-logo">
                Tempus
              </Link>
            </h5>
            <nav className="my-2 my-md-0 mr-md-3">
              {this.renderContent()}
            </nav>
          </div>
        )
    }
}

function mapStateToProps({auth}) {
    return {
        auth
    }
}

export default connect(mapStateToProps, null)(Header)