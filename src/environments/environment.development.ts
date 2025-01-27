import packageJson from '../../package.json';

export const environment = {
  production: false,
  version: packageJson.version,
  localStorageItemName: 'LchMercedesBenzDev',
  api: {
    main: 'https://localhost:7070/api/',
    reportUrl: 'https://apiportalreport.azurewebsites.net/api/',
  },
  storage: {
    token: 'LchMercedesBenzTokenDev',
  },
  //   version: {
  //     name: 'v1.3.0',
  //     date: '26-11-2024',
  //   },
};
