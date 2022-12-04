
![🇨🇦 Spectrum Management System (SMS) License Application Exporter](readme_ressources/Frame%203410.png)

### What is the spectrum management system?

The Spectrum Management System (SMS) is a Canadian government online portal that provides access to a wide range of services provided by ISED’s *(the department of Innovation, Science and Economic Development Canada)* spectrum management program.

### What problem does this project solve?

For registered radio or spectrum licensees the SMS only enables you open access to print licences, and has stuck to this rather analog way of doing things up untill now (2022). This means your personal record of these licences applications is limited - no posibility for sorting, search and reformating to a custom layout.

Also simply copying the license from the SMS isn't really an option because the engineers/user of the SMS typically have over 20 pages of tables, so everytime going in the SMS and copying everything over is not a reasonable use of their time and expertise.

### How does this project solve the problem?

This node.js application utilises puppeteer (API to control Chrome/Chromium) to in the background:

- Navigate to the SMS
- Login with given credentials
- Navigate to license applications
- Create a custom JS table object from all the licenses in the SMS

And then once the table is created the program will:

- Convert the table object into a csv string
- Export/creatre a csv file in the exports folder

Thus now enabling the user to have a csv version of their license applications for their records instead of solely print in a single click! They can now put back their time to more core tasks that make use of their skills.
