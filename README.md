# cims

## Requirements

Copy the .env file with `cp .env{.example,}` and provide the appropriate values.

Note the Google account you use must have the Places API enabled.

## Usage

```js
node index.js
{
  formatted_address: 'Piz Buin',
  geometry: {
    location: { lat: 46.84417529999999, lng: 10.1188828 },
    viewport: { northeast: [Object], southwest: [Object] }
  },
  types: [ 'natural_feature', 'establishment' ],
  url: 'https://maps.google.com/?cid=13870503519563558980'
}
```
