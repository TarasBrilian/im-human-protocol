import axios from 'axios';

export const fetchUserActivities = async (addressUser: string) => {
  const options = {
    method: 'GET',
    url: `https://api.blockvision.org/v2/sui/account/activities?address=${addressUser}&limit=20`,
    headers: {
      accept: 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY
    }
  };

  axios
    .request(options)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
};
