import React, { Component } from 'react';

import styles from './EnterLocation.css';

// Google Maps Autocomplete
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import geocode from 'react-geocode';

import callApi from '../../../util/apiCaller';

export class EnterLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            location: null,
            loading: false,
            tones: null,
        };
        geocode.setApiKey('AIzaSyARnb_Gfb2-DHcCIK9gfX88RDyCys7cXIU');
    }

    getUserCurrentPosition = () => {
        this.setState({ loading: true });
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const location = { lat: latitude.toString(), long: longitude.toString() };
            geocode.fromLatLng(latitude, longitude)
                .then(response => {
                    const address = response.results[0].formatted_address;
                    this.setState({ address, location, loading: false });
                    console.log(this.state);
                }, error => {
                    console.error(error);
                });
        });
    }

    getSentiment = () => {
        callApi('sentiment', 'post', this.state.location)
            .then(tones => {
                this.setState({ tones });
                console.log(tones);
            });
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        geocodeByAddress(address)
          .then(results => getLatLng(results[0]))
          .then(latLng => {
              const location = { lat: latLng.lat.toString(), long: latLng.lng.toString() };
              this.setState({ location });
          })
          .catch(error => console.error('Error', error));
    };

    returnToneList = (tones) => {
        return (
          <div className={styles.searchBox}>
                {tones.map(tone => {
                    return (
                      <div className={styles.toneBox}>
                        <div>{tone.tone_name}</div>
                        <div>{tone.score * 100}</div>
                      </div>
                    );
                })}
          </div>
            );
    }

    returnMainContainer = () => {
        return (
          <div className={styles.mainContainer}>
                  {this.state.loading ? <div>Working...</div> :
                    <div className={styles.searchBox}>
                      <button onClick={this.getUserCurrentPosition}>Use my location</button>
                      <div className={styles.divider}>OR</div>
                      <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                        style={styles.locationSearch}
                      >
                          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                              <input
                                style={{
                                    width: '200px',
                                    height: '30px',
                                    borderRadius: '4px',
                                    border: '1px solid bisque',
                                    padding: '0 0.4rem',
                                    fontSize: '16px',
                                }}
                                {...getInputProps({
                                    placeholder: 'Search Places ...',
                                    className: 'locationSearch',
                                })}
                              />
                              <div className="autocomplete-dropdown-container">
                              {loading && <div>Loading...</div>}
                              {suggestions.map(suggestion => {
                                  const className = suggestion.active
                                  ? 'suggestion-item--active'
                                  : 'suggestion-item';
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                      })}
                                    >
                                      <span>{suggestion.description}</span>
                                    </div>
                                  );
                              })}
                              </div>
                            </div>
                          )}
                      </PlacesAutocomplete>
                      {this.state.address ? <div className={styles.use}>Use the location: {this.state.address} </div> : null}
                      <button onClick={this.getSentiment} className={styles.goButton}>Get Some Feelings</button>
                    </div>}
          </div>
        );
    }

    render() {
        const { tones } = this.state;
        return (
            tones ? this.returnToneList(tones.document_tone.tones) : this.returnMainContainer()
        );
    }
}

export default EnterLocation;
