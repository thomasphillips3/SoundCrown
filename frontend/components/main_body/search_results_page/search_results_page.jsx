import React from 'react';
import ReactDOM from 'react-dom';
import TrackIndexItem from '../tracks/track_index_item';
import AppModal from '../../misc_tools/modal';
const queryString = require('query-string');

class SearchResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      active: null,
      play: false,
      user: this.props.user
    };
    this.renderTrackList = this.renderTrackList.bind(this);
  }

  componentDidMount() {
    let query = queryString.parse(this.props.location.search);
    this.props.getSearchTracks(query.q);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tracks !== this.state.tracks) {
      this.setState({ tracks: nextProps.tracks });
    }
  }

  componentWillUnmount() {
    this.setState({
      tracks: null,
      ready: false
    });
  }

  onIndexItemChanged(newState) {
    this.setState({ track: newState.track, play: newState.play });
    this.props.callbackApp({
      tracks: this.props.tracks,
      track: newState.track,
      play: newState.play
    });
  }

  renderTrackList () {
    const tracks = Object.values(this.props.tracks);
    let query = queryString.parse(this.props.location.search);
    if (tracks.length > 0) {
      return (
        <ul className="search-tracklist">
          {
            tracks.map((track, idx) => {
              return <TrackIndexItem key={idx}
                track={track}
                play={this.props.trackData.play}
                active={this.props.trackData.active}
                currentUser={this.props.currentUser}
                history={this.props.history}
                callbackIndex={(newState) => this.onIndexItemChanged(newState)}
              />;
            })
          }
        </ul>
      );
    } else {
      return (
        <div className="search-no-results-page">
          <div className="search-no-results-img"><i className="fa fa-search" /></div>
          <div className="search-no-results-description">Sorry we didn't find any results for "{query.q}"</div>
          <div className="search-no-results-description">Check the spelling, or try a different search.</div>
        </div>
      );
    }
  }

  render() {
    let query = queryString.parse(this.props.location.search);
    const tracks = Object.values(this.props.tracks);
    return (
      <div className="search-page">
        <div className="search-tracklist-section">
          <div className="search-track-header">
            <h1 className="search-track-h1">Search results for "{query.q}"</h1>
          </div>
          { this.renderTrackList() }
        </div>
      </div>
    );
  }

}

export default SearchResultsPage;
