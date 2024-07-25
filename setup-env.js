const setEnv = () => {
    const fs = require('fs');
    const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
    const targetPath = './src/environments/environment.ts';
  // Load node modules
    const appVersion = require('./package.json').version;
    require('dotenv').config({
      path: 'src/environments/.env'
    });
  // `environment.ts` file structure
    const envConfigFile = `export const environment = {
        cmsSpaceId: '${process.env['CMS_SPACE_ID']}',
        cmsToken: '${process.env['CMS_TOKEN']}',
        appVersion: '${appVersion}',
        production: true,
    };
  `;
    writeFile(targetPath, envConfigFile, (err) => {
      if (err) {
        console.error(err);
        throw err;
      } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
      }
    });
  };
  
  setEnv();