# cims

## Requirements

You need to first export the SECRET_TOKEN env var, to use my workspace's `cims`
Notion integration, and the GOOGLE_MAPS_API_KEY one.

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
