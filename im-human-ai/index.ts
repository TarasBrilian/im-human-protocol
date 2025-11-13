import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://api.blockvision.org/v2/sui/account/activities?address=0x4f21032bd4257c2d67a8f7c7bf8055f3c9516b57bb777cb0a724bb16adff63df&limit=20',
  headers: {accept: 'application/json', 'x-api-key': '35NQgsg94SvGraNug4Q304TQs4Z'}
};

axios
  .request(options)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));