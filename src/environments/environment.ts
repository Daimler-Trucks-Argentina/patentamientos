import packageJson from '../../package.json';

export const environment = {
  production: true,
  version: packageJson.version,
  localStorageItemName: 'LchMercedesBenzProd',
  api: {
    main: 'https://api-emplacamentos-argentina-prod.azurewebsites.net/api/',
    reportUrl: 'https://apiportalreport.azurewebsites.net/api/',
  },
  storage: {
    token: 'LchMercedesBenzTokenProd',
  },
  //   version: {
  //     name: 'v1.3.0',
  //     date: '26-11-2024',
  //   },
};
