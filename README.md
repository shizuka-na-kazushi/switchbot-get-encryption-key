
# SwitchBot Get Encryption Key

This is port of only part of `get_cncryption_key` script from [pySwitchbot](https://github.com/Danielhiversen/pySwitchbot), just rewrite code on NodeJS.


How to install:

```bash
$ npm install switchbot-get-encryption-key
```

Usage: 

```bash
$ npx switchbot-get-encryption-key MAC USERNAME
Key ID: xx
Encryption key: xxxxxxxxxxxxxxxx
```

MAC need to be without colon and upper case (e.g. ABCDE1234567).


Data obtained by this script would be used by `WoSmartLock.setKey()` function in [node-switchbot](https://github.com/OpenWonderLabs/node-switchbot) library, or custom implementation of BLE central which directly communicates to [SwitchBot Lock](https://us.switch-bot.com/products/switchbot-lock) / [Lock Pro](https://us.switch-bot.com/products/switchbot-lock-pro) by encrypted BLE commands.

