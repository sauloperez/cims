# cims

## Requirements

Copy the .env file with `cp .env{.example,}` and provide the appropriate values.

Note the Google account you use must have the Places API enabled.

## Usage

```js
$ node index.js
=> Loading cims database cc78daddfacd4b54bc67965f5602dc1d...
=> Searching locations...
   * Rauchkofel
         {
  formatted_address: 'Rauhkofel, 39030 Prettau, Autonomous Province of Bolzano – South Tyrol, Italy',
  geometry: {
    location: { lat: 47.0666667, lng: 12.0833333 },
    viewport: { northeast: [Object], southwest: [Object] }
  },
  types: [ 'natural_feature', 'establishment' ],
  url: 'https://maps.google.com/?cid=3340475332436902557'
}
   * Finsteraarhorn
         {
  formatted_address: 'Finsteraarhorn, 3984 Fieschertal, Switzerland',
  geometry: {
    location: { lat: 46.53707949999999, lng: 8.126402899999999 },
    viewport: { northeast: [Object], southwest: [Object] }
  },
  types: [ 'natural_feature', 'establishment' ],
  url: 'https://maps.google.com/?cid=5990109973768037386'
}
```

### providing the name of a mountain

```js
$ node index.js "Hinterer Seelenkogel"
=> Loading cims database cc78daddfacd4b54bc67965f5602dc1d...
=> Searching location...
   * Hinterer Seelenkogel
         {
  formatted_address: 'Hinterer Seelenkogel, 39013 Moos in Passeier, Autonomous Province of Bolzano – South Tyrol, Italy',
  geometry: {
    location: { lat: 46.8, lng: 11.05 },
    viewport: { northeast: [Object], southwest: [Object] }
  },
  types: [ 'natural_feature', 'establishment' ],
  url: 'https://maps.google.com/?cid=8800540990192435257'
}
```
