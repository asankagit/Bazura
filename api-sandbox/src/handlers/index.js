const vm = require('@asanka-npm/jsc-vm').default

const defaultTimeout = process.env.DEFAULT_TIMEOUT;

exports.sandboxHandler = async (event) => {
    // if (event.httpMethod !== 'POST') {
    //     throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    // }


    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const jsCode = body.code || `
    const date = new Date();
    date;
    `
    const excutedResult = await new Promise((resolve, reject) => {
        try {
            vm({
                params: { code: jsCode },
                callback: async (args) => {
                    resolve(args)
                }
            });
        } catch (error) {
            reject(error)
        }



    })

    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(excutedResult)
    };


    return response;
};
