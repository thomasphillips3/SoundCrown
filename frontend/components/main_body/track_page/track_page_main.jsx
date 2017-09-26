import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

class TrackPageMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      track: this.props.track,
      play: false
    };
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentWillMount() {
    this.props.getTrack(this.props.match.params.trackId)
      .then( response => this.setState(response.track));
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    console.log(this.state);
    if(this.state.track){
      if((nextProps.track.id === this.state.track.id)) {
        this.setState({
          play: nextProps.trackData.play
        });
      }
    }
  }

  renderElapsedTime() {
    let seconds = Math.floor((new Date() - this.state.created_at) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  togglePlay() {
    const newState = !this.state.play;
    this.setState({ play: newState });
    this.props.callbackApp({
      track: this.props.track,
      play: newState
    });
  }

  render () {
    console.log(this.state);
    const active = this.state.track;
    const play = this.state.play;
    if(this.state.title) {
      if (this.state.title.length > 0) {
        let playPauseClass = classnames('fa', {'fa-pause': play}, {'fa-play': !play});
        return (
            <div className="track-header-bg">
              <div className="track-header-data">
                <button onClick={this.togglePlay} className="player-btn big" title="Play/Pause">
                  <i className={playPauseClass} />
                </button>
                <Link className="track-header-username" to={`/${this.state.creator}/`}>{this.state.creator}</Link>
                <div className="track-header-trackname">{this.state.title}</div>
              </div>
              <div className="track-header-right">
                <div className="track-header-time">{ this.renderElapsedTime()}{' ago'}</div>
                <div className="track-cover-art-container">
                  <img className="track-cover-art" src={this.state.cover_art_url}/>
                </div>
              </div>

            </div>
        );
      } else {
        return <div></div>;
      }
    } else {
      return <div></div>;
    }
  }
}


export default TrackPageMain;
