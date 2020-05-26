
const fetch = require('node-fetch')


console.log('versionguigit ==========================')
const url = 'https://api.github.com/repos/spotnik-ham/gui/contents/version_gui?ref=Version_4'

const get_data = async url => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        console.log("=======================================================")
        const content = json.content;
        console.log('content: ', content)

        let buff = Buffer.from(content, 'base64');
        let text = buff.toString('utf-8');
        console.log('text : ', text);
    } catch (error) {
        console.log(error);
    }
};

get_data(url);