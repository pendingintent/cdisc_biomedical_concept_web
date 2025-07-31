*Instructions for starting the web application*


## Start the backend server ##
    
```
cd ./cdisc_biomedical_concept_web/webapp node server.js
```

## Start the frontend server ##

```
cd ./cdisc_biomedical_concept_web/webapp/client && npx serve -s dist -l 3000
```

### Notes ###
1. Duplicate checking has been added: the backend will now prevent adding rows to the CSV file if a row with the same combination of parent_bc_id and dec_id already exists. If a duplicate is detected, the API will return a 409 error. No further action is needed to enforce this rule.
---
2. When making changes to the web application files, in order to view the changes, ensure the following commands are executed:


    ```
    cd ./cdisc_biomedical_concept_web/webapp/client
    npx vite build
    ```
