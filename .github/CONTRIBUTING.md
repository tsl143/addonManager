# Contributions Guidelines

You are welcome to contribute to this project. Here are the guidelines we try to stick to in this project.


* [Install addon locally](#Install-addon-locally)
* [Translate in your language](#Internationalization)
* [Feature Requests](#feature-requests)


## Install addon locally

1. Clone the repository/

2. Following as per your browser
    ##### For Firefox
    a. In Firefox's address bar type 'about:debugging' and hit enter.

    b. Click on 'Load Temporary Add On' button.

    c. Navigate through your files to find the folder where you have clone the repository and select `manifest.json` file (from `src/manifest.json`).

    ##### For Chrome
    a. Goto More Tools > Extensions.

    b. Check `Developer Mode` (right top corner)

    c. Cliock `Load Unpacked`

    d. Navigate through your files to find the folder where you have clone the repository and select `src` folder

3. Permission Inspector should now be installed. To use it, Click <img width="32" src="../src/icons/icon_64.png"> that appears in the toolbar.

# Translate in your language

1. Go to [`_locales`](https://github.com/tsl143/addonManager/tree/master/src/_locales).

2. Check if your language is already there, want to improve any string? Go to your language folder and make changes and raise a pull request.

3. If you want to add a new language use this [tool](https://lusito.github.io/web-ext-translator/) to translate and raise a pull request

## Feature Requests

You can request a new feature by [submitting an issue](#filing-an-issue) to our repo. If you would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed first in an issue so that we can better coordinate our efforts, prevent duplication of work, and help you to craft the change so that it is successfully accepted into the project.
* **Small Changes** can be crafted and submitted as a Pull Request.
