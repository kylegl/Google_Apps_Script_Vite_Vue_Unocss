# Google Apps Script Vue 3 Uno Css Template
This template makes it possible to use vite, vue3, & unocss in a Google Apps Script project. This uses vite for its quick dev environment and then leverages Parcel to bundle the project down to a single html file so that it works with Apps Script.

You need clasp & pnpm installed on your machine for this project.

**[clasp](https://github.com/google/clasp)**

**[pnpm](https://pnpm.io/installation)**

```
npm install -g pnpm
```
```
npm install @google/clasp -g
```

## Setup Google Apps Script Project
create new script project in your google drive

In the Code.gs file add 

``` 
// OPTIONAL: add scopes you may need for your project
// SpreadsheetApp.getUi()
// DriveApp.getRootFolder()
// UrlFetchApp.fetch()
// DocumentApp.getui()

const doGet = () => HtmlService.createTemplateFromFile('index').evaluate()
```

Click Deploy > New Deployment. Select type "web app". Set description, execute as, and who has access permissions. Click Deploy. Authorize if you added scopes. 

Get the test deployment url. Click Deploy > Test deployments. Save url for later.

Get script id. Click the setting cog and copy the Script ID.

## Setup local files
Clone this project

Login to google through clasp. From the command line enter:
```
clasp login
```

From the root of the cloned project use clasp to clone apps script project into this repository.
```
clasp clone <SCRIPT_ID> --rootDir appscript
```

Install packages
```
pnpm install
```

Start development
```
pnpm dev
```

To bundle project and push to appscript run:
```
pnpm build
```
