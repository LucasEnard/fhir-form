# 1. App for FHIR forms using a local fhir server

- [1. App for FHIR forms using a local fhir server](#1-app-for-fhir-forms-using-a-local-fhir-server)
- [2. Requirements](#2-requirements)
  - [2.1. Add Node.js and npm to your path](#21-add-nodejs-and-npm-to-your-path)
  - [2.2. Install Dependencies](#22-install-dependencies)
- [3. Local FHIR server](#3-local-fhir-server)
- [4. Using the app](#4-using-the-app)
  - [4.1. Build the application](#41-build-the-application)
  - [4.2. Run the Application](#42-run-the-application)
- [5. FHIR form / questionnaire](#5-fhir-form--questionnaire)
  - [5.1. Creating your own FHIR form](#51-creating-your-own-fhir-form)
  - [5.2. Importing your FHIR form](#52-importing-your-fhir-form)

This is an app mainly based on [this repo](https://github.com/lhncbc/lforms-fhir-app) that can be used to display<br>
[FHIR](http://hl7.org/fhir/)<br>
[SDC](http://hl7.org/fhir/uv/sdc/2018Sep/index.html)<br>
[Questionnaire](http://hl7.org/fhir/uv/sdc/2018Sep/sdc-questionnaire.html)<br>
and collect data as FHIR QuestionnaireResponse resources.<br>
By building it using `docker-compose up -d` you will have access to a [local FHIR server](#5-local-fhir-server) that can then be used to test the app.

# 2. Requirements
The app relies on the [LHC-Forms](http://lhncbc.github.io/lforms/) rendering
widget for displaying forms. It has partial support for FHIR Questionnaires
(versions STU3 and R4) and the [Structured Data Capture Implementation
Guide](http://build.fhir.org/ig/HL7/sdc/).<br>
This widget will be installed with the dependencies.

For some sample forms to try, this repository comes with some forms under
`e2e-test/data/R4` that are automatically loaded into the local FHIR server at build.

## 2.1. Add Node.js and npm to your path
The file bashrc.lforms-fhir-app specifies the version of Node.js we are using
for development. Download that version of Node.js, and add its bin directory to
your path.

## 2.2. Install Dependencies
By running this command you will be able to install everything needed for the app to work.

```
npm ci
```

# 3. Local FHIR server
If you don't have a FHIR server to try this app out, you can start and use a local FHIR server powered by InterSystems technologies by doing inside the `fhir-form` folder :

```
docker-compose up -d
```

After some wait, your local FHIR server is up and you can access it by using `http://localhost:32783/fhir/r4`<br>
Note that this link is already registered in the app.

# 4. Using the app
To use the app you have to [build](#41-build-the-application) it then [start](#42-run-the-application) it.<br>
You can now access any FHIR server of your choice using the menu of the app but if you want you can use this [local FHIR server](#3-local-fhir-server)

## 4.1. Build the application
```
npm run build
```
This will create files for production in a "dist" directory, but will also copy
some needed files into place from node_modules.

## 4.2. Run the Application
```
npm run start
```
will start an http server running at port 8000.

Now browse to the app at `localhost:8000/lforms-fhir-app/`.

Here you can choose a server to connect to.<br>
If you want to use the local FHIR server, [start the local FHIR server](#3-local-fhir-server) then, on the app select the first choice `http://localhost:32783/fhir/r4`<br>

# 5. FHIR form / questionnaire

## 5.1. Creating your own FHIR form 
By using [this online tool](https://lhcformbuilder.nlm.nih.gov/beta/) you can easily build your own form from scratch or using an already existing one.<br>
We advise you to import one of the existing one in the `e2e-tests/data/R4` folder and start from here to understand how the tool works.

## 5.2. Importing your FHIR form
Using the app, you can easily import your local forms and use them right away using the `upload` button.<br><br><br>

If you are using the [formbuilder tool](https://lhcformbuilder.nlm.nih.gov/beta/), you can, if you have a FHIR server supporting the Content-Type 'application/json', export the form you are creating directly to the fhir server using the `export` button.

If your server doesn't support the Content-Type 'application/json' but only the Content-Type 'application/json+fhir' for example, as our [local FHIR server](#3-local-fhir-server) you must `export` the form to a file, then on the app, `upload` the file to the server as the app communicate in Content-Type 'application/json+fhir'.


