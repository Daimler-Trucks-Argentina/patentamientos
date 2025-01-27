import packageJson from '../../package.json';

export const environment = {
  production: true,
  version: packageJson.version,
  localStorageItemName: 'LchMercedesBenzStag',
  api: {
    main: 'https://api-emplacamentos-argentina-hml.azurewebsites.net/api/',
    reportUrl: 'https://apiportalreport.azurewebsites.net/api/',
  },
  storage: {
    token: 'LchMercedesBenzTokenStag',
  },
  //   version: {
  //     name: 'v1.3.0',
  //     date: '26-11-2024',
  //   },
};
