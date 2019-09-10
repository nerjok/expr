/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react'
import { fetchAdvertisements, deleteAdvertisement, filterAdvertisements } from '../../store/actions'
import { connect } from 'react-redux'
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Advertisements as AdvertisementsList } from '../../components/advertisements/Advertisements';

import Search from '../../components/search';
import Breadcrumb from '../../components/breadcrumb';

import FilterCard from '../../components/filtercard';

export class Advertisements extends React.Component {

  constructor(props) {
    super(props)
  
    const url = new URL(window.location.href);
    let page = url.searchParams.get("page")
    page = isNaN(page) ? 0 : parseInt(page)
    this.state = {
      page,
      activeAdvertisement: {},
      status: [],
      workType: [],
    }
    this.displayAdvertisementPopup = this.displayAdvertisementPopup.bind(this);
    this.searchAdvertisements = this.searchAdvertisements.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }
  
  componentDidMount() {
    this.props.fetchAdvertisements(this.state.page)
  }

  currentUrlPath = () => {
    if (this.props.history.location.pathname === '/')
      return '/advertisements'
    return this.props.history.location.pathname
  }

  displayAdvertisementPopup({target}) {
    const activeAdvertisement = this.props.advertisements.find(itm => itm._id === target.getAttribute('id')); 
    this.setState({activeAdvertisement})
  }

  searchAdvertisements(location, distance, keyword) {
    this.props.filterAdvertisements(this.state.page, location, distance, keyword, this.state.status, this.state.workType)
    console.log('[[filterAdvertisements]]', location, distance, keyword, this.props.filterAdvertisements);
  }

  changeStatus({target}) {
    console.log('changeTime', target)
    const {value, checked } = target;
    const name = target.getAttribute('name');

    var status  = this.state[name].slice()
    console.log('statusState', name,  status, typeof status)


      if (!checked) {
        status = status.filter(itm => itm != value);
      } else {
        status.push(value);
      }
      this.setState({[name]: status})
  }

  render() {
    if (!this.props.advertisements)
      return <div class="spinner-border mt-5"></div>  
    return (
      <>
        {this.props.from !== 'index' ? <Breadcrumb links={[{link:'/advertisements', title: "Advertisements"}]}/> : null }
        <Link to={"/user/advertisements/new"} className="btn btn-sm btn-outline-success m-3 mr-0 float-right">New Advertisement</Link>

        <div className="clearfix"></div>
        {this.props.from !== 'index' ? <Search filterAdvertisements={this.searchAdvertisements}/> : null}
        <div className="row advertisements-row--mobile">
        <div className="col-md-9"> 
        
        <div className="advertisements">
          <AdvertisementsList 
            advertisements={this.props.advertisements} 
            location={this.currentUrlPath}
            advCallback={this.displayAdvertisementPopup}
            activeAdvertisement={this.state.activeAdvertisement}
            deleteAdvertisement={this.props.deleteAdvertisement}
            page={this.state.page}
            />
        </div>

          <div style={{position: 'relative', padding: '1rem', margin: '1.5rem'}}>
            <div style={{
                          boxSizing: 'border-box',
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}>
                      <ReactPaginate
                      previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={this.props.total}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={2}
                      initialPage={this.state.page}
                      forcePage={this.state.page}
                      onPageChange={this.updatePage}
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      previousClassName="page-link"
                      nextClassName="page-link"
                      activeClassName={'active'}
                    />
            </div>
          </div>
          </div>
          <div className="col-md-3">

            <FilterCard 
              title={"Time info"} 
              items={[
                {title: 'Part Time', color: 'red', value: 1},
                {title: 'Full Time', color: 'green', value: 2},
                {title: 'Freelance', color: 'blue', value: 3},
                {title: 'Flexible Hours', color: 'gray', value: 4},
              ]}
              name="workType"
              filterChange={this.changeStatus}
            />

            <FilterCard 
              title={"Status"} 
              items={[
                {title: 'Available', color: 'green', value: 1},
                {title: 'Asap', color: 'red', value: 2},
                {title: 'Pending', color: 'blue', value: 3},
                {title: 'Near Future', color: 'gray', value: 4},
              ]}
              name="status"
              filterChange={this.changeStatus}
            />

          </div>
        </div>
      </>
    );
  }

  handlePageChange = pageNumber => this.setState({activePage: pageNumber});
  

  updatePage = ({selected}) => {
    this.setState({page: selected})

    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('page', selected);
    if (this.props.history)
      this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());

    this.props.fetchAdvertisements(selected)
  }
}


const mapStateToProps = ({advertisements: {advertisements, total, page}}) => ({advertisements, total, page });
export default connect(mapStateToProps, {fetchAdvertisements, deleteAdvertisement, filterAdvertisements})(Advertisements)
