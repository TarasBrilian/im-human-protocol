import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://api.blockberry.one/walrus-mainnet/v1/accounts/0x57956585e6595965e92a297119e7f6fe3b76ce62297ba61cabe91751ea32c3d2',
  headers: {accept: '*/*', 'x-api-key': 'YH9XIU8b2vyXyQyXLPjo5IGIICsyXN'}
};

axios
  .request(options)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));