#!/usr/bin/env node

const api_config = require("./api_config");
const getpass = require("./getpass");

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    const url = `https://account.${api_config.SWITCHBOT_APP_API_BASE_URL}/account/api/v1/user/login`;
    const method = 'POST';

    const body = JSON.stringify({
      "clientId": api_config.SWITCHBOT_APP_CLIENT_ID,
      "username": username,
      "password": password,
      "grantType": "password",
      "verifyCode": "",
    });

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((r) => r.json()).then((json) => {
      // console.log('------ user login -----')
      // console.log(JSON.stringify(json, null, ' '));
      if (json.statusCode && json.statusCode == 100) {
        resolve(json.body.access_token);
      } else {
        reject(new Error(json.message));
      }
    }).catch((e) => {
      reject(e);
    })
  })
}

const userInfo = (access_token) => {
  return new Promise((resolve, reject) => {
    const url = `https://account.${api_config.SWITCHBOT_APP_API_BASE_URL}/account/api/v1/user/userinfo`;
    const method = 'POST';

    const body = JSON.stringify({});

    fetch(url, {
      method: method,
      headers: {
        'Authorization': access_token,
        'Content-Type': 'application/json',
      },
      body,
    }).then((r) => r.json()).then((json) => {
      // console.log('------ user info -----')
      // console.log(JSON.stringify(json, null, ' '));
      if (json.statusCode && json.statusCode == 100) {
        resolve({ access_token, user_info: json.body });
      } else {
        reject(new Error(json.message));
      }
    }).catch((e) => {
      reject(e);
    })
  })
}

const communicate = (access_token, region, device_mac) => {
  return new Promise((resolve, reject) => {

    const url = `https://wonderlabs.${region}.${api_config.SWITCHBOT_APP_API_BASE_URL}/wonder/keys/v1/communicate`;
    const method = 'POST';

    const body = JSON.stringify({
      "device_mac": device_mac,
      "keyType": "user",
    });

    fetch(url, {
      method: method,
      headers: {
        'Authorization': access_token,
        'Content-Type': 'application/json',
      },
      body,
    }).then((r) => r.json()).then((json) => {
      // console.log('------ communicate -----')
      // console.log(JSON.stringify(json, null, ' '))
      if (json.statusCode && json.statusCode == 100) {
        resolve(json.body.communicationKey);
      } else {
        reject(new Error(json.message));
      }
    }).catch((e) => {
      reject(e);
    })
  })
}

async function main(argv) {

  if (argv.length < 4) {
    console.log(`Usage: ${argv[1]} <device_mac> <username> [<password>]`);
    process.exit(-1);
  }

  let password = '';
  if (argv.length === 4) {
    password = await getpass();
  } else {
    password = argv[4];
  }

  const deviceMac = argv[2];
  const username = argv[3];

  try {
    const access_token = await login(username, password);
    const result = await userInfo(access_token);
    const communicationKey = await communicate(access_token, result.user_info.botRegion, deviceMac);
    console.log(`Key ID: ${communicationKey.keyId}`);
    console.log(`Encryption key: ${communicationKey.key}`);
  }
  catch (e) {
    console.error(e);
  }
};

main(process.argv);

