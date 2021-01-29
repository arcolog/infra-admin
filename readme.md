#Infra App

### What is it and why?
1. Each of our modern website has its own **menus, contact persons, footer links, social media links etc**, (so-called _furniture_). In not-so-good old times we managed them all in separate Google Sheets and provided for front-ends through **HeaderFooterApi** (https://github.com/Aripaev/HeaderFooterAPI).
   
2. Our websites may have also articles, which show some **big tables of data** (OC uses ID of sheet for embedding the table). We managed them also in Google Sheets and provided for front-end through **SheetsApi** (https://github.com/Aripaev/sheets-api).

InfraApp with InfraAPI are meant to:
* handle these tasks and replace legacy APIs
* make editing of menus etc more user-friendly and intuitive  
* get rid of Google Sheets dependency (Surprise! We save table's data to database)

### Install dependencies

InfraApp is built upon Create React App (https://github.com/facebook/create-react-app).

Normally `yarn install` should do the job.

As `@material-ui/icons` package is quite big, it may get _ESOCKETTIMEOUT_ error when installing with *Yarn* (although `.yarnrc` has now bigger `network-timeout` value). So you are free to try also `npm install`, but please don't add `package-lock.json` to Git.

### Start development
`yarn start`

NB! You should run also 'infra-api' in parallel, so InfraApp can access API on `localhost:3333`

You can adjust InfraApi url from `.env` 
