const path = require('path');
const { default: axios } = require('axios');
const { v4: uuid } = require('uuid');
const config = require('../configs');
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');

const login = (req, res) => {
  const {
    service_id,
    redirect_uri,
    type,
    auth_request_url,
    verify_auth_info_url,
  } = config;
  const state = uuid();
  const encoded_redirect_uri = encodeURIComponent(redirect_uri);
  let auth_uri = auth_request_url;
  auth_uri = auth_uri.concat(`?service_id=${service_id}`);
  auth_uri = auth_uri.concat(`&redirect_uri=${encoded_redirect_uri}`);
  auth_uri = auth_uri.concat(`&state=${state}`);
  auth_uri = auth_uri.concat(`&type=${type}`);
  // auth_uri = auth.mykeepin.com/didauth/v1/authorize/view?service_id={service_id}&redirect_uri={redirect_uri}&state={state}&type={type}
  res.redirect(auth_uri);
};

const redirect1 = async (req, res, next) => {
  const { service_id, verify_auth_info_url } = config;
  const { code, state } = req.query;
  try {
    const response = await axios({
      method: 'get',
      url: `${verify_auth_info_url}/${service_id}/${state}/${code}`,
      headers: {
        accept: 'application/json',
      },
    });
    const { did, vp, signature } = response.data.data;
    const user = new User({ did, vp, signature });
    await user.save();
    req.session.userId = user._id;
    return res.sendFile(path.join(__dirname, '..', 'public', '01.main.html'));
  } catch (error) {
    next(error);
  }
};

module.exports = { login, redirect1 };
